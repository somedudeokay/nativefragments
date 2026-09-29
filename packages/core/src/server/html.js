const RAW = Symbol("nativefragments.raw");

/**
 * @typedef {{ [RAW]: true, value: string, toString(): string }} RawHtml
 * Trusted HTML wrapper returned by {@link html}, {@link raw}, and {@link attrs}.
 * Values with this marker bypass escaping when
 * interpolated into {@link html}.
 */

const trustedHtml = (value) => ({
  [RAW]: true,
  value: String(value),
  toString() {
    return this.value;
  },
});

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
    : trustedHtml(value);

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
 * and trusted values returned by {@link html}, {@link raw}, or {@link attrs}
 * are inserted as HTML without being re-escaped.
 *
 * @param {TemplateStringsArray} strings Template literal string parts.
 * @param {...unknown} values Interpolated values.
 * @returns {RawHtml} Rendered HTML wrapper.
 */
export const html = (strings, ...values) =>
  trustedHtml(
    strings.reduce(
      (output, string, index) => output + string + renderValue(values[index]),
      "",
    ),
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

const validAttributeName = /^[a-zA-Z][a-zA-Z0-9:_.-]*$/;

/**
 * Build escaped HTML attributes from an object.
 *
 * `false`, `null`, and `undefined` values are omitted. `true` values render as
 * boolean attributes. Attribute names must be valid HTML-like names.
 *
 * @param {HtmlAttrs} [attributes={}] Attribute map.
 * @returns {RawHtml} Trusted HTML attribute string.
 */
export const attrs = (attributes = {}) =>
  raw(
    Object.entries(attributes)
      .filter(([, value]) => value !== false && value != null)
      .map(([name, value]) => {
        if (!validAttributeName.test(name)) {
          throw new TypeError(`Invalid HTML attribute name: ${name}`);
        }
        return value === true ? ` ${name}` : ` ${name}="${escapeHtml(value)}"`;
      })
      .join(""),
  );
