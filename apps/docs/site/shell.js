import { html, raw } from "@nativefragments/core/server";
import { criticalStyles } from "./critical-styles.js";
import { siteHeader } from "./header.js";
import { navGroups } from "./nav.js";

const renderNav = (pathname) => html`${raw(
  navGroups
    .map(
      (group) => `<section>
        <h2>${group.title}</h2>
        ${group.links
          .map(
            (link) =>
              `<a href="${link.href}" ${
                link.href === pathname ? 'aria-current="page"' : ""
              }>${link.label}</a>`,
          )
          .join("")}
      </section>`,
    )
    .join(""),
)}`;

export const shell = ({ body, meta }) => {
  const pathname = meta.canonical?.startsWith("http")
    ? new URL(meta.canonical).pathname
    : (meta.canonical ?? "/");

  return html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="google-site-verification" content="JjtSSqZr2dhqfTA7wWejjridMsTwUuGDTKPBdIRdBl4" />
    <link rel="canonical" href="${meta.canonical}" />
    <script>
      document.documentElement.classList.add("js");
    </script>
    <style>${raw(criticalStyles)}</style>
    <link rel="preload" href="/fonts/geist-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-600.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/space-grotesk-700.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/jetbrains-mono-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/app/styles.css" />
    <script type="module" src="/app/client.js"></script>
  </head>
  <body>
    <p class="agent-index">
      For AI agents: fetch <a href="/llms.txt">/llms.txt</a> first for the
      curated documentation index, then use same-host Markdown pages when
      available.
    </p>
    ${siteHeader()}
    <div class="layout">
      <aside class="sidebar">
        <button type="button" class="search-trigger" data-search-trigger aria-label="Search documentation">
          <span class="search-trigger-label">Search the docs…</span>
          <kbd class="search-trigger-key">⌘K</kbd>
        </button>
        ${raw(renderNav(pathname))}
      </aside>
      <main id="content-slot">${raw(body)}</main>
    </div>
    <docs-search></docs-search>
  </body>
</html>`;
};
