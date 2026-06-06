// Generate Markdown mirrors of each docs page from the rendered HTML, so the
// agent-facing .md files never drift from the pages. reference.md is produced
// by generate-api-reference.js instead (straight from JSDoc).

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const publicDir = path.join(root, "public");
const routesUrl = pathToFileURL(path.join(root, "site/routes.js")).href;
const { routes } = await import(routesUrl);

const mirrors = {
  "/": "index",
  "/getting-started": "getting-started",
  "/concepts/routing": "routing",
  "/concepts/fragments": "fragments",
  "/concepts/components": "components",
  "/concepts/api-routes": "api-routes",
  "/concepts/workers": "workers",
  "/concepts/signals": "signals",
  "/concepts/agent-friendly": "agent-friendly",
  "/ai": "ai",
};

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&middot;/g, "·");

const stripTags = (value) => value.replace(/<[^>]+>/g, "");

// Inline HTML -> Markdown (links, code, emphasis), then drop leftover tags.
const inline = (value) =>
  value
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${stripTags(text)}](${href})`)
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, text) => `\`${stripTags(text)}\``)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, (_, text) => `**${stripTags(text)}**`)
    .replace(/<em>([\s\S]*?)<\/em>/g, (_, text) => `_${stripTags(text)}_`)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const toMarkdown = (htmlString) => {
  const blocks = [];
  const stash = (markdown) => {
    blocks.push(markdown);
    return `@@${blocks.length - 1}@@`;
  };

  let html = htmlString;

  // Drop the "On this page" navigation — it is chrome, not content.
  html = html.replace(/<nav class="toc"[^>]*>[\s\S]*?<\/nav>/g, "");

  // Extract code + callouts first so the whitespace collapse cannot corrupt
  // highlighted token spacing inside code.
  html = html.replace(
    /<pre class="code-block" data-language="([^"]+)"><code>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, body) => stash(`\`\`\`${lang}\n${stripTags(body)}\n\`\`\``),
  );
  html = html.replace(
    /<aside class="callout">\s*<strong>([\s\S]*?)<\/strong>\s*<p>([\s\S]*?)<\/p>\s*<\/aside>/g,
    (_, title, text) => stash(`> **${inline(title)}:** ${inline(text)}`),
  );

  // No code spans remain — safe to drop inter-tag whitespace.
  html = html.replace(/>\s+</g, "><");

  html = html
    .replace(/<p class="eyebrow">[\s\S]*?<\/p>/g, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, (_, t) => `\n# ${inline(t)}\n`)
    .replace(/<p class="intro">([\s\S]*?)<\/p>/g, (_, t) => `\n${inline(t)}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_, t) => `\n## ${inline(t)}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (_, t) => `\n### ${inline(t)}\n`)
    .replace(/<ul>([\s\S]*?)<\/ul>/g, (_, inner) => {
      const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)]
        .map((match) => `- ${inline(match[1])}`)
        .join("\n");
      return `\n${items}\n`;
    })
    .replace(/<p>([\s\S]*?)<\/p>/g, (_, t) => `\n${inline(t)}\n`)
    .replace(/<[^>]+>/g, ""); // drop remaining structural tags

  // Restore code + callout blocks, then decode entities once.
  html = decode(html.replace(/@@(\d+)@@/g, (_, index) => `\n${blocks[Number(index)]}\n`));

  return `${html
    .split("\n")
    .map((line) => (line.trim() === "" ? "" : line.replace(/\s+$/, "")))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
};

const context = (pathname) => ({
  params: {},
  url: new URL(`https://docs.nativefragments.org${pathname}`),
});

let count = 0;
for (const route of routes) {
  const name = mirrors[route.path];
  if (!name) continue;
  const rendered = await route.render(context(route.path));
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, `${name}.md`), toMarkdown(rendered));
  count += 1;
}

console.log(`md mirrors: ${count} pages`);
