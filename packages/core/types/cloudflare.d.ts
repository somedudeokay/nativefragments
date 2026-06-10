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

/** Explicit shell halves used for streamed document assembly. */
export type StreamingShell = {
  /** Document HTML before the rendered route body. */
  before: string;
  /** Document HTML after the rendered route body. */
  after: string;
};

/** Context passed to a dynamic Content Security Policy builder. */
export type ContentSecurityPolicyContext = {
  /** Per-request nonce also passed to the shell and framework bootstrap. */
  nonce: string;
  /** Original request. */
  request: Request;
};

/** Options for adapting a Native Fragments route manifest to Cloudflare Workers. */
export type CloudflareHandlerOptions = {
  /** App route definitions rendered by the Worker. */
  routes: Route[];
  /**
   * Wrap a rendered route body and metadata in a full HTML document.
   *
   * For streamed document responses, shells may return `{ before, after }`
   * when called without `body`; existing string shells remain supported.
   */
  shell(rendered: {
    body?: string;
    meta: object;
    nonce?: string;
  }): string | StreamingShell;
  /** Optional API router handled before app route matching. */
  api?: FetchRouter;
  /** URL prefix delegated to `api`. Defaults to `/api`. */
  apiPrefix?: string;
  /** Optional route used when no app route matches. */
  notFound?: Route;
  /** Cloudflare assets binding name. Defaults to `ASSETS`. */
  assetsBinding?: string;
  /**
   * Default timeout in milliseconds for each deferred fragment renderer.
   * Set to `null` to disable the default timeout.
   */
  deferredTimeout?: number | null;
  /**
   * Content Security Policy header. Defaults to `frame-ancestors 'self'`.
   * Pass a function to include the per-request nonce in a strict policy.
   */
  contentSecurityPolicy?:
    | string
    | false
    | ((context: ContentSecurityPolicyContext) => string | false);
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
