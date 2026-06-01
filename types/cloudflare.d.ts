import type { Route } from "./server.d.ts";

/** Fetch-compatible API router, such as a Hono app. */
export type FetchRouter = {
  /** Handle a Fetch API request. */
  fetch(
    request: Request,
    env: Record<string, unknown>,
    context?: unknown,
  ): Response | Promise<Response>;
};

/** Options for adapting a Native Fragments route manifest to Cloudflare Workers. */
export type CloudflareHandlerOptions = {
  /** App route definitions rendered by the Worker. */
  routes: Route[];
  /** Wrap a rendered route body and metadata in a full HTML document. */
  shell(rendered: { body: string; meta: object }): string;
  /** Optional API router handled before app route matching. */
  api?: FetchRouter;
  /** URL prefix delegated to `api`. Defaults to `/api`. */
  apiPrefix?: string;
  /** Optional route used when no app route matches. */
  notFound?: Route;
  /** Cloudflare assets binding name. Defaults to `ASSETS`. */
  assetsBinding?: string;
  /** Whether to inject a declarative fragment manifest with `HTMLRewriter`. */
  fragmentManifest?: boolean;
};

/**
 * Create a Cloudflare Worker module for a Native Fragments app.
 *
 * Static assets are served from the configured assets binding. Full document
 * requests render the shell, while requests with `x-fragment: true` return only
 * fragment HTML plus metadata for client-side navigation.
 */
export function createCloudflareHandler(
  options: CloudflareHandlerOptions,
): {
  /** Cloudflare Worker fetch handler. */
  fetch(
    request: Request,
    env: Record<string, unknown>,
    context?: unknown,
  ): Promise<Response>;
};
