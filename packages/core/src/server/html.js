const RAW = Symbol("nativefragments.raw");

/**
 * @typedef {{ [RAW]: true, value: string }} RawHtml
 * Trusted HTML wrapper returned by {@link raw}. Values with this marker bypass
 * escaping when interpolated into {@link html}.
 */

/**
 * Mark a value as trusted HTML.
 *
 * Use this only for framework-generated markup or content that has already been
 * validated. Ordinary interpolated values in {@link html} are escaped by
 * default.
 *
 * @param {unknown} [value=""] HTML to insert without escaping.
 * @returns {RawHtml} Trusted HTML wrapper.
 */
export const raw = (value = "") =>
  value?.[RAW]
    ? value
    : {
        [RAW]: true,
        value: String(value),
      };

/**
 * Escape a value for safe insertion into HTML text or attribute context.
 *
 * @param {unknown} value Value to escape.
 * @returns {string} Escaped HTML string.
 */
export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderValue = (value) => {
  if (value == null || value === false) return "";
  if (Array.isArray(value)) return value.map(renderValue).join("");
  if (value?.[RAW]) return value.value;
  return escapeHtml(value);
};

/**
 * Server-side HTML template tag with escaped interpolation by default.
 *
 * Arrays are flattened, `null`, `undefined`, and `false` become empty strings,
 * and values returned by {@link raw} are inserted as trusted HTML.
 *
 * @param {TemplateStringsArray} strings Template literal string parts.
 * @param {...unknown} values Interpolated values.
 * @returns {string} Rendered HTML.
 */
export const html = (strings, ...values) =>
  strings.reduce(
    (output, string, index) => output + string + renderValue(values[index]),
    "",
  );

const escapeStyleText = (value) =>
  String(value).replace(/<\/style/gi, "<\\/style");

/**
 * @typedef {object} DeclarativeShadowOptions
 * @property {string[]} [styles=[]] CSS text rendered into `<style>` tags inside
 * the declarative shadow root.
 * @property {string} [html=""] Trusted shadow root HTML. Build dynamic HTML with
 * {@link html} before passing it here.
 */

/**
 * Render a declarative Shadow DOM template for server-rendered components.
 *
 * Put this as the first child of a custom element to avoid a flash of unstyled
 * light DOM before the component module loads. Pair it with the browser
 * {@link shadow} helper, which preserves an existing declarative shadow root on
 * first upgrade and materializes declarative shadow templates inserted during
 * fragment navigation.
 *
 * @param {DeclarativeShadowOptions} [options={}] Shadow template options.
 * @returns {RawHtml} Trusted declarative shadow template.
 */
export const declarativeShadow = ({ styles = [], html: shadowHtml = "" } = {}) =>
  raw(
    `<template shadowrootmode="open">${styles
      .map((style) => `<style data-nativefragments-shadow>${escapeStyleText(style)}</style>`)
      .join("")}${shadowHtml}</template>`,
  );

/**
 * Serialize JSON for safe embedding inside an inline script tag.
 *
 * `<` characters are escaped so embedded JSON cannot accidentally terminate the
 * script element.
 *
 * @param {unknown} value Value to serialize.
 * @returns {string} JSON string safe for script text.
 */
export const jsonScript = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

/**
 * @typedef {Record<string, string | number | boolean | null | undefined>} HtmlAttrs
 */

/**
 * Build escaped HTML attributes from an object.
 *
 * `false`, `null`, and `undefined` values are omitted. `true` values render as
 * boolean attributes.
 *
 * @param {HtmlAttrs} [attributes={}] Attribute map.
 * @returns {RawHtml} Trusted HTML attribute string.
 */
export const attrs = (attributes = {}) =>
  raw(
    Object.entries(attributes)
      .filter(([, value]) => value !== false && value != null)
      .map(([name, value]) =>
        value === true ? ` ${name}` : ` ${name}="${escapeHtml(value)}"`,
      )
      .join(""),
  );
