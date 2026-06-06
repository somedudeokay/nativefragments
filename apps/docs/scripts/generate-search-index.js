// Build a static search index from the route table so ⌘K search stays in sync
// with the rendered docs. Runs at build time (see package.json scripts) and
// writes public/app/search-index.json, fetched lazily by <docs-search>.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outputPath = path.join(root, "public/app/search-index.json");

const routesUrl = pathToFileURL(path.join(root, "site/routes.js")).href;
const { routes } = await import(routesUrl);

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ");

const stripTags = (value) =>
  decode(String(value).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const firstMatch = (source, pattern) => source.match(pattern)?.[1] ?? "";

const collectHeadings = (source) => {
  const headings = [];
  const pattern = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    headings.push({
      id: match[2],
      text: stripTags(match[3]),
      depth: Number(match[1]),
    });
  }
  return headings;
};

const context = (pathname) => ({
  params: {},
  url: new URL(`https://docs.nativefragments.org${pathname}`),
});

const entries = [];

for (const route of routes) {
  if (route.path === "404") continue;

  const meta = (await route.meta?.(context(route.path))) ?? {};
  // Drop the "On this page" navigation so its labels don't pollute the index.
  const rendered = (await route.render(context(route.path))).replace(
    /<nav class="toc"[^>]*>[\s\S]*?<\/nav>/g,
    "",
  );

  const title = stripTags(firstMatch(rendered, /<h1[^>]*>([\s\S]*?)<\/h1>/));
  const eyebrow = stripTags(firstMatch(rendered, /<p class="eyebrow">([\s\S]*?)<\/p>/));
  const intro = stripTags(firstMatch(rendered, /<p class="intro">([\s\S]*?)<\/p>/));

  entries.push({
    path: route.path,
    title: title || meta.title || route.path,
    eyebrow,
    intro,
    headings: collectHeadings(rendered),
    // Trimmed full text powers fuzzy matching; capped to keep the index small.
    text: stripTags(rendered).slice(0, 4000),
  });
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(entries)}\n`);

console.log(`search index: ${entries.length} pages -> ${path.relative(root, outputPath)}`);
