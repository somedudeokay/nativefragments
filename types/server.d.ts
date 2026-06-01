export type RawHtml = {
  value: string;
};

export type HtmlValue =
  | RawHtml
  | string
  | number
  | boolean
  | null
  | undefined
  | HtmlValue[];

export type HtmlAttrs = Record<
  string,
  string | number | boolean | null | undefined
>;

export type DeclarativeShadowOptions = {
  styles?: string[];
  html?: string;
};

export type RouteContext = {
  request: Request;
  url: URL;
};

export type AlternateLink = {
  hreflang: string;
  href: string;
};

export type RouteMeta = {
  title?: string;
  description?: string;
  canonical?: string;
  alternates?: AlternateLink[];
  [key: string]: unknown;
};

export type FragmentRenderer = (
  context: RouteContext,
) => string | Promise<string>;

export type FragmentDefinition = {
  name: string;
  render: FragmentRenderer;
  attrs(attributes?: HtmlAttrs): RawHtml;
  prefetchAttrs(
    mode?: "intent" | "visible" | "load" | "none",
    attributes?: HtmlAttrs,
  ): RawHtml;
};

export type RouteDefinition = {
  meta?: (context: RouteContext) => RouteMeta | Promise<RouteMeta>;
  render: FragmentRenderer;
  fragments?: Record<string, FragmentRenderer> | FragmentDefinition[];
};

export type Route = RouteDefinition & {
  path: string;
};

export function raw(value?: unknown): RawHtml;
export function escapeHtml(value: unknown): string;
export function html(
  strings: TemplateStringsArray,
  ...values: HtmlValue[]
): string;
export function declarativeShadow(options?: DeclarativeShadowOptions): RawHtml;
export function jsonScript(value: unknown): string;
export function attrs(attributes?: HtmlAttrs): RawHtml;

export function fragment(
  name: string,
  render: FragmentRenderer,
): FragmentDefinition;
export function route(path: string, definition: RouteDefinition): Route;
export function createRoutes(routes: Route[]): {
  all: Route[];
  match(pathname: string): Route | null;
};
export function fragmentMeta(meta: RouteMeta): string;
export function renderRoute(options: {
  match: Route;
  request: Request;
  slot?: string | null;
}): Promise<{
  body: string;
  meta: Required<Pick<RouteMeta, "title" | "description" | "canonical">> &
    RouteMeta;
}>;
export function renderFragment(rendered: {
  body: string;
  meta: RouteMeta;
}): string;

export const notFoundRoute: Route;
