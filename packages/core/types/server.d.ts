/** Trusted HTML wrapper returned by {@link raw}. */
export type RawHtml = {
  /** Trusted HTML text that bypasses escaping when interpolated into {@link html}. */
  value: string;
};

/** Value accepted inside the {@link html} template tag. */
export type HtmlValue =
  | RawHtml
  | string
  | number
  | boolean
  | null
  | undefined
  | HtmlValue[];

/** Attribute map accepted by {@link attrs}. */
export type HtmlAttrs = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Options for rendering a server-side declarative Shadow DOM template. */
export type DeclarativeShadowOptions = {
  /** CSS text rendered into `<style>` tags inside the shadow root template. */
  styles?: string[];
  /** Trusted shadow-root HTML. Build dynamic content with {@link html}. */
  html?: string;
};

/** Request context passed to route and fragment renderers. */
export type RouteContext = {
  /** Path parameters captured from route patterns such as `/posts/:slug`. */
  params: Record<string, string>;
  /** Original Fetch API request. */
  request: Request;
  /** Parsed request URL. */
  url: URL;
};

/** Alternate language URL used for `rel="alternate"` metadata. */
export type AlternateLink = {
  /** `hreflang` value, for example `en`, `nb`, or `x-default`. */
  hreflang: string;
  /** Absolute or root-relative URL for the alternate page. */
  href: string;
};

/** Document metadata returned by route definitions. */
export type RouteMeta = {
  /** Document title. */
  title?: string;
  /** Meta description content. */
  description?: string;
  /** Canonical URL or canonical path. */
  canonical?: string;
  /** Alternate language links rendered into the document head. */
  alternates?: AlternateLink[];
};

/** Function that renders route or nested-fragment HTML. */
export type FragmentRenderer = (
  context: RouteContext,
) => string | Promise<string>;

/** Named nested fragment with helpers for link and target attributes. */
export type FragmentDefinition = {
  /** Fragment slot name. */
  name: string;
  /** Fragment body renderer. */
  render: FragmentRenderer;
  /** Build `data-fragment-slot` attributes for a target container or link. */
  attrs(attributes?: HtmlAttrs): RawHtml;
  /** Build `data-fragment-slot` and `data-fragment-prefetch` attributes. */
  prefetchAttrs(
    mode?: "intent" | "visible" | "load" | "none",
    attributes?: HtmlAttrs,
  ): RawHtml;
};

/** Route definition before it is normalized by {@link route}. */
export type RouteDefinition = {
  /** Route metadata factory. */
  meta?: (context: RouteContext) => RouteMeta | Promise<RouteMeta>;
  /** Route body renderer. */
  render: FragmentRenderer;
  /** Named nested fragments for partial rerenders inside this route. */
  fragments?: Record<string, FragmentRenderer> | FragmentDefinition[];
};

/** Normalized route stored in a route manifest. */
export type Route = RouteDefinition & {
  /** Path parameters captured when this route matched a request path. */
  params?: Record<string, string>;
  /** Normalized route path. */
  path: string;
};

/**
 * Mark a value as trusted HTML so it is inserted without escaping by {@link html}.
 *
 * Use this only for framework-generated markup or content that has already
 * been validated.
 */
export function raw(value?: unknown): RawHtml;

/** Escape a value for safe insertion into HTML text or attribute context. */
export function escapeHtml(value: unknown): string;

/**
 * Server-side HTML template tag with escaped interpolation by default.
 *
 * Arrays are flattened, `null`, `undefined`, and `false` become empty strings,
 * and values returned by {@link raw} are inserted as trusted HTML.
 */
export function html(
  strings: TemplateStringsArray,
  ...values: HtmlValue[]
): string;

/**
 * Render a declarative Shadow DOM template for server-rendered components.
 *
 * Put this as the first child of a custom element and hydrate with the browser
 * `shadow()` helper to avoid a flash before component JavaScript loads.
 */
export function declarativeShadow(options?: DeclarativeShadowOptions): RawHtml;

/** Serialize JSON for safe embedding inside an inline script tag. */
export function jsonScript(value: unknown): string;

/**
 * Build escaped HTML attributes from an object.
 *
 * `false`, `null`, and `undefined` values are omitted. `true` values render as
 * boolean attributes.
 */
export function attrs(attributes?: HtmlAttrs): RawHtml;

/**
 * Create a named nested fragment definition.
 *
 * Register the result in `route(..., { fragments: [fragment] })` and reuse its
 * attribute helpers on links and target containers.
 */
export function fragment(
  name: string,
  render: FragmentRenderer,
): FragmentDefinition;

/**
 * Create a normalized route definition.
 *
 * Use `:name` path segments, for example `/posts/:slug`, to capture params.
 */
export function route(path: string, definition: RouteDefinition): Route;

/**
 * Create a route manifest that matches exact routes first and parameterized
 * routes in declaration order.
 */
export function createRoutes(routes: Route[]): {
  /** All registered routes in declaration order. */
  all: Route[];
  /** Match a pathname to a route, or return `null` when no route matches. */
  match(pathname: string): Route | null;
};

/** Render route metadata into a fragment response script tag. */
export function fragmentMeta(meta: RouteMeta): string;

/**
 * Render a matched route.
 *
 * When `slot` names a registered nested fragment, only that fragment renderer
 * is used. Metadata is normalized with title, description, and canonical
 * defaults for client navigation.
 */
export function renderRoute(options: {
  match: Route;
  request: Request;
  slot?: string | null;
}): Promise<{
  body: string;
  meta: Required<Pick<RouteMeta, "title" | "description" | "canonical">> &
    RouteMeta;
}>;

/** Render a fragment response body with embedded route metadata. */
export function renderFragment(rendered: {
  body: string;
  meta: RouteMeta;
}): string;

/** Default 404 route used by adapters when no route matches. */
export const notFoundRoute: Route;
