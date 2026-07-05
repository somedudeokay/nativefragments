export function createCloudflareHandler({ routes, shell, api, apiPrefix, notFound, error, onError, assetsBinding, deferredTimeout, contentSecurityPolicy, }: CloudflareHandlerOptions): {
    fetch(request: Request, env: Record<string, unknown>): Promise<Response>;
};
export type Route = import("../server/router.js").Route;
export type CloudflareHandlerOptions = {
    /**
     * App route definitions.
     */
    routes: Route[];
    /**
     * Function that wraps a rendered route body in a full HTML document.
     */
    shell: (rendered: {
        body?: import("../server/html.js").RawHtml;
        meta: object;
        nonce?: string;
    }) => string | import("../server/html.js").RawHtml | {
        before: string | import("../server/html.js").RawHtml;
        after: string | import("../server/html.js").RawHtml;
    };
    /**
     * Optional Web Standards API router or array of `apiRoute()` definitions. Hono
     * apps work here because they expose a compatible `fetch` method.
     */
    api?: {
        fetch(request: Request, env: Record<string, unknown>, context?: unknown): Promise<Response> | Response;
    } | import("../server/api.js").ApiRoute[];
    /**
     * URL prefix handled by `api`.
     */
    apiPrefix?: string;
    /**
     * Optional 404 route.
     */
    notFound?: Route;
    /**
     * Optional 500 route.
     */
    error?: Route;
    /**
     * Error hook for caught route, error-route, and API failures.
     */
    onError?: ({ error, request, phase }: {
        error: unknown;
        request: Request;
        phase: "route" | "error-route" | "api";
    }) => void;
    /**
     * Cloudflare assets binding name.
     */
    assetsBinding?: string;
    /**
     * Default timeout in
     * milliseconds for each deferred fragment renderer. Set `null` to disable.
     */
    deferredTimeout?: number | null;
    /**
     * Content Security Policy header. Defaults to `frame-ancestors 'self'`. Pass a
     * function to build a nonce-based strict policy.
     */
    contentSecurityPolicy?: string | false | ((options: {
        nonce: string;
        request: Request;
    }) => string | false);
};
