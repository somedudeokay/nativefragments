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
  warnForMissingDeferredSlots,
} from "../server/defer.js";
import { runRouteAction } from "../server/router.js";
import { createRequestContext, reportError } from "../server/context.js";

const assetLike = (url) =>
  /\.[a-zA-Z0-9]+$/.test(url.pathname) ||
  url.pathname.startsWith("/app/") ||
  url.pathname.startsWith("/assets/");

const requestWantsFragment = (request) =>
  request.headers.get("x-fragment") === "true";

const requestedFragmentSlot = (request) =>
  request.headers.get("x-fragment-slot");

const fragmentUrlHeader = "X-NativeFragments-URL";
const fragmentProtocolHeader = "X-NativeFragments-Protocol";
const fragmentProtocolVersion = "2";
const fragmentStreamHeader = "X-NativeFragments-Stream";

const requestSupportsFragmentStreaming = (request) =>
  request.headers.get(fragmentProtocolHeader) === fragmentProtocolVersion;

const encoder = new TextEncoder();
const defaultContentSecurityPolicy = "frame-ancestors 'self'";

const createNonce = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
};

const createStreamToken = () =>
  createNonce().replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fragmentStreamBoundary = (token) =>
  `<!--nativefragments-stream-${token}-->`;

const fragmentStreamEnd = (token) =>
  `<!--nativefragments-stream-${token}-end-->`;

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
  Vary: "x-fragment, x-fragment-slot, x-nativefragments-protocol",
  ...securityHeaders({ contentSecurityPolicy, nonce, request }),
});

const mergeHeaders = (defaults, overrides = {}) => {
  const headers = new Headers(defaults);
  for (const [name, value] of Object.entries(overrides)) {
    if (name.toLowerCase() === "vary") {
      const fields = new Set(
        `${headers.get("vary") ?? ""},${value}`
          .split(",")
          .map((field) => field.trim().toLowerCase())
          .filter(Boolean),
      );
      headers.set(name, fields.has("*") ? "*" : [...fields].join(", "));
      continue;
    }
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

// Protocol 2 lets fetch apply Set-Cookie before the browser follows the next hop.
// Unknown clients receive native redirects and let the browser handle HTTP semantics.
const fragmentResponse = (response, request) => {
  if (!requestWantsFragment(request) || !requestSupportsFragmentStreaming(request) ||
      !isRedirectResponse(response)) return response;
  const headers = new Headers(response.headers);
  headers.set("X-NativeFragments-Redirect", new URL(headers.get("location"), request.url).href);
  headers.set(fragmentProtocolHeader, fragmentProtocolVersion);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.delete("Content-Length");
  headers.delete("Location");
  void response.body?.cancel().catch(() => {});
  return new Response(null, { status: 200, headers });
};

const renderShellDocument = async (shell, rendered, nonce) => {
  const document = await shell({ ...rendered, body: raw(rendered.body), nonce });
  return isStreamingShell(document)
    ? `${String(document.before)}${rendered.body}${String(document.after)}`
    : String(document);
};

const splitShell = async ({ shell, meta, nonce }) => {
  const streamingShell = await shell({ meta, nonce });
  if (isStreamingShell(streamingShell)) {
    return {
      before: String(streamingShell.before),
      after: String(streamingShell.after),
    };
  }

  const marker = shellMarker();
  const document = String(await shell({ body: raw(marker), meta, nonce }));
  const markerIndex = document.indexOf(marker);

  if (markerIndex === -1) return null;

  return {
    before: document.slice(0, markerIndex),
    after: document.slice(markerIndex + marker.length),
  };
};

const placedDeferredTasks = (rendered) =>
  rendered.deferred.filter((task) => rendered.body.includes(task.placeholder));

const streamDocument = async ({ headers, nonce, shell, rendered, status }) => {
  const split = await splitShell({ shell, meta: rendered.meta, nonce });
  if (!split) {
    console.warn(
      "Native Fragments: the shell does not expose a body insertion point, so deferred fragments were buffered instead of streamed. Return { before, after } from the shell, or interpolate `body` into the document unmodified, to enable streaming.",
    );
    const completed = await inlineDeferredFragments(rendered);
    return new Response(String(await renderShellDocument(shell, completed, nonce)), {
      headers,
      status,
    });
  }

  const { readable, writable } = new TransformStream();
  warnForMissingDeferredSlots(rendered);
  const deferred = placedDeferredTasks(rendered);
  const writer = writable.getWriter();
  void writer.closed.catch(error => rendered.cancel?.(error));
  const write = (chunk) => writer.write(encoder.encode(String(chunk)));

  Promise.resolve()
    .then(async () => {
      await write(split.before);
      await write(rendered.body);
      await write(deferredFragmentBootstrap({ nonce }));
      await Promise.all(
        deferred.map(async (task) => {
          await write(await renderDeferredFragment(task, { document: true }));
        }),
      );
      await write('<template data-nativefragments-stream-complete></template>');
      await write(split.after);
      await writer.close();
    })
    .catch(async (error) => {
      rendered.cancel?.(error);
      await writer.abort(error).catch(() => {});
    });

  return new Response(readable, {
    headers,
    status,
  });
};

const streamFragment = ({ headers, rendered, status }) => {
  const token = createStreamToken();
  const boundary = fragmentStreamBoundary(token);
  const end = fragmentStreamEnd(token);
  const responseHeaders = new Headers(headers);
  responseHeaders.set(fragmentStreamHeader, token);
  warnForMissingDeferredSlots(rendered);
  const deferred = placedDeferredTasks(rendered);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  void writer.closed.catch(error => rendered.cancel?.(error));
  const write = (chunk) => writer.write(encoder.encode(String(chunk)));
  let frameWrites = Promise.resolve();
  const writeFrame = (frame) => {
    frameWrites = frameWrites
      .then(() => write(frame))
      .then(() => write(boundary));
    return frameWrites;
  };

  Promise.resolve()
    .then(async () => {
      await write(boundary);
      await writeFrame(renderFragment(rendered));
      await Promise.all(
        deferred.map(async (task) =>
          writeFrame(await renderDeferredFragment(task)),
        ),
      );
      await frameWrites;
      await write(end);
      await writer.close();
    })
    .catch(async (error) => {
      rendered.cancel?.(error);
      await writer.abort(error).catch(() => {});
    });

  return new Response(readable, {
    headers: responseHeaders,
    status,
  });
};

/**
 * @typedef {import("../server/router.js").Route} Route
 */

/**
 * @typedef {object} CloudflareHandlerOptions
 * @property {Route[]} routes App route definitions.
 * @property {(rendered: { body?: import("../server/html.js").RawHtml, meta: object, nonce?: string }) => string | import("../server/html.js").RawHtml | { before: string | import("../server/html.js").RawHtml, after: string | import("../server/html.js").RawHtml } | Promise<string | import("../server/html.js").RawHtml | { before: string | import("../server/html.js").RawHtml, after: string | import("../server/html.js").RawHtml }>} shell
 * Function that wraps a rendered route body in a full HTML document.
 * @property {{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response } | import("../server/api.js").ApiRoute[]} [api]
 * Optional Web Standards API router or array of `apiRoute()` definitions. Hono
 * apps work here because they expose a compatible `fetch` method.
 * @property {(scope: import("../server/context.js").RequestContext) => Record<string, unknown> | Response | Promise<Record<string, unknown> | Response>} [prepare]
 * Prepare application locals once per request, or return/throw a Response.
 * @property {string} [apiPrefix="/api"] URL prefix handled by `api`.
 * @property {Route} [notFound] Optional 404 route.
 * @property {Route} [error] Optional 500 route.
 * @property {({ error, request, phase }: { error: unknown, request: Request, phase: "route" | "error-route" | "api" | "assets" }) => void} [onError]
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
 * requests render the app shell. Requests with `x-fragment: true` return the
 * route body plus fragment metadata, using framed HTML streaming when the route
 * has deferred content. Requests under `apiPrefix` are delegated to the
 * optional API router before app route matching.
 *
 * @param {CloudflareHandlerOptions} options Worker adapter options.
 * @returns {{ fetch(request: Request, env?: Record<string, unknown>, context?: unknown): Promise<Response> }}
 * Cloudflare Worker module.
 */
export const createCloudflareHandler = ({
  routes,
  shell,
  api,
  prepare,
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
    scope,
    statusOverride,
  }) => {
    const wantsFragment = requestWantsFragment(request);
    const slot = wantsFragment ? requestedFragmentSlot(request) : null;
    const rendered = await renderRoute({
      deferredTimeout,
      match,
      request,
      slot,
      scope,
    });

    if ("response" in rendered) return fragmentResponse(rendered.response, request);

    const responseHeaders = mergeHeaders(headers, rendered.headers);
    const supportsFragmentStreaming =
      wantsFragment && requestSupportsFragmentStreaming(request);
    if (supportsFragmentStreaming) {
      responseHeaders.set(fragmentProtocolHeader, fragmentProtocolVersion);
    }
    const streamsFragment =
      supportsFragmentStreaming && rendered.deferred?.length;
    const streamsDocument = !wantsFragment && rendered.deferred?.length;
    const status = statusOverride ?? rendered.status;

    if (wantsFragment && rendered.deferred?.length && !streamsFragment) {
      const completed = await inlineDeferredFragments(rendered);
      return new Response(String(renderFragment(completed)), {
        headers: responseHeaders,
        status,
      });
    }

    return streamsFragment
      ? streamFragment({
          headers: responseHeaders,
          rendered,
          status,
        })
      : streamsDocument
      ? streamDocument({
          headers: responseHeaders,
          nonce,
          shell,
          rendered,
          status,
        })
      : new Response(
          String(
            wantsFragment
              ? renderFragment(rendered)
              : await renderShellDocument(shell, rendered, nonce),
          ),
          { headers: responseHeaders, status },
        );
  };

  const renderErrorResponse = async ({ headers, nonce, request, scope }) => {
    try {
      return await renderHtml({
        headers,
        match: error,
        nonce,
        request,
        statusOverride: 500,
        scope,
      });
    } catch (fallbackError) {
      reportError(onError, { error: fallbackError, request, phase: "error-route" });
      return new Response("Internal error", {
        status: 500,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }
  };

  return {
    async fetch(request, env = {}, context) {
      const scope = createRequestContext({ request, env, context });
      let nonce;
      let headers = { "Content-Type": "text/html; charset=utf-8" };
      let phase = "route";
      try {
        const { url } = scope;
        const assets = env?.[assetsBinding];
        if (assetLike(url) && assets) {
          phase = "assets";
          const asset = await assets.fetch(request);
          if (asset.status !== 404) return asset;
          phase = "route";
        }
        if (prepare) {
          const locals = await prepare(scope);
          if (locals instanceof Response) return fragmentResponse(locals, request);
          scope.locals = locals ?? {};
        }
        if (apiRouter && (url.pathname === apiPrefix || url.pathname.startsWith(`${apiPrefix}/`))) {
          phase = "api";
          return await apiRouter.fetch(request, env, context, scope);
        }
        nonce = createNonce();
        headers = htmlHeaders({ contentSecurityPolicy, nonce, request });
        const routeMatch = manifest.match(url.pathname);
        const match = routeMatch ?? notFound;
        const method = request.method.toUpperCase();
        if (routeMatch) {
          if (method === "POST") {
            if (!match.action) return methodNotAllowed(match);
            return fragmentResponse(await runRouteAction({ match, request, scope }), request);
          }
          if (method !== "GET" && method !== "HEAD") return methodNotAllowed(match);
        }
        return await renderHtml({
          headers, match, nonce, request, scope,
          statusOverride: routeMatch ? undefined : 404,
        });
      } catch (error) {
        if (error instanceof Response) return fragmentResponse(error, request);
        reportError(onError, { error, request, phase });
        if (phase === "api") return Response.json({ error: "Internal error" }, { status: 500 });
        return renderErrorResponse({ headers, nonce, request, scope });
      }
    },
  };
};
