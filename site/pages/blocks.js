import { html, raw } from "@nativefragments/core/server";
import { codeBlock } from "../code.js";

export const code = (source, language = "js") => codeBlock(source, language);

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
