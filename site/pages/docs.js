import { html } from "../../src/server/index.js";
import { codeBlock } from "../code.js";

const installExample = `npm i @nativefragments/nativefragments`;

const workerExample = `import { createCloudflareHandler } from "@nativefragments/nativefragments/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({
  routes,
  shell
});`;

const routeExample = `route("/", {
  meta: () => ({
    title: "Home",
    description: "Native app",
    canonical: "https://example.com/"
  }),
  render: () => html\`<h1>Hello</h1>\`
})`;

const browserExample = `import { installFragmentNavigation }
  from "/nativefragments/router.js";

installFragmentNavigation();`;

const componentExample = `class AppCounter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML =
      \`<style>button{...}</style><button>0</button>\`;
  }
}`;

const skillExample = `cat node_modules/@nativefragments/nativefragments/skills/nativefragments/SKILL.md`;

export const docsPage = () => html`<section class="page-hero compact">
  <p class="eyebrow">Docs</p>
  <h1>Small contracts. Native behavior.</h1>
  <p>
    Native Fragments is intentionally thin. Agents use it to build fast,
    maintainable, AI-friendly applications. A route renders HTML. The shell
    wraps it. Fragment navigation swaps the content slot. Custom Elements own
    their Shadow DOM.
  </p>
</section>

<section class="link-strip" aria-label="Project links">
  <a href="https://github.com/somedudeokay/nativefragments">GitHub repository</a>
  <a href="https://www.npmjs.com/package/@nativefragments/nativefragments">npm package</a>
  <a href="/demos">Demos <span>coming soon</span></a>
</section>

<section class="docs-grid">
  <article>
    <h2>1. Install</h2>
    ${codeBlock(installExample, "shell")}
  </article>

  <article>
    <h2>2. Worker</h2>
    ${codeBlock(workerExample)}
  </article>

  <article>
    <h2>3. Route</h2>
    ${codeBlock(routeExample)}
  </article>

  <article>
    <h2>4. Browser</h2>
    ${codeBlock(browserExample)}
  </article>

  <article>
    <h2>5. Component</h2>
    ${codeBlock(componentExample)}
  </article>

  <article>
    <h2>6. Agent skill</h2>
    ${codeBlock(skillExample, "shell")}
  </article>
</section>

<section class="split">
  <div>
    <p class="eyebrow">Agent skill</p>
    <h2>Ship conventions with the package.</h2>
  </div>
  <p>
    The npm package includes a skill file at
    <code>node_modules/@nativefragments/nativefragments/skills/nativefragments/SKILL.md</code>.
    An agent can read it before editing an app, so the routing, component, CSS,
    and testing conventions travel with the framework.
  </p>
</section>

<section class="split ai-friendly">
  <div>
    <p class="eyebrow">AI-friendly applications</p>
    <h2>Readable at runtime, not just in source.</h2>
  </div>
  <p>
    Apps built this way are easier for agents to browse too. They expose real
    links, real HTML, native custom elements, and browser modules instead of a
    heavy transpiled bundle. That makes pages easier to inspect, click, scrape,
    and reason about.
  </p>
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
