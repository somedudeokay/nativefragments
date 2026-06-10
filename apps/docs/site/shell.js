import { attrs, html, raw } from "@nativefragments/core/server";
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

export const shell = ({ body, meta, nonce }) => {
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
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <script${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
    <style${attrs({ nonce })}>${raw(criticalStyles)}</style>
    <link rel="preload" href="/fonts/geist-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-600.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/space-grotesk-700.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/jetbrains-mono-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/app/styles.css" />
    <script${attrs({ nonce })} type="module" src="/app/client.js"></script>
  </head>
  <body>
    <p class="agent-index">
      For AI agents: fetch <a href="/llms.txt">/llms.txt</a> first for the
      curated documentation index, then use same-host Markdown pages when
      available.
    </p>
    ${siteHeader()}
    <div class="layout">
      <aside class="sidebar" id="docs-sidebar">
        <button type="button" class="search-trigger" data-search-trigger aria-label="Search documentation">
          <span class="search-trigger-label">Search the docs…</span>
          <kbd class="search-trigger-key">⌘K</kbd>
        </button>
        ${raw(renderNav(pathname))}
        <section class="sidebar-site">
          <h2>Native Fragments</h2>
          <a href="https://nativefragments.org/">Home</a>
          <a href="https://nativefragments.org/examples">Examples</a>
          <a href="https://nativefragments.org/demos">Demos</a>
          <a href="https://nativefragments.org/manifesto">Manifesto</a>
          <a href="https://github.com/somedudeokay/nativefragments">GitHub</a>
        </section>
      </aside>
      <main id="content-slot">${raw(body)}</main>
    </div>
    <div class="menu-scrim" data-menu-close></div>
    <nav class="mobile-bar" aria-label="Mobile">
      <button type="button" class="mobile-bar-btn" data-search-trigger aria-label="Search documentation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <span>Search</span>
      </button>
      <button type="button" class="mobile-bar-btn mobile-menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="docs-sidebar">
        <span class="mb-open">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>
          Menu
        </span>
        <span class="mb-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>
          Close
        </span>
      </button>
    </nav>
    <docs-search></docs-search>
  </body>
</html>`;
};
