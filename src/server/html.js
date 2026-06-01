const RAW = Symbol("nativefragments.raw");

export const raw = (value = "") => ({
  [RAW]: true,
  value: String(value),
});

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

export const html = (strings, ...values) =>
  strings.reduce(
    (output, string, index) => output + string + renderValue(values[index]),
    "",
  );

export const jsonScript = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const attrs = (attributes = {}) =>
  raw(
    Object.entries(attributes)
      .filter(([, value]) => value !== false && value != null)
      .map(([name, value]) =>
        value === true ? ` ${name}` : ` ${name}="${escapeHtml(value)}"`,
      )
      .join(""),
  );
