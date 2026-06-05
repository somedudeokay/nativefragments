import { escapeHtml, html, raw } from "@nativefragments/core/server";
import { apiSections } from "../generated/api-reference.js";
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

const paramsTable = (params) =>
  params.length
    ? `<table class="api-params">
        <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>${params
          .map(
            (param) => `<tr>
              <td><code>${escapeHtml(param.name)}</code></td>
              <td>${param.type ? `<code>${escapeHtml(param.type)}</code>` : "—"}</td>
              <td>${
                param.default
                  ? `<code>${escapeHtml(param.default)}</code>`
                  : param.optional
                    ? "—"
                    : '<span class="req">required</span>'
              }</td>
              <td>${inline(param.description)}</td>
            </tr>`,
          )
          .join("")}</tbody>
      </table>`
    : "";

const seeAlsoLine = (name) =>
  seeAlso[name]
    ? `<p class="api-seealso"><span>See also</span> ${seeAlso[name]
        .map(([label, href]) => `<a href="${href}">${label}</a>`)
        .join(" · ")}</p>`
    : "";

const renderSymbol = (symbol) => `<article class="api-symbol">
  <h3 id="${symbol.name}">${symbol.name}</h3>
  <pre class="api-sig"><code>${escapeHtml(symbol.signature)}</code></pre>
  ${symbol.description ? `<p>${inline(symbol.description)}</p>` : ""}
  ${symbol.type ? `<p class="api-meta"><span>Type</span> <code>${escapeHtml(symbol.type)}</code></p>` : ""}
  ${paramsTable(symbol.params)}
  ${
    symbol.returns?.type || symbol.returns?.description
      ? `<p class="api-meta"><span>Returns</span> ${
          symbol.returns.type ? `<code>${escapeHtml(symbol.returns.type)}</code>` : ""
        } ${inline(symbol.returns.description)}</p>`
      : ""
  }
  ${examples[symbol.name] ? codeBlock(examples[symbol.name]).value : ""}
  ${seeAlsoLine(symbol.name)}
</article>`;

const renderType = (type) => `<article class="api-symbol type-symbol">
  <h3 id="${type.name}">${type.name}</h3>
  <pre class="api-sig"><code>${escapeHtml(type.type)}</code></pre>
  ${type.description ? `<p>${inline(type.description)}</p>` : ""}
  ${paramsTable(type.properties)}
</article>`;

export const referencePage = () =>
  docPage({
    eyebrow: "Reference",
    title: "API Reference.",
    intro:
      "Generated from JSDoc in @nativefragments/core. Each symbol links back to the concept guide that explains it.",
    body: html`${raw(
      apiSections
        .map(
          (section) => `<section class="api-section">
            <p class="module">${section.module}</p>
            <h2>${section.title}</h2>
            ${section.types.map(renderType).join("")}
            ${section.symbols.map(renderSymbol).join("")}
          </section>`,
        )
        .join(""),
    )}`,
  });
