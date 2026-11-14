// Search scoring shared by the ⌘K palette (client) and the /search page
// (server), so both rank the static index the same way.

const scorePage = (query, page) => {
  const q = query.toLowerCase();
  const headings = page.headings.filter((heading) =>
    heading.text.toLowerCase().includes(q),
  );
  let score = 0;
  if (page.title.toLowerCase().includes(q)) score += 100;
  if (headings.length) score += 40;
  if (page.intro.toLowerCase().includes(q)) score += 20;
  if (page.text.toLowerCase().includes(q)) score += 10;
  return { score, headings };
};

/**
 * Rank index pages against a query. An empty query lists every page.
 * @returns {{ page: object, headings: object[] }[]}
 */
export const searchPages = (pages, rawQuery) => {
  const query = String(rawQuery ?? "").trim();
  if (!query) return pages.map((page) => ({ page, headings: [] }));

  return pages
    .map((page) => ({ page, ...scorePage(query, page) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => ({ page: entry.page, headings: entry.headings.slice(0, 4) }));
};
