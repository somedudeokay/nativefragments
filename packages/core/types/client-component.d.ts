/** Options for rendering or hydrating a custom element shadow root. */
export type ShadowOptions = {
  /** Constructable stylesheets adopted by the shadow root. */
  styles?: CSSStyleSheet[];
  /** Shadow root HTML used after the initial hydration pass. */
  html?: string;
  /** Preserve declarative Shadow DOM on first render. Defaults to `true`. */
  hydrate?: boolean;
};

/** Create a constructable stylesheet from CSS text. */
export function sheet(cssText: string): CSSStyleSheet;

/**
 * Attach or reuse an open shadow root, adopt stylesheets, and render HTML.
 *
 * When `hydrate` is true, an existing declarative shadow root is preserved on
 * first upgrade to avoid a flash before component JavaScript loads.
 */
export function shadow(
  element: HTMLElement,
  options?: ShadowOptions,
): ShadowRoot;
