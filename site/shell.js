import { html, raw } from "@nativefragments/core/server";
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
    <link rel="canonical" href="${meta.canonical}" />
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
      <aside class="sidebar">${raw(renderNav(pathname))}</aside>
      <main id="content-slot">${raw(body)}</main>
    </div>
  </body>
</html>`;
};
