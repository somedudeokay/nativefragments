export function startRouter({ target, cacheTtl, cacheMaxEntries, cacheMaxBytes, prefetch, viewTransitions, signal: lifetimeSignal, }?: FragmentRouterOptions): Readonly<FragmentRouter>;
export type PrefetchMode = "none" | "intent" | "visible" | "load";
export type FragmentRouterOptions = {
    /**
     * Primary navigation target.
     */
    target?: string | Element;
    /**
     * Maximum completed fragment cache lifetime.
     */
    cacheTtl?: number;
    /**
     * Maximum cached response groups (including redirect aliases).
     */
    cacheMaxEntries?: number;
    /**
     * Maximum retained HTML bytes.
     */
    cacheMaxBytes?: number;
    /**
     * Default automatic prefetch policy.
     */
    prefetch?: PrefetchMode | boolean;
    /**
     * Use View Transitions when available.
     */
    viewTransitions?: boolean;
    /**
     * Aborting this signal tears down the router.
     */
    signal?: AbortSignal;
};
export type NavigateOptions = {
    /**
     * Named fragment target; omit for the primary target.
     */
    slot?: string;
    /**
     * History behavior.
     */
    history?: "push" | "replace" | "none";
    /**
     * Abort this navigation consumer.
     */
    signal?: AbortSignal;
};
export type FragmentRequestOptions = {
    /**
     * Named fragment target.
     */
    slot?: string;
    /**
     * Abort this request consumer.
     */
    signal?: AbortSignal;
};
export type InvalidateOptions = {
    /**
     * Limit invalidation to one named fragment target.
     */
    slot?: string;
};
export type FragmentRouter = {
    /**
     * Navigate to a route or named fragment.
     */
    navigate: (href: string | URL, options?: NavigateOptions) => Promise<void>;
    /**
     * Warm a completed fragment in the shared cache.
     */
    prefetch: (href: string | URL, options?: FragmentRequestOptions) => Promise<void>;
    /**
     * Drop matching cached and in-flight fragments, or all fragments when omitted.
     */
    invalidate: (href?: string | URL, options?: InvalidateOptions) => void;
};
