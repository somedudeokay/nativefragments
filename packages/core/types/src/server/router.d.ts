export function fragment(name: string, definition: FragmentRenderer | Omit<FragmentDefinition, "name" | "attrs" | "prefetchAttrs">): FragmentDefinition;
export function route(path: string, definition: RouteDefinition): Route;
export function redirect(location: string | URL, status?: number): Response;
export function readSearch<T extends Record<string, string>>(searchParams: URLSearchParams, defaults: T): T;
export function createRoutes(routes: Route[]): {
    all: Route[];
    match(pathname: string): Route | null;
};
export function fragmentMeta(meta: RouteMeta): import("./html.js").RawHtml;
export function renderRoute({ match, request, slot, scope, deferredTimeout: fallbackDeferredTimeout, }: {
    match: Route;
    request: Request;
    slot?: string | null;
    deferredTimeout?: number | null;
    scope?: import("./context.js").RequestContext;
}): Promise<{
    body: string;
    meta: Required<Pick<RouteMeta, "title" | "description" | "canonical">> & RouteMeta;
    deferred: unknown[];
    status: number;
    headers: Record<string, string>;
    cancel: (reason?: unknown) => void;
} | {
    response: Response;
}>;
export function runRouteAction({ match, request, scope }: {
    match: Route;
    request: Request;
    scope?: import("./context.js").RequestContext;
}): Promise<Response>;
export function renderFragment({ body, meta }: {
    body: string;
    meta: RouteMeta;
}): import("./html.js").RawHtml;
/**
 * Default 404 route used by adapters when a route is not matched.
 *
 * @type {Route}
 */
export const notFoundRoute: Route;
/**
 * Default 500 route used by adapters when a route render fails.
 *
 * @type {Route}
 */
export const errorRoute: Route;
export type RouteContext = {
    /**
     * Original request.
     */
    request: Request;
    /**
     * Request cancellation signal.
     */
    signal: AbortSignal;
    /**
     * Runtime bindings for this request.
     */
    env: Record<string, unknown>;
    /**
     * Runtime execution context.
     */
    context: unknown;
    /**
     * Application state prepared once per request.
     */
    locals: Record<string, unknown>;
    /**
     * Parsed request URL.
     */
    url: URL;
    /**
     * Parsed query parameters from `url.searchParams`.
     */
    query: URLSearchParams;
    /**
     * Path parameters captured from a
     * route pattern like `/posts/:slug`.
     */
    params: Record<string, string>;
    /**
     * Render a stable loading boundary and collect a named fragment for deferred
     * HTML streaming during document loads and browser fragment navigation.
     */
    defer: (fragment: FragmentDefinition | string, attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml;
};
export type RouteMeta = {
    /**
     * Document title.
     */
    title?: string;
    /**
     * Meta description.
     */
    description?: string;
    /**
     * Canonical URL.
     */
    canonical?: string;
    /**
     * Alternate
     * language URLs for `<link rel="alternate" hreflang="...">`.
     */
    alternates?: {
        hreflang: string;
        href: string;
    }[];
};
export type FragmentRenderer = (context: RouteContext) => string | import("./html.js").RawHtml | Response | Promise<string | import("./html.js").RawHtml | Response>;
export type FragmentLoadingRenderer = (context: RouteContext) => string | import("./html.js").RawHtml;
export type FragmentErrorRenderer = (error: unknown, context: RouteContext) => string | import("./html.js").RawHtml | Promise<string | import("./html.js").RawHtml>;
export type FragmentDefinition = {
    /**
     * Fragment slot name.
     */
    name: string;
    /**
     * Fragment renderer.
     */
    render: FragmentRenderer;
    /**
     * Loading renderer used by
     * deferred HTML streaming.
     */
    loading?: FragmentLoadingRenderer;
    /**
     * Error renderer used when a
     * deferred fragment fails after its HTML response has started.
     */
    error?: FragmentErrorRenderer;
    /**
     * Maximum deferred render time in milliseconds.
     */
    timeout?: number;
    /**
     * Attributes for links and target containers using this fragment slot.
     */
    attrs: (attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml;
    /**
     * Attributes for links using this fragment slot with a prefetch mode.
     */
    prefetchAttrs: (mode?: "intent" | "visible" | "load" | "none", attributes?: import("./html.js").HtmlAttrs) => import("./html.js").RawHtml;
};
export type RouteDefinition = {
    /**
     * Function that returns metadata for the route.
     */
    meta?: (context: RouteContext) => RouteMeta | Response | Promise<RouteMeta | Response>;
    /**
     * Status used for rendered HTML responses.
     */
    status?: number;
    /**
     * Headers merged into rendered HTML responses after adapter defaults.
     */
    headers?: Record<string, string> | ((context: RouteContext) => Record<string, string> | Promise<Record<string, string>>);
    /**
     * POST handler for no-JavaScript mutations. Must return a native Response,
     * usually a 303 redirect.
     */
    action?: (context: RouteContext) => Response | Promise<Response>;
    /**
     * Function that renders route body HTML.
     */
    render: (context: RouteContext) => string | import("./html.js").RawHtml | Response | Promise<string | import("./html.js").RawHtml | Response>;
    /**
     * Named fragment renderers used by nested fragment slots.
     */
    fragments?: Record<string, FragmentRenderer | FragmentDefinition> | FragmentDefinition[];
};
export type Route = RouteDefinition & {
    path: string;
    params?: Record<string, string>;
};
