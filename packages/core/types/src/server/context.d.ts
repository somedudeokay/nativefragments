export function createRequestContext({ request, env, context, locals }: {
    request: Request;
    env?: Record<string, unknown>;
    context?: unknown;
    locals?: Record<string, unknown>;
}): RequestContext;
export function reportError(onError: any, event: any): void;
export type RequestContext = {
    /**
     * Original request.
     */
    request: Request;
    /**
     * Runtime bindings for this request.
     */
    env: Record<string, unknown>;
    /**
     * Runtime execution context (for example waitUntil).
     */
    context: unknown;
    /**
     * Application state prepared once per request.
     */
    locals: Record<string, unknown>;
    /**
     * Request cancellation signal.
     */
    signal: AbortSignal;
    /**
     * Parsed request URL.
     */
    url: URL;
    /**
     * Parsed query parameters.
     */
    query: URLSearchParams;
};
