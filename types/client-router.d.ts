/** Fragment prefetch strategy used by the client router. */
export type FragmentPrefetchMode =
  | boolean
  | "none"
  | "intent"
  | "visible"
  | "load";

/** Event passed to `afterNavigate` after a successful fragment navigation. */
export type FragmentNavigationEvent = {
  /** Metadata embedded in the fragment response, or `null` if none was present. */
  meta: Record<string, unknown> | null;
  /** Destination URL that was rendered. */
  url: URL;
  /** Fragment slot that was replaced. */
  slot: string;
};

/** Options for installing same-origin fragment navigation. */
export type FragmentNavigationOptions = {
  /** Selector or named fragment slot replaced by normal navigation. */
  slot?: string;
  /** Fragment cache time in milliseconds. */
  ttl?: number;
  /** Default prefetch behavior. Links can override with `data-fragment-prefetch`. */
  prefetch?: FragmentPrefetchMode;
  /** Callback fired after a successful client-side navigation. */
  afterNavigate?: (event: FragmentNavigationEvent) => void;
};

/**
 * Prefetch a same-origin fragment into the shared fragment cache.
 *
 * Cross-origin URLs are skipped and resolve to `null`.
 */
export function prefetchFragment(
  href: string | URL,
  options?: {
    /** Selector or named fragment slot to request. */
    slot?: string;
    /** Cache time in milliseconds. */
    ttl?: number;
    /** Abort signal for the underlying fetch. */
    signal?: AbortSignal;
  },
): Promise<string | null>;

/**
 * Install same-origin link interception for fragment navigation.
 *
 * The returned navigate function can be used for imperative navigation. Links
 * with `data-fragment-slot="name"` replace only the matching named fragment
 * container and send `x-fragment-slot: name`.
 */
export function installFragmentNavigation(
  options?: FragmentNavigationOptions,
):
  | ((
      href: string,
      pushState?: boolean,
      nextSlot?: string,
    ) => Promise<void>)
  | undefined;
