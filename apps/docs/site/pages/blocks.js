import { html, raw } from "@nativefragments/core/server";
import { codeBlock } from "../code.js";
import { extractHeadings, withHeadingIds } from "../headings.js";

export const code = (source, language = "js") => codeBlock(source, language);

// "On this page" table of contents, rendered only when a page has enough
// headings to be worth jumping around.
const tableOfContents = (headings) => {
  if (headings.length < 2) return "";
  const items = headings
    .map(
      (heading) =>
        `<a class="toc-link toc-l${heading.level}" href="#${heading.id}" data-toc="${heading.id}">${heading.text}</a>`,
    )
    .join("");
  return `<nav class="toc" aria-label="On this page">
    <p class="toc-title">On this page</p>
    ${items}
  </nav>`;
};

export const docPage = ({ eyebrow, title, intro, body }) => {
  const withIds = withHeadingIds(body);
  const toc = tableOfContents(extractHeadings(withIds));
  return html`<div class="doc-shell">
    <article class="doc">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p class="intro">${intro}</p>
      ${raw(withIds)}
    </article>
    ${raw(toc)}
  </div>`;
};

export const callout = (title, text) =>
  raw(html`<aside class="callout">
    <strong>${title}</strong>
    <p>${text}</p>
  </aside>`);
