import { html, jsonScript, raw } from "./html.js";

/**
 * @typedef {object} RouteContext
 * @property {Request} request Original request.
 * @property {URL} url Parsed request URL.
 */

/**
 * @typedef {object} RouteMeta
 * @property {string} [title] Document title.
 * @property {string} [description] Meta description.
 * @property {string} [canonical] Canonical URL.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta]
 * Function that returns metadata for the route.
 * @property {(context: RouteContext) => string | Promise<string>} render
 * Function that renders route body HTML.
 */

/**
 * @typedef {RouteDefinition & { path: string }} Route
 */

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
};

/**
 * Create a normalized route definition.
 *
 * @param {string} path URL path for the route.
 * @param {RouteDefinition} definition Route metadata and render functions.
 * @returns {Route} Normalized route.
 */
export const route = (path, definition) => ({
  ...definition,
  path: normalizePath(path),
});

/**
 * Create a route manifest that can match normalized paths.
 *
 * @param {Route[]} routes Route definitions.
 * @returns {{ all: Route[], match(pathname: string): Route | null }} Route manifest.
 */
export const createRoutes = (routes) => {
  const byPath = new Map(routes.map((item) => [normalizePath(item.path), item]));

  return {
    all: routes,
    match(pathname) {
      return byPath.get(normalizePath(pathname)) ?? null;
    },
  };
};

/**
 * Render fragment metadata for the browser fragment router.
 *
 * @param {RouteMeta} meta Metadata to embed in the fragment response.
 * @returns {string} Script tag containing serialized metadata.
 */
export const fragmentMeta = (meta) =>
  html`<script type="application/json" data-fragment-meta>${raw(
    jsonScript(meta),
  )}</script>`;

/**
 * Render a matched route and normalize metadata defaults.
 *
 * @param {{ match: Route, request: Request }} options Render options.
 * @returns {Promise<{ body: string, meta: Required<RouteMeta> }>} Rendered route.
 */
export const renderRoute = async ({ match, request }) => {
  const context = { request, url: new URL(request.url) };
  const meta = await match.meta?.(context);
  const body = await match.render(context);

  return {
    body,
    meta: {
      title: "",
      description: "",
      canonical: context.url.pathname,
      ...(meta ?? {}),
    },
  };
};

/**
 * Render a fragment response body with embedded metadata.
 *
 * @param {{ body: string, meta: RouteMeta }} rendered Rendered route body and metadata.
 * @returns {string} Fragment HTML.
 */
export const renderFragment = ({ body, meta }) =>
  html`${raw(body)}${raw(fragmentMeta(meta))}`;

/**
 * Default 404 route used by adapters when a route is not matched.
 *
 * @type {Route}
 */
export const notFoundRoute = route("404", {
  meta: ({ url }) => ({
    title: "404",
    description: "Page not found.",
    canonical: url.pathname,
  }),
  render: () => html`<main class="not-found">
    <p class="eyebrow">404</p>
    <h1>Nothing rendered here.</h1>
    <p>This route is not in the manifest.</p>
  </main>`,
});
