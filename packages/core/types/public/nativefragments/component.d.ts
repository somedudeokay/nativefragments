export function sheet(cssText: string): CSSStyleSheet;
export function shadow(element: HTMLElement, { styles, html, hydrate }?: ShadowOptions): ShadowRoot;
export type ShadowOptions = {
    /**
     * Constructable stylesheets to adopt.
     */
    styles?: CSSStyleSheet[];
    /**
     * Shadow root HTML.
     */
    html?: string;
    /**
     * Preserve an existing declarative shadow
     * root on the first render so server-rendered components do not flash.
     */
    hydrate?: boolean;
};
