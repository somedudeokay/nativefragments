import { attrs, html, raw } from "@nativefragments/core/server";
import { renderLit } from "@nativefragments/lit/server";
import { html as lit } from "lit";
import { criticalStyles } from "./critical-styles.js";
import { siteHeader } from "./header.js";
import { navGroups } from "./nav.js";
import "../client/components/docs-search.js";

const renderNav = (pathname) => html`${navGroups.map(
  (group) => html`<section>
        <h2>${group.title}</h2>
        <ul role="list">
          ${group.links.map(
            (link) => html`<li><a
              href="${link.href}"
              ${link.href === pathname ? html`aria-current="page"` : ""}
              >${link.label}</a
            ></li>`,
          )}
        </ul>
      </section>`,
)}`;

export const shell = async ({ body, meta, nonce }) => {
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
    <link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/jetbrains-mono-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/app/styles.css" />
    <script${attrs({ nonce })} type="module" src="/build/client.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#content-slot">Skip to content</a>
    <p class="agent-index">
      For AI agents: fetch <a href="/llms.txt">/llms.txt</a> first for the
      curated documentation index, then use same-host Markdown pages when
      available.
    </p>
    ${await siteHeader()}
    <div class="layout">
      <nav class="sidebar" id="docs-sidebar" aria-label="Docs">
        <a class="search-trigger" href="/search" data-search-trigger>
          <span class="search-trigger-label">Search the docs…</span>
          <kbd class="search-trigger-key" aria-hidden="true">⌘K</kbd>
        </a>
        ${renderNav(pathname)}
        <section class="sidebar-site">
          <h2>Native Fragments</h2>
          <ul role="list">
            <li><a href="https://nativefragments.org/">Home</a></li>
            <li><a href="https://github.com/somedudeokay/nativefragments">GitHub</a></li>
          </ul>
        </section>
      </nav>
      <main id="content-slot">${body}</main>
    </div>
    <div class="menu-scrim" data-menu-close></div>
    <div class="mobile-bar">
      <a class="mobile-bar-btn" href="/search" data-search-trigger>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <span>Search</span>
      </a>
      <a class="mobile-bar-btn mobile-menu-toggle no-js-only" href="#docs-sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>
        Menu
      </a>
      <button type="button" class="mobile-bar-btn mobile-menu-toggle js-only" data-menu-toggle aria-expanded="false" aria-controls="docs-sidebar">
        <span class="mb-open">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"></path></svg>
          Menu
        </span>
        <span class="mb-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>
          Close
        </span>
      </button>
    </div>
    ${await renderLit(lit`<docs-search></docs-search>`)}
  </body>
</html>`;
};
