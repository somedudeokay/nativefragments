import { attrs, html, jsonScript, raw } from "./html.js";
import { createRouteContext, defaultDeferredTimeout } from "./defer.js";

/**
 * @typedef {object} RouteContext
 * @property {Request} request Original request.
 * @property {AbortSignal} signal Request cancellation signal.
 * @property {URL} url Parsed request URL.
 * @property {URLSearchParams} query Parsed query parameters from `url.searchParams`.
 * @property {Record<string, string>} params Path parameters captured from a
 * route pattern like `/posts/:slug`.
 * @property {(fragment: FragmentDefinition | string, attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} defer
 * Render a stable loading boundary and collect a named fragment for deferred
 * document streaming.
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
 * @typedef {(context: RouteContext) => string | import("./html.js").RawHtml | Response | Promise<string | import("./html.js").RawHtml | Response>} FragmentRenderer
 */

/**
 * @typedef {(context: RouteContext) => string | import("./html.js").RawHtml} FragmentLoadingRenderer
 */

/**
 * @typedef {(error: unknown, context: RouteContext) => string | import("./html.js").RawHtml | Promise<string | import("./html.js").RawHtml>} FragmentErrorRenderer
 */

/**
 * @typedef {object} FragmentDefinition
 * @property {string} name Fragment slot name.
 * @property {FragmentRenderer} render Fragment renderer.
 * @property {FragmentLoadingRenderer} [loading] Loading renderer used by
 * deferred document streaming.
 * @property {FragmentErrorRenderer} [error] Error renderer used when a
 * deferred fragment fails after the document response has started.
 * @property {number} [timeout] Maximum deferred render time in milliseconds.
 * @property {(attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} attrs
 * Attributes for links and target containers using this fragment slot.
 * @property {(mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml} prefetchAttrs
 * Attributes for links using this fragment slot with a prefetch mode.
 */

/**
 * @typedef {object} RouteDefinition
 * @property {(context: RouteContext) => RouteMeta | Response | Promise<RouteMeta | Response>} [meta]
 * Function that returns metadata for the route.
 * @property {number} [status=200] Status used for rendered HTML responses.
 * @property {Record<string, string> | ((context: RouteContext) => Record<string, string> | Promise<Record<string, string>>)} [headers]
 * Headers merged into rendered HTML responses after adapter defaults.
 * @property {(context: RouteContext) => Response | Promise<Response>} [action]
 * POST handler for no-JavaScript mutations. Must return a native Response,
 * usually a 303 redirect.
 * @property {(context: RouteContext) => string | import("./html.js").RawHtml | Response | Promise<string | import("./html.js").RawHtml | Response>} render
 * Function that renders route body HTML.
 * @property {Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[]} [fragments]
 * Named fragment renderers used by nested fragment slots.
 */

/**
 * @typedef {RouteDefinition & { path: string, params?: Record<string, string> }} Route
 */

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
};

const isResponse = (value) => value instanceof Response;

const isFragmentDefinition = (value) =>
  Boolean(value && typeof value === "object" && value.name && value.render);

const normalizeFragmentDefinition = (name, value) =>
  isFragmentDefinition(value)
    ? value
    : {
        name,
        render: value,
      };

const normalizeFragmentDefinitions = (fragments) => {
  if (!fragments) return {};
  if (Array.isArray(fragments)) {
    return Object.fromEntries(fragments.map((item) => [item.name, item]));
  }
  return Object.fromEntries(
    Object.entries(fragments).map(([name, render]) => [
      name,
      normalizeFragmentDefinition(name, render),
    ]),
  );
};

const decodeSegment = (segment) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const pathSegments = (path) =>
  normalizePath(path).split("/").filter(Boolean).map(decodeSegment);

const paramInfo = (segment) => {
  if (!segment.startsWith(":")) return null;
  const rawName = segment.slice(1);
  const rest = rawName.endsWith("*");
  const name = rest ? rawName.slice(0, -1) : rawName;
  return name ? { name, rest } : null;
};

const validateRoutePattern = (path) => {
  const segments = pathSegments(path);
  for (const [index, segment] of segments.entries()) {
    const info = paramInfo(segment);
    if (info?.rest && index !== segments.length - 1) {
      throw new TypeError(
        `Catch-all route segment "${segment}" must be the final segment in "${path}".`,
      );
    }
  }
};

const compileRoutePattern = (item) => {
  const segments = pathSegments(item.path);
  const hasParams = segments.some((segment) => paramInfo(segment));
  if (!hasParams) return null;

  return { item, segments };
};

const matchRoutePattern = (compiled, pathname) => {
  const requestSegments = pathSegments(pathname);
  const restIndex = compiled.segments.findIndex((segment) => paramInfo(segment)?.rest);
  if (restIndex === -1 && compiled.segments.length !== requestSegments.length) {
    return null;
  }
  if (restIndex !== -1 && requestSegments.length < restIndex) return null;

  const params = {};

  for (const [index, segment] of compiled.segments.entries()) {
    const info = paramInfo(segment);
    if (info?.rest) {
      params[info.name] = requestSegments.slice(index).join("/");
      break;
    }
    if (info) {
      params[info.name] = requestSegments[index] ?? "";
      continue;
    }
    if (segment !== requestSegments[index]) return null;
  }

  return { ...compiled.item, params };
};

/**
 * Create a named fragment definition.
 *
 * Use this when a route has a nested region with its own navigation. The
 * returned object can be registered in `route(..., { fragments: [item] })` and
 * its attributes can be reused on links and target containers.
 *
 * @param {string} name Fragment slot name.
 * @param {FragmentRenderer | Omit<FragmentDefinition, "name" | "attrs" | "prefetchAttrs">} definition
 * Fragment renderer or full fragment definition.
 * @returns {FragmentDefinition} Fragment definition.
 */
export const fragment = (name, definition) => {
  const normalized =
    typeof definition === "function" ? { render: definition } : definition;

  return {
    name,
    ...normalized,
    attrs: (attributes = {}) => attrs({ ...attributes, "data-fragment-slot": name }),
    prefetchAttrs: (mode = "intent", attributes = {}) =>
      attrs({
        ...attributes,
        "data-fragment-slot": name,
        "data-fragment-prefetch": mode,
      }),
  };
};

/**
 * Create a normalized route definition.
 *
 * @param {string} path URL path for the route. Use `:name` segments for path
 * params, for example `/posts/:slug`.
 * @param {RouteDefinition} definition Route metadata and render functions.
 * @returns {Route} Normalized route.
 */
export const route = (path, definition) => {
  validateRoutePattern(path);
  const { fragments, ...routeDefinition } = definition;

  return {
    ...routeDefinition,
    fragments: normalizeFragmentDefinitions(fragments),
    path: normalizePath(path),
  };
};

/**
 * Create a redirect response.
 *
 * @param {string | URL} location Redirect destination.
 * @param {number} [status=302] Redirect status.
 * @returns {Response} Native redirect response.
 */
export const redirect = (location, status = 302) =>
  new Response(null, {
    status,
    headers: {
      Location: String(location),
    },
  });

/**
 * Read string query parameters with defaults.
 *
 * Each returned key is `searchParams.get(key)` when it is a non-empty string,
 * otherwise the default value.
 *
 * @template {Record<string, string>} T
 * @param {URLSearchParams} searchParams Query parameters.
 * @param {T} defaults Default values.
 * @returns {T} Query values merged with defaults.
 */
export const readSearch = (searchParams, defaults) =>
  Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => {
      const value = searchParams.get(key);
      return [key, value === "" || value == null ? fallback : value];
    }),
  );

/**
 * Create a route manifest that can match normalized paths. Exact static routes
 * win first, then parameterized routes are matched in declaration order.
 *
 * @param {Route[]} routes Route definitions.
 * @returns {{ all: Route[], match(pathname: string): Route | null }} Route manifest.
 */
export const createRoutes = (routes) => {
  const byPath = new Map();
  const uniqueRoutes = [];

  for (const item of routes) {
    const path = normalizePath(item.path);
    validateRoutePattern(path);
    if (byPath.has(path)) {
      console.warn(
        `Native Fragments: duplicate route path "${path}" ignored; keeping first "${byPath.get(path).path}".`,
      );
      continue;
    }
    byPath.set(path, item);
    uniqueRoutes.push(item);
  }

  const patterns = uniqueRoutes.map(compileRoutePattern).filter(Boolean);

  return {
    all: uniqueRoutes,
    match(pathname) {
      const exact = byPath.get(normalizePath(pathname));
      if (exact) return exact;

      for (const pattern of patterns) {
        const match = matchRoutePattern(pattern, pathname);
        if (match) return match;
      }

      return null;
    },
  };
};

/**
 * Render fragment metadata for the browser fragment router.
 *
 * @param {RouteMeta} meta Metadata to embed in the fragment response.
 * @returns {import("./html.js").RawHtml} Script tag containing serialized metadata.
 */
export const fragmentMeta = (meta) =>
  html`<script type="application/json" data-fragment-meta>${raw(
    jsonScript(meta),
  )}</script>`;

/**
 * Render a matched route and normalize metadata defaults.
 *
 * @param {{ match: Route, request: Request, slot?: string | null, deferredTimeout?: number | null }} options
 * Render options. When `slot` matches a registered named fragment, only that
 * fragment renderer is used. Calls to `context.defer()` always collect
 * deferred work for the adapter to stream or inline.
 * @returns {Promise<{ body: string, meta: Required<Pick<RouteMeta, "title" | "description" | "canonical">> & RouteMeta, deferred: unknown[], status: number, headers: Record<string, string> } | { response: Response }>} Rendered route.
 */
export const renderRoute = async ({
  match,
  request,
  slot = null,
  deferredTimeout: fallbackDeferredTimeout = defaultDeferredTimeout,
}) => {
  const deferred = [];
  const context = createRouteContext({
    deferred,
    fallbackDeferredTimeout,
    match,
    request,
  });
  let meta;
  try {
    meta = await match.meta?.(context);
    if (isResponse(meta)) return { response: meta };
  } catch (error) {
    if (isResponse(error)) return { response: error };
    throw error;
  }
  const fragmentDefinition = slot ? match.fragments?.[slot] : null;
  const render = fragmentDefinition ? fragmentDefinition.render : match.render;
  let body;
  try {
    body = await render(context);
    if (isResponse(body)) return { response: body };
  } catch (error) {
    if (isResponse(error)) return { response: error };
    throw error;
  }

  const routeHeaders =
    typeof match.headers === "function"
      ? await match.headers(context)
      : match.headers;

  return {
    body: String(body),
    deferred,
    headers: routeHeaders ?? {},
    meta: {
      title: "",
      description: "",
      canonical: context.url.pathname,
      ...(meta ?? {}),
    },
    status: match.status ?? 200,
  };
};

/**
 * Run a route action for POST-redirect-GET mutations.
 *
 * @private
 * @param {{ match: Route, request: Request }} options Action options.
 * @returns {Promise<Response>} Action response.
 */
export const runRouteAction = async ({ match, request }) => {
  if (!match.action) {
    throw new Error(`Route "${match.path}" does not define an action.`);
  }

  const context = createRouteContext({
    deferred: [],
    fallbackDeferredTimeout: null,
    match,
    request,
  });
  let response;
  try {
    response = await match.action(context);
  } catch (error) {
    if (isResponse(error)) return error;
    throw error;
  }
  if (!isResponse(response)) {
    throw new TypeError(`Route action for "${match.path}" must return a Response.`);
  }
  return response;
};

/**
 * Render a fragment response body with embedded metadata.
 *
 * @param {{ body: string, meta: RouteMeta }} rendered Rendered route body and metadata.
 * @returns {import("./html.js").RawHtml} Fragment HTML.
 */
export const renderFragment = ({ body, meta }) =>
  html`${raw(body)}${fragmentMeta(meta)}`;

/**
 * Default 404 route used by adapters when a route is not matched.
 *
 * @type {Route}
 */
export const notFoundRoute = route("404", {
  status: 404,
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

/**
 * Default 500 route used by adapters when a route render fails.
 *
 * @type {Route}
 */
export const errorRoute = route("500", {
  status: 500,
  meta: ({ url }) => ({
    title: "Something went wrong",
    description: "The page could not be rendered.",
    canonical: url.pathname,
  }),
  render: () => html`<main class="error">
    <p class="eyebrow">500</p>
    <h1>Something went wrong</h1>
    <p>The page could not be rendered. Please try again.</p>
  </main>`,
});
