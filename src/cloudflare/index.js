import {
  createRoutes,
  notFoundRoute,
  renderFragment,
  renderRoute,
} from "../server/index.js";

const assetLike = (url) =>
  /\.[a-zA-Z0-9]+$/.test(url.pathname) ||
  url.pathname.startsWith("/app/") ||
  url.pathname.startsWith("/assets/") ||
  url.pathname.startsWith("/nativefragments/");

const requestWantsFragment = (request) =>
  request.headers.get("x-fragment") === "true";

const requestedFragmentSlot = (request) =>
  request.headers.get("x-fragment-slot");

const securityHeaders = {
  "Content-Security-Policy": "frame-ancestors 'self'",
  "X-Content-Type-Options": "nosniff",
};

/**
 * @typedef {import("../server/router.js").Route} Route
 */

/**
 * @typedef {object} CloudflareHandlerOptions
 * @property {Route[]} routes App route definitions.
 * @property {(rendered: { body: string, meta: object }) => string} shell
 * Function that wraps a rendered route body in a full HTML document.
 * @property {{ fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response }} [api]
 * Optional Web Standards API router. Hono apps work here because they expose a
 * compatible `fetch` method.
 * @property {string} [apiPrefix="/api"] URL prefix handled by `api`.
 * @property {Route} [notFound] Optional 404 route.
 * @property {string} [assetsBinding="ASSETS"] Cloudflare assets binding name.
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
}) => {
  const manifest = createRoutes(routes);

  return {
    async fetch(request, env, context) {
      const url = new URL(request.url);
      const assets = env?.[assetsBinding];

      if (api && (url.pathname === apiPrefix || url.pathname.startsWith(`${apiPrefix}/`))) {
        return api.fetch(request, env, context);
      }

      if (assetLike(url) && assets) {
        const asset = await assets.fetch(request);
        if (asset.status !== 404) return asset;
      }

      const match = manifest.match(url.pathname) ?? notFound;
      const status = match === notFound ? 404 : 200;
      const slot = requestWantsFragment(request) ? requestedFragmentSlot(request) : null;
      const rendered = await renderRoute({ match, request, slot });
      const body = requestWantsFragment(request)
        ? renderFragment(rendered)
        : shell(rendered);

      return new Response(body, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...securityHeaders,
        },
        status,
      });
    },
  };
};
