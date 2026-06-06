// Shared heading helpers: turn h2/h3 text into stable slugs and inject `id`
// attributes so docs deep-link (#anchor) and the search index can target
// individual sections. The same slugify runs in the search-index generator so
// ids and result links always match.

export const slugify = (text) =>
  String(text)
    .replace(/<[^>]*>/g, "") // strip nested tags (e.g. inline <code>)
    .replace(/&[a-z]+;/gi, " ") // strip HTML entities
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Add an `id` to every plain `<h2>`/`<h3>` in a rendered HTML string. Headings
 * that already carry attributes are left untouched.
 */
export const withHeadingIds = (htmlString) =>
  String(htmlString).replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (match, tag, inner) => {
      const id = slugify(inner);
      return id ? `<${tag} id="${id}">${inner}</${tag}>` : match;
    },
  );

/**
 * Pull the h2/h3 headings (with their ids) out of rendered HTML, for building
 * an "On this page" table of contents. Run after {@link withHeadingIds}.
 */
export const extractHeadings = (htmlString) => {
  const headings = [];
  const pattern = /<(h[23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = pattern.exec(htmlString)) !== null) {
    headings.push({
      level: Number(match[1][1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return headings;
};
