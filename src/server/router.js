import { attrs, html, jsonScript, raw } from "./html.js";

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
 * @property {{ hreflang: string, href: string }[]} [alternates] Alternate
 * language URLs for `<link rel="alternate" hreflang="...">`.
 */

/**
 * @typedef {(context: RouteContext) => string | Promise<string>} FragmentRenderer
 */

/**
 * @typedef {object} FragmentDefinition
 * @property {string} name Fragment slot name.
 * @property {FragmentRenderer} render Fragment renderer.
 * @property {(attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} attrs
 * Attributes for links and target containers using this fragment slot.
 * @property {(mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} prefetchAttrs
 * Attributes for links using this fragment slot with a prefetch mode.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {(context: RouteContext) => RouteMeta | Promise<RouteMeta>} [meta]
 * Function that returns metadata for the route.
 * @property {(context: RouteContext) => string | Promise<string>} render
 * Function that renders route body HTML.
 * @property {Record<string, FragmentRenderer> | FragmentDefinition[]} [fragments]
 * Named fragment renderers used by nested fragment slots.
 */

/**
 * @typedef {RouteDefinition & { path: string }} Route
 */

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
};

const normalizeFragments = (fragments) => {
  if (!Array.isArray(fragments)) return fragments;
  return Object.fromEntries(fragments.map((item) => [item.name, item.render]));
};

/**
 * Create a named fragment definition.
 *
 * Use this when a route has a nested region with its own navigation. The
 * returned object can be registered in `route(..., { fragments: [item] })` and
 * its attributes can be reused on links and target containers.
 *
 * @param {string} name Fragment slot name.
 * @param {FragmentRenderer} render Fragment renderer.
 * @returns {FragmentDefinition} Fragment definition.
 */
export const fragment = (name, render) => ({
  name,
  render,
  attrs: (attributes = {}) => attrs({ ...attributes, "data-fragment-slot": name }),
  prefetchAttrs: (mode = "intent", attributes = {}) =>
    attrs({
      ...attributes,
      "data-fragment-slot": name,
      "data-fragment-prefetch": mode,
    }),
});

/**
 * Create a normalized route definition.
 *
 * @param {string} path URL path for the route.
 * @param {RouteDefinition} definition Route metadata and render functions.
 * @returns {Route} Normalized route.
 */
export const route = (path, definition) => ({
  ...definition,
  fragments: normalizeFragments(definition.fragments),
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
 * @param {{ match: Route, request: Request, slot?: string | null }} options
 * Render options. When `slot` matches `RouteDefinition.fragments`, only that
 * named fragment is rendered.
 * @returns {Promise<{ body: string, meta: Required<RouteMeta> }>} Rendered route.
 */
export const renderRoute = async ({ match, request, slot = null }) => {
  const context = { request, url: new URL(request.url) };
  const meta = await match.meta?.(context);
  const render = slot && match.fragments?.[slot] ? match.fragments[slot] : match.render;
  const body = await render(context);

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
