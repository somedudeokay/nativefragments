import {
  createRoutes,
  notFoundRoute,
  renderFragment,
  renderRoute,
} from "../server/index.js";
import {
  deferredFragmentBootstrap,
  inlineDeferredFragments,
  renderDeferredFragment,
} from "../server/router.js";

const assetLike = (url) =>
  /\.[a-zA-Z0-9]+$/.test(url.pathname) ||
  url.pathname.startsWith("/app/") ||
  url.pathname.startsWith("/assets/") ||
  url.pathname.startsWith("/nativefragments/");

const requestWantsFragment = (request) =>
  request.headers.get("x-fragment") === "true";

const requestedFragmentSlot = (request) =>
  request.headers.get("x-fragment-slot");

const encoder = new TextEncoder();
const defaultContentSecurityPolicy = "frame-ancestors 'self'";

const createNonce = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
};

const securityHeaders = ({ contentSecurityPolicy, nonce, request }) => {
  const headers = {
    "X-Content-Type-Options": "nosniff",
  };
  const policy =
    typeof contentSecurityPolicy === "function"
      ? contentSecurityPolicy({ nonce, request })
      : contentSecurityPolicy;

  if (policy) {
    headers["Content-Security-Policy"] = policy;
  }

  return headers;
};

const htmlHeaders = ({ contentSecurityPolicy, nonce, request }) => ({
  "Content-Type": "text/html; charset=utf-8",
  ...securityHeaders({ contentSecurityPolicy, nonce, request }),
});

const shellMarker = () =>
  `<!--nativefragments-body-${Math.random().toString(36).slice(2)}-->`;

const isStreamingShell = (value) =>
  value &&
  typeof value === "object" &&
  typeof value.before === "string" &&
  typeof value.after === "string";

const renderShellDocument = (shell, rendered, nonce) => {
  const document = shell({ ...rendered, nonce });
  return isStreamingShell(document)
    ? `${document.before}${rendered.body}${document.after}`
    : document;
};

const splitShell = ({ shell, meta, nonce }) => {
  const streamingShell = shell({ meta, nonce });
  if (isStreamingShell(streamingShell)) return streamingShell;

  const marker = shellMarker();
  const document = shell({ body: marker, meta, nonce });
  const markerIndex = document.indexOf(marker);

  if (markerIndex === -1) return null;

  return {
    before: document.slice(0, markerIndex),
    after: document.slice(markerIndex + marker.length),
  };
};

const streamDocument = async ({ headers, nonce, shell, rendered, status }) => {
  const split = splitShell({ shell, meta: rendered.meta, nonce });
  if (!split) {
    console.warn(
      "Native Fragments: the shell does not expose a body insertion point, so deferred fragments were buffered instead of streamed. Return { before, after } from the shell, or interpolate `body` into the document unmodified, to enable streaming.",
    );
    const completed = await inlineDeferredFragments(rendered);
    return new Response(renderShellDocument(shell, completed, nonce), {
      headers,
      status,
    });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const write = (chunk) => writer.write(encoder.encode(chunk));

  Promise.resolve()
    .then(async () => {
      await write(split.before);
      await write(rendered.body);
      await write(deferredFragmentBootstrap({ nonce }));
      await Promise.all(
        rendered.deferred.map(async (task) => {
          await write(await renderDeferredFragment(task));
        }),
      );
      await write(split.after);
      await writer.close();
    })
    .catch(async (error) => {
      await writer.abort(error);
    });

  return new Response(readable, {
    headers,
    status,
  });
};

/**
 * @typedef {import("../server/router.js").Route} Route
 */

/**
 * @typedef {object} CloudflareHandlerOptions
 * @property {Route[]} routes App route definitions.
 * @property {(rendered: { body?: string, meta: object, nonce?: string }) => string | { before: string, after: string }} shell
 * Function that wraps a rendered route body in a full HTML document.
 * @property {{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }} [api]
 * Optional Web Standards API router. Hono apps work here because they expose a
 * compatible `fetch` method.
 * @property {string} [apiPrefix="/api"] URL prefix handled by `api`.
 * @property {Route} [notFound] Optional 404 route.
 * @property {string} [assetsBinding="ASSETS"] Cloudflare assets binding name.
 * @property {number | null} [deferredTimeout=15000] Default timeout in
 * milliseconds for each deferred fragment renderer. Set `null` to disable.
 * @property {string | false | ((options: { nonce: string, request: Request }) => string | false)} [contentSecurityPolicy]
 * Content Security Policy header. Defaults to `frame-ancestors 'self'`. Pass a
 * function to build a nonce-based strict policy.
 */

/**
 * Create a Cloudflare Worker module for a Native Fragments app.
 *
 * Static assets are served from the configured assets binding. Normal document
 * requests render the app shell. Requests with `x-fragment: true` return only
 * the route body plus fragment metadata. Requests under `apiPrefix` are
 * delegated to the optional API router before app route matching.
 *
 * @param {CloudflareHandlerOptions} options Worker adapter options.
 * @returns {{ fetch(request: Request, env: Record<string, unknown>): Promise<Response> }}
 * Cloudflare Worker module.
 */
export const createCloudflareHandler = ({
  routes,
  shell,
  api,
  apiPrefix = "/api",
  notFound = notFoundRoute,
  assetsBinding = "ASSETS",
  deferredTimeout = 15_000,
  contentSecurityPolicy = defaultContentSecurityPolicy,
}) => {
  const manifest = createRoutes(routes);

  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      const assets = env?.[assetsBinding];
      const nonce = createNonce();
      const headers = htmlHeaders({ contentSecurityPolicy, nonce, request });

      if (api && (url.pathname === apiPrefix || url.pathname.startsWith(`${apiPrefix}/`))) {
        return api.fetch(request, env, context);
      }

      if (assetLike(url) && assets) {
        const asset = await assets.fetch(request);
        if (asset.status !== 404) return asset;
      }

      const match = manifest.match(url.pathname) ?? notFound;
      const status = match === notFound ? 404 : 200;
      const wantsFragment = requestWantsFragment(request);
      const slot = wantsFragment ? requestedFragmentSlot(request) : null;
      const rendered = await renderRoute({
        deferredTimeout,
        match,
        request,
        slot,
      });

      const completed = wantsFragment ? await inlineDeferredFragments(rendered) : rendered;
      const streamsDocument = !wantsFragment && completed.deferred?.length;
      const response = streamsDocument
        ? await streamDocument({ headers, nonce, shell, rendered: completed, status })
        : new Response(
            wantsFragment ? renderFragment(completed) : renderShellDocument(shell, completed, nonce),
            { headers, status },
          );

      return response;
    },
  };
};
