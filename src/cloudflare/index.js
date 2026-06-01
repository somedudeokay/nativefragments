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
  url.pathname.startsWith("/native-fragments/");

const requestWantsFragment = (request) =>
  request.headers.get("x-fragment") === "true";

const securityHeaders = {
  "Content-Security-Policy": "frame-ancestors 'self'",
  "X-Content-Type-Options": "nosniff",
};

export const createCloudflareHandler = ({
  routes,
  shell,
  notFound = notFoundRoute,
  assetsBinding = "ASSETS",
}) => {
  const manifest = createRoutes(routes);

  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const assets = env?.[assetsBinding];

      if (assetLike(url) && assets) {
        const asset = await assets.fetch(request);
        if (asset.status !== 404) return asset;
      }

      const match = manifest.match(url.pathname) ?? notFound;
      const status = match === notFound ? 404 : 200;
      const rendered = await renderRoute({ match, request });
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
