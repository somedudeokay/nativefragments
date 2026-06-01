export type ShadowOptions = {
  styles?: CSSStyleSheet[];
  html?: string;
  hydrate?: boolean;
};

export function sheet(cssText: string): CSSStyleSheet;
export function shadow(
  element: HTMLElement,
  options?: ShadowOptions,
): ShadowRoot;
