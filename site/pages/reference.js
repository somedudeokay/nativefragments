import { escapeHtml, html, raw } from "@nativefragments/core/server";
import { apiSections, apiTypes } from "../generated/api-reference.js";
import { codeBlock } from "../code.js";
import { docPage } from "./blocks.js";

// Render JSDoc prose: escape, resolve {@link symbol} to in-page anchors, and
// turn `backtick` spans into <code>.
const inline = (text) =>
  escapeHtml(text ?? "")
    .replace(/\{@link\s+([A-Za-z0-9_$]+)\}/g, '<a href="#$1"><code>$1</code></a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");

// Curated, copy-paste examples keyed by symbol. The generator stays the source
// of truth for signatures and parameters; examples live here so they can be
// idiomatic and commented.
const examples = {
  html: `import { html, raw } from "@nativefragments/core/server";

// Interpolations are escaped by default — user input is safe.
const card = (post) => html\`<article>
  <h2>\${post.title}</h2>
  \${raw(post.bodyHtml)}
</article>\`;`,
  raw: `html\`<div>\${userInput}</div>\`        // escaped — safe
html\`<div>\${raw(userInput)}</div>\`   // bypasses escaping — trusted HTML only`,
  attrs: `import { attrs, html } from "@nativefragments/core/server";

// false / null / undefined are dropped; true renders a boolean attribute.
html\`<button \${attrs({ disabled: post.locked, "data-id": post.id })}>Edit</button>\`;`,
  declarativeShadow: `import { declarativeShadow, html } from "@nativefragments/core/server";

// Ship the shadow root in server HTML so the component never flashes unstyled.
html\`<reading-progress>
  \${declarativeShadow({ styles: [barCss], html: \`<div class="bar"></div>\` })}
</reading-progress>\`;`,
  jsonScript: `import { html, jsonScript, raw } from "@nativefragments/core/server";

// Safe to embed in an inline script — "<" is escaped.
html\`<script type="application/json">\${raw(jsonScript(state))}</script>\`;`,
  route: `import { html, route } from "@nativefragments/core/server";

// :slug becomes ctx.params.slug
export const post = route("/blog/:slug", {
  meta: (ctx) => ({ title: ctx.params.slug }),
  render: (ctx) => html\`<h1>\${ctx.params.slug}</h1>\`,
});`,
  fragment: `import { fragment, route } from "@nativefragments/core/server";

const panel = fragment("settings-panel", renderPanel);

route("/settings/profile", {
  render: settingsPage,
  fragments: [panel], // exposes the named slot for partial swaps
});`,
  createRoutes: `import { createRoutes } from "@nativefragments/core/server";

const manifest = createRoutes([home, post]);
manifest.match("/blog/hello"); // → the post route, params.slug = "hello"`,
  createCloudflareHandler: `// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });`,
  installFragmentNavigation: `// app/client.js
import { installFragmentNavigation } from "/nativefragments/router.js";

// Upgrade real links into fragment swaps; prefetch on hover/focus.
const navigate = installFragmentNavigation({ prefetch: "intent" });`,
  prefetchFragment: `import { prefetchFragment } from "/nativefragments/router.js";

// Warm the cache so the next navigation swaps instantly.
await prefetchFragment("/blog/hello");`,
  sheet: `import { sheet } from "/nativefragments/component.js";

// Build once at module scope and share across every instance.
const styles = sheet(\`:host { display: block }\`);`,
  shadow: `import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(\`button { font: inherit }\`);

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    // Reuses a server-rendered shadow root on first upgrade (no FOUC).
    shadow(this, { styles: [styles], html: \`<button>Toggle</button>\` });
  }
}
customElements.define("theme-toggle", ThemeToggle);`,
  exposeWorker: `// public/app/search-worker.js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  search: ({ rows, query }) =>
    rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase())),
});`,
  createWorkerClient: `import { createWorkerClient } from "/nativefragments/worker.js";

const search = createWorkerClient("/app/search-worker.js");
const hits = await search.call("search", { rows, query: "native" });`,
  transferResult: `import { exposeWorker, transferResult } from "/nativefragments/worker.js";

exposeWorker({
  // Move the buffer instead of copying it.
  bytes: (buffer) => transferResult(buffer, [buffer]),
});`,
};

// Per-symbol "See also" links back to the concept guide.
const seeAlso = {
  html: [["Components", "/concepts/components"]],
  raw: [["Agent-Friendly Apps", "/concepts/agent-friendly"]],
  declarativeShadow: [["Components", "/concepts/components"]],
  route: [["Routing", "/concepts/routing"]],
  createRoutes: [["Routing", "/concepts/routing"]],
  fragment: [["Fragments", "/concepts/fragments"]],
  fragmentMeta: [["Fragments", "/concepts/fragments"]],
  notFoundRoute: [["Routing", "/concepts/routing"]],
  createCloudflareHandler: [
    ["API Routes", "/concepts/api-routes"],
    ["Getting Started", "/getting-started"],
  ],
  installFragmentNavigation: [["Fragments", "/concepts/fragments"]],
  prefetchFragment: [["Fragments", "/concepts/fragments"]],
  sheet: [["Components", "/concepts/components"]],
  shadow: [["Components", "/concepts/components"]],
  exposeWorker: [["Workers", "/concepts/workers"]],
  createWorkerClient: [["Workers", "/concepts/workers"]],
  workerClient: [["Workers", "/concepts/workers"]],
  transferResult: [["Workers", "/concepts/workers"]],
};

const appendixNames = [...apiTypes]
  .map((type) => type.name)
  .sort((a, b) => b.length - a.length);

// Link any appendix type name inside a type string to its anchor.
const linkTypes = (typeText) => {
  let out = escapeHtml(typeText ?? "");
  for (const name of appendixNames) {
    out = out.replace(
      new RegExp(`\\b${name}\\b`, "g"),
      `<a class="api-typelink" href="#${name}">${name}</a>`,
    );
  }
  return out;
};

// A parameter / option / property as an indented field line.
const renderField = (field) => `<li class="api-field">
  <div class="api-field-head">
    <code class="api-fname">${escapeHtml(field.name)}</code>
    ${field.type ? `<span class="api-ftype">${linkTypes(field.type)}</span>` : ""}
    ${field.optional ? `<span class="api-badge">optional</span>` : ""}
    ${field.default ? `<span class="api-default">= ${escapeHtml(field.default)}</span>` : ""}
  </div>
  ${field.description ? `<p class="api-fdesc">${inline(field.description)}</p>` : ""}
  ${field.fields?.length ? `<ul class="api-fields api-nested">${field.fields.map(renderField).join("")}</ul>` : ""}
</li>`;

const fieldList = (fields) =>
  fields?.length ? `<ul class="api-fields">${fields.map(renderField).join("")}</ul>` : "";

const seeAlsoLine = (name) =>
  seeAlso[name]
    ? `<p class="api-seealso"><span>See also</span> ${seeAlso[name]
        .map(([label, href]) => `<a href="${href}">${label}</a>`)
        .join(" · ")}</p>`
    : "";

// A symbol/type title that links to its exact source line on GitHub.
const symbolLink = (name, source) =>
  source
    ? `<a class="api-ghlink" href="${source}" target="_blank" rel="noopener">${name}</a>`
    : name;

// One-line description per module, shown under each section heading.
const moduleInfo = {
  "Server HTML":
    "Tagged-template HTML rendering that escapes by default, with helpers for attributes, JSON, and declarative Shadow DOM.",
  "Server Routing":
    "Define routes, match requests, and render full pages or individual named fragments.",
  "Cloudflare Adapter":
    "Turn a route manifest into a Cloudflare Worker that serves pages, fragments, static assets, and API routes.",
  "Browser Router":
    "Upgrade same-origin links into fragment navigations, with prefetching and metadata updates.",
  "Shadow DOM Components":
    "Attach scoped Shadow DOM and adopt constructable stylesheets inside Custom Elements.",
  "Web Workers":
    "A tiny RPC layer over Web Workers for moving expensive work off the main thread.",
};

const sectionIntro = (section) => {
  const desc = moduleInfo[section.title] ?? "";
  const link = section.source
    ? `<a class="api-source" href="${section.source}" target="_blank" rel="noopener">Source &#8599;</a>`
    : "";
  return desc || link ? `<p class="api-section-desc">${desc} ${link}</p>` : "";
};

const renderSymbol = (symbol) => `<article class="api-symbol">
  <h3 id="${symbol.name}">${symbolLink(symbol.name, symbol.source)}</h3>
  <pre class="api-sig"><code>${escapeHtml(symbol.signature)}</code></pre>
  ${symbol.description ? `<p>${inline(symbol.description)}</p>` : ""}
  ${symbol.type ? `<p class="api-label">Type</p><p class="api-returns-line"><code>${linkTypes(symbol.type)}</code></p>` : ""}
  ${
    symbol.params.length
      ? `<p class="api-label">Parameters</p>${fieldList(symbol.params)}`
      : symbol.signature.includes("(")
        ? `<p class="api-empty">Takes no parameters.</p>`
        : ""
  }
  ${
    symbol.returns?.type || symbol.returns?.description
      ? `<p class="api-label">Returns</p>
        <p class="api-returns-line"><span class="api-ftype">${linkTypes(symbol.returns.type)}</span>${
          symbol.returns.description ? ` — ${inline(symbol.returns.description)}` : ""
        }</p>
        ${symbol.returnFields?.length ? fieldList(symbol.returnFields) : ""}`
      : ""
  }
  ${examples[symbol.name] ? codeBlock(examples[symbol.name]).value : ""}
  ${seeAlsoLine(symbol.name)}
</article>`;

const renderAppendixType = (type) => `<div class="api-type" id="${type.name}">
  <h4 class="api-type-name">${symbolLink(type.name, type.source)}</h4>
  <pre class="api-sig"><code>${escapeHtml(type.type)}</code></pre>
  ${type.description ? `<p>${inline(type.description)}</p>` : ""}
  ${type.properties?.length ? `<p class="api-label">Properties</p>${fieldList(type.properties)}` : ""}
</div>`;

export const referencePage = () =>
  docPage({
    eyebrow: "Reference",
    title: "API Reference.",
    intro:
      "Generated from JSDoc in @nativefragments/core. Each symbol links back to the concept guide that explains it.",
    body: html`${raw(
      `${apiSections
        .map(
          (section) => `<section class="api-section">
            <p class="module">${section.module}</p>
            <h2>${section.title}</h2>
            ${sectionIntro(section)}
            ${section.symbols.map(renderSymbol).join("")}
          </section>`,
        )
        .join("")}${
        apiTypes.length
          ? `<section class="api-section api-appendix">
            <h2>Types</h2>
            <p class="api-section-desc">Shared object shapes referenced by the functions above.</p>
            ${apiTypes.map(renderAppendixType).join("")}
          </section>`
          : ""
      }`,
    )}`,
  });
