import { html } from "../../src/server/index.js";

const routeExample = `route("/", {
  meta: () => ({
    title: "Home",
    description: "Native app",
    canonical: "https://example.com/"
  }),
  render: () => html\`<h1>Hello</h1>\`
})`;

const workerExample = `export default createCloudflareHandler({
  routes,
  shell
});`;

const browserExample = `import { installFragmentNavigation }
  from "/native-fragments/router.js";

installFragmentNavigation();`;

const componentExample = `class AppCounter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML =
      \`<style>button{...}</style><button>0</button>\`;
  }
}`;

export const docsPage = () => html`<section class="page-hero compact">
  <p class="eyebrow">Docs</p>
  <h1>Small contracts. Native behavior.</h1>
  <p>
    Native Fragments is intentionally thin. A route renders HTML. The shell wraps
    it. Fragment navigation swaps the content slot. Custom Elements own their
    Shadow DOM.
  </p>
</section>

<section class="docs-grid">
  <article>
    <h2>1. Route</h2>
    <pre><code>${routeExample}</code></pre>
  </article>

  <article>
    <h2>2. Worker</h2>
    <pre><code>${workerExample}</code></pre>
  </article>

  <article>
    <h2>3. Browser</h2>
    <pre><code>${browserExample}</code></pre>
  </article>

  <article>
    <h2>4. Component</h2>
    <pre><code>${componentExample}</code></pre>
  </article>
</section>

<section class="split">
  <div>
    <p class="eyebrow">CSS rule</p>
    <h2>Scope component CSS in Shadow DOM.</h2>
  </div>
  <p>
    Global CSS should be boring: document sizing, font loading, and page-level
    layout. Component styling belongs in each custom element. Shared tokens can
    be plain JS strings or constructable stylesheets.
  </p>
</section>`;
