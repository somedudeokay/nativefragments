import { html, raw } from "@nativefragments/core/server";

export const code = (source) =>
  raw(`<pre><code>${source.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`);

export const docPage = ({ eyebrow, title, intro, body }) => html`<article class="doc">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${title}</h1>
  <p class="intro">${intro}</p>
  ${raw(body)}
</article>`;

export const callout = (title, text) =>
  raw(html`<aside class="callout">
    <strong>${title}</strong>
    <p>${text}</p>
  </aside>`);
