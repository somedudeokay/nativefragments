import {
  createApi,
  createRoutes,
  errorRoute as defaultErrorRoute,
  notFoundRoute,
  raw,
  renderFragment,
  renderRoute,
} from "../server/index.js";
import {
  deferredFragmentBootstrap,
  inlineDeferredFragments,
  renderDeferredFragment,
} from "../server/defer.js";
import {
  runRouteAction,
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

const fragmentUrlHeader = "X-NativeFragments-URL";

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
  Vary: "x-fragment, x-fragment-slot",
  ...securityHeaders({ contentSecurityPolicy, nonce, request }),
});

const mergeHeaders = (defaults, overrides = {}) => {
  const headers = new Headers(defaults);
  for (const [name, value] of Object.entries(overrides)) {
    headers.set(name, String(value));
  }
  return headers;
};

const shellMarker = () =>
  `<!--nativefragments-body-${Math.random().toString(36).slice(2)}-->`;

const isStreamingShell = (value) =>
  value &&
  typeof value === "object" &&
  "before" in value &&
  "after" in value;

const isRedirectResponse = (response) =>
  response.status >= 300 &&
  response.status < 400 &&
  response.headers.has("location");

const withFragmentUrl = (response, url) => {
  if (response.headers.has(fragmentUrlHeader)) return response;
  const headers = new Headers(response.headers);
  headers.set(fragmentUrlHeader, url.href);
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
};

const renderShellDocument = (shell, rendered, nonce) => {
  const document = shell({ ...rendered, body: raw(rendered.body), nonce });
  return isStreamingShell(document)
    ? `${String(document.before)}${rendered.body}${String(document.after)}`
    : String(document);
};

const splitShell = ({ shell, meta, nonce }) => {
  const streamingShell = shell({ meta, nonce });
  if (isStreamingShell(streamingShell)) {
    return {
      before: String(streamingShell.before),
      after: String(streamingShell.after),
    };
  }

  const marker = shellMarker();
  const document = String(shell({ body: raw(marker), meta, nonce }));
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
    return new Response(String(renderShellDocument(shell, completed, nonce)), {
      headers,
      status,
    });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const write = (chunk) => writer.write(encoder.encode(String(chunk)));

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
 * @property {(rendered: { body?: import("../server/html.js").RawHtml, meta: object, nonce?: string }) => string | import("../server/html.js").RawHtml | { before: string | import("../server/html.js").RawHtml, after: string | import("../server/html.js").RawHtml }} shell
 * Function that wraps a rendered route body in a full HTML document.
 * @property {{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response } | import("../server/api.js").ApiRoute[]} [api]
 * Optional Web Standards API router or array of `apiRoute()` definitions. Hono
 * apps work here because they expose a compatible `fetch` method.
 * @property {string} [apiPrefix="/api"] URL prefix handled by `api`.
 * @property {Route} [notFound] Optional 404 route.
 * @property {Route} [error] Optional 500 route.
 * @property {({ error, request, phase }: { error: unknown, request: Request, phase: "route" | "error-route" | "api" }) => void} [onError]
 * Error hook for caught route, error-route, and API failures.
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
  error = defaultErrorRoute,
  onError = (event) => console.error("Native Fragments:", event.error),
  assetsBinding = "ASSETS",
  deferredTimeout = 15_000,
  contentSecurityPolicy = defaultContentSecurityPolicy,
}) => {
  const manifest = createRoutes(routes);
  const apiRouter = Array.isArray(api)
    ? createApi(api, {
        onError: ({ error: apiError, request: apiRequest }) =>
          onError({ error: apiError, request: apiRequest, phase: "api" }),
      })
    : api;

  const methodNotAllowed = (match) =>
    new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: `GET, HEAD${match.action ? ", POST" : ""}`,
      },
    });

  const renderHtml = async ({
    headers,
    match,
    nonce,
    request,
    redirectDepth = 0,
    statusOverride,
  }) => {
    const wantsFragment = requestWantsFragment(request);
    const slot = wantsFragment ? requestedFragmentSlot(request) : null;
    const rendered = await renderRoute({
      deferredTimeout,
      match,
      request,
      slot,
    });

    if ("response" in rendered) {
      if (
        wantsFragment &&
        redirectDepth < 8 &&
        isRedirectResponse(rendered.response)
      ) {
        const redirectUrl = new URL(
          rendered.response.headers.get("location"),
          request.url,
        );
        if (redirectUrl.origin === new URL(request.url).origin) {
          const redirectMatch = manifest.match(redirectUrl.pathname);
          if (redirectMatch) {
            const redirectRequest = new Request(redirectUrl, {
              headers: request.headers,
              method: "GET",
              signal: request.signal,
            });
            const response = await renderHtml({
              headers,
              match: redirectMatch,
              nonce,
              redirectDepth: redirectDepth + 1,
              request: redirectRequest,
            });
            return withFragmentUrl(response, redirectUrl);
          }
        }
      }
      return rendered.response;
    }

    const responseHeaders = mergeHeaders(headers, rendered.headers);
    const completed = wantsFragment ? await inlineDeferredFragments(rendered) : rendered;
    const streamsDocument = !wantsFragment && completed.deferred?.length;
    const status = statusOverride ?? rendered.status;

    return streamsDocument
      ? streamDocument({
          headers: responseHeaders,
          nonce,
          shell,
          rendered: completed,
          status,
        })
      : new Response(
          String(
            wantsFragment
              ? renderFragment(completed)
              : renderShellDocument(shell, completed, nonce),
          ),
          { headers: responseHeaders, status },
        );
  };

  const renderErrorResponse = async ({ headers, nonce, request }) => {
    try {
      return await renderHtml({
        headers,
        match: error,
        nonce,
        request,
        statusOverride: 500,
      });
    } catch (fallbackError) {
      onError({ error: fallbackError, request, phase: "error-route" });
      return new Response("Internal error", {
        status: 500,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }
  };

  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      const assets = env?.[assetsBinding];
      const nonce = createNonce();
      const headers = htmlHeaders({ contentSecurityPolicy, nonce, request });

      if (apiRouter && (url.pathname === apiPrefix || url.pathname.startsWith(`${apiPrefix}/`))) {
        try {
          return await apiRouter.fetch(request, env, context);
        } catch (apiError) {
          onError({ error: apiError, request, phase: "api" });
          return Response.json({ error: "Internal error" }, { status: 500 });
        }
      }

      if (assetLike(url) && assets) {
        const asset = await assets.fetch(request);
        if (asset.status !== 404) return asset;
      }

      const routeMatch = manifest.match(url.pathname);
      const match = routeMatch ?? notFound;
      const method = request.method.toUpperCase();

      try {
        if (routeMatch) {
          if (method === "POST") {
            if (!match.action) return methodNotAllowed(match);
            return await runRouteAction({ match, request });
          }
          if (method !== "GET" && method !== "HEAD") {
            return methodNotAllowed(match);
          }
        }

        return await renderHtml({
          headers,
          match,
          nonce,
          request,
          statusOverride: routeMatch ? undefined : 404,
        });
      } catch (routeError) {
        onError({ error: routeError, request, phase: "route" });
        return renderErrorResponse({ headers, nonce, request });
      }
    },
  };
};
