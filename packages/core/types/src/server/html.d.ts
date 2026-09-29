export function raw(value?: unknown): RawHtml;
export function escapeHtml(value: unknown): string;
export function html(strings: TemplateStringsArray, ...values: unknown[]): RawHtml;
export function jsonScript(value: unknown): string;
export function attrs(attributes?: HtmlAttrs): RawHtml;
/**
 * Trusted HTML wrapper returned by {@link html}, {@link raw}, and {@link attrs}.
 * Values with this marker bypass escaping when
 * interpolated into {@link html}.
 */
export type RawHtml = {
    [RAW]: true;
    value: string;
    toString(): string;
};
export type HtmlAttrs = Record<string, string | number | boolean | null | undefined>;
declare const RAW: unique symbol;
export {};
