export function clearFragmentCache(href?: string | URL): void;
export function prefetchFragment(href: string | URL, { slot, ttl, signal }?: {
    slot?: string;
    ttl?: number;
    signal?: AbortSignal;
}): Promise<string | null>;
export function installFragmentNavigation({ slot, ttl, prefetch, viewTransitions, afterNavigate, }?: FragmentNavigationOptions): ((href: string | URL, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined;
export type FragmentNavigationOptions = {
    /**
     * Selector for the element replaced
     * by fragment responses.
     */
    slot?: string;
    /**
     * Fragment cache time in milliseconds.
     */
    ttl?: number;
    /**
     * Default fragment prefetch behavior. Links can override this with
     * `data-fragment-prefetch="intent|visible|load|none"`.
     */
    prefetch?: boolean | "none" | "intent" | "visible" | "load";
    /**
     * Whether to use
     * `document.startViewTransition()` for DOM swaps when supported.
     */
    viewTransitions?: boolean;
    /**
     * Callback fired after a successful client-side navigation.
     */
    afterNavigate?: (event: {
        meta: object | null;
        url: URL;
        slot: string;
    }) => void;
};
