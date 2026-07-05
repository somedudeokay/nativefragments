export function apiRoute(method: string, path: string, handler: ApiHandler): ApiRoute;
export function createApi(routes: ApiRoute[], { onError }?: {
    onError?: (event: {
        error: unknown;
        request: Request;
        route?: ApiRoute;
    }) => void;
}): {
    fetch(request: Request, env?: Record<string, unknown>, context?: unknown): Promise<Response>;
};
export type ApiContext = {
    /**
     * Original request.
     */
    request: Request;
    /**
     * Runtime environment bindings.
     */
    env: Record<string, unknown>;
    /**
     * Runtime execution context.
     */
    context: unknown;
    /**
     * Parsed request URL.
     */
    url: URL;
    /**
     * Parsed query parameters from `url.searchParams`.
     */
    query: URLSearchParams;
    /**
     * Path parameters captured from the API route.
     */
    params: Record<string, string>;
    /**
     * Request cancellation signal.
     */
    signal: AbortSignal;
};
export type ApiHandler = (context: ApiContext) => unknown | Response | Promise<unknown | Response>;
export type ApiRoute = {
    /**
     * Upper-case HTTP method.
     */
    method: string;
    /**
     * Normalized API route path.
     */
    path: string;
    /**
     * API route handler.
     */
    handler: ApiHandler;
};
