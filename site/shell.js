import { html, raw } from "@nativefragments/core/server";
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
  const pathname = new URL(meta.canonical).pathname;

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
    <nf-site-header>
      <a href="https://nativefragments.org/">Native Fragments</a>
      <a href="https://docs.nativefragments.org">Docs</a>
      <a href="https://nativefragments.org/examples">Examples</a>
      <a href="https://nativefragments.org/demos">Demos</a>
      <a href="https://nativefragments.org/manifesto">Manifesto</a>
      <a href="https://github.com/somedudeokay/nativefragments">GitHub</a>
      <a href="https://www.npmjs.com/package/@nativefragments/core">npm</a>
    </nf-site-header>
    <div class="layout">
      <aside class="sidebar">${raw(renderNav(pathname))}</aside>
      <main id="content-slot">${raw(body)}</main>
    </div>
  </body>
</html>`;
};
