export type FragmentPrefetchMode =
  | boolean
  | "none"
  | "intent"
  | "visible"
  | "load";

export type FragmentNavigationEvent = {
  meta: Record<string, unknown> | null;
  url: URL;
  slot: string;
};

export type FragmentNavigationOptions = {
  slot?: string;
  ttl?: number;
  prefetch?: FragmentPrefetchMode;
  afterNavigate?: (event: FragmentNavigationEvent) => void;
};

export function prefetchFragment(
  href: string | URL,
  options?: {
    slot?: string;
    ttl?: number;
    signal?: AbortSignal;
  },
): Promise<string | null>;

export function installFragmentNavigation(
  options?: FragmentNavigationOptions,
):
  | ((
      href: string,
      pushState?: boolean,
      nextSlot?: string,
    ) => Promise<void>)
  | undefined;
