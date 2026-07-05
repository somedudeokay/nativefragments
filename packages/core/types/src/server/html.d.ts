export function raw(value?: unknown): RawHtml;
export function escapeHtml(value: unknown): string;
export function html(strings: TemplateStringsArray, ...values: unknown[]): RawHtml;
export function declarativeShadow({ styles, html: shadowHtml }?: DeclarativeShadowOptions): RawHtml;
export function jsonScript(value: unknown): string;
export function attrs(attributes?: HtmlAttrs): RawHtml;
/**
 * Trusted HTML wrapper returned by {@link html}, {@link raw}, {@link attrs},
 * and {@link declarativeShadow}. Values with this marker bypass escaping when
 * interpolated into {@link html}.
 */
export type RawHtml = {
    [RAW]: true;
    value: string;
    toString(): string;
};
export type DeclarativeShadowOptions = {
    /**
     * CSS text rendered into `<style>` tags inside
     * the declarative shadow root.
     */
    styles?: string[];
    /**
     * Trusted shadow root HTML. Build dynamic HTML with
     * {@link html} before passing it here.
     */
    html?: string;
};
export type HtmlAttrs = Record<string, string | number | boolean | null | undefined>;
declare const RAW: unique symbol;
export {};
