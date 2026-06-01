import { html, raw } from "@nativefragments/core/server";
import { criticalStyles } from "./critical-styles.js";
import { siteHeader } from "./header.js";
import { navGroups } from "./nav.js";

const fontHref =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@500;600;700&display=swap";

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
    <link rel="canonical" href="${meta.canonical}" />
    <script>
      document.documentElement.classList.add("js");
    </script>
    <style>${raw(criticalStyles)}</style>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="preload"
      href="${fontHref}"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript><link rel="stylesheet" href="${fontHref}" /></noscript>
    <link
      rel="preload"
      href="/app/styles.css"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript><link rel="stylesheet" href="/app/styles.css" /></noscript>
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
      <aside class="sidebar">${raw(renderNav(pathname))}</aside>
      <main id="content-slot">${raw(body)}</main>
    </div>
  </body>
</html>`;
};
