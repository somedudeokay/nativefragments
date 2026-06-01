import { html, raw } from "@nativefragments/core/server";
import { apiSections } from "../generated/api-reference.js";
import { docPage } from "./blocks.js";

const renderSymbol = (symbol) => html`<article class="api-symbol">
  <h3>${symbol.name}</h3>
  <p>${symbol.description}</p>
  ${symbol.type ? raw(`<h4>Type</h4><p><code>${symbol.type}</code></p>`) : ""}
  ${symbol.params.length
    ? raw(`<h4>Parameters</h4><ul>${symbol.params
        .map((param) => `<li><code>${param}</code></li>`)
        .join("")}</ul>`)
    : ""}
  ${symbol.returns
    ? raw(`<h4>Returns</h4><p><code>${symbol.returns}</code></p>`)
    : ""}
</article>`;

const renderType = (type) => html`<article class="api-symbol type-symbol">
  <h3>${type.name}</h3>
  <p><code>${type.type}</code></p>
  ${type.description ? html`<p>${type.description}</p>` : ""}
  ${type.properties.length
    ? raw(`<h4>Properties</h4><ul>${type.properties
        .map((property) => `<li><code>${property}</code></li>`)
        .join("")}</ul>`)
    : ""}
</article>`;

export const referencePage = () =>
  docPage({
    eyebrow: "Reference",
    title: "Generated API reference.",
    intro:
      "This page is generated from JSDoc comments in the @nativefragments/core source package.",
    body: html`
      ${raw(
        apiSections
          .map(
            (section) => `<section class="api-section">
              <p class="module">${section.module}</p>
              <h2>${section.title}</h2>
              ${section.types.map((type) => renderType(type)).join("")}
              ${section.symbols.map((symbol) => renderSymbol(symbol)).join("")}
            </section>`,
          )
          .join(""),
      )}
    `,
  });
