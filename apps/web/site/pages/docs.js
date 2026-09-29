import { html } from "@nativefragments/core/server";
import { codeBlock } from "../code.js";

const createExample = `npm create @nativefragments/app@latest my-app
cd my-app
npm run dev`;

const installExample = `npm i @nativefragments/core @nativefragments/lit lit`;

const workerExample = `import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./routes.js";
import { shell } from "./shell.js";

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

const browserExample = `import "@nativefragments/lit/client";
import { startRouter }
  from "@nativefragments/core/client/router.js";

const router = startRouter({ prefetch: "intent" });`;

const componentExample = `import { LitElement, html } from "lit";

class AppCounter extends LitElement {
  render() {
    return html\`<button @click=\${this.increment}>0</button>\`;
  }
}

customElements.define("app-counter", AppCounter);`;

const skillExample = `cat node_modules/@nativefragments/core/skills/nativefragments/SKILL.md`;

export const docsPage = () => html`<section class="page-hero compact">
  <p class="eyebrow">Docs</p>
  <h1>Small contracts. Native behavior.</h1>
  <p>
    Native Fragments is intentionally thin. Agents use it to build fast,
    maintainable, AI-friendly applications. A route renders HTML. The shell
    wraps it. Fragment navigation swaps the content slot. Lit elements own
    local interaction.
  </p>
</section>

<section class="link-strip" aria-label="Project links">
  <a href="https://github.com/somedudeokay/nativefragments">GitHub repository</a>
  <a href="https://www.npmjs.com/package/@nativefragments/core">npm package</a>
  <a href="/examples">Examples</a>
</section>

<section class="docs-grid">
  <article>
    <h2>1. Create app</h2>
    ${codeBlock(createExample, "shell")}
  </article>

  <article>
    <h2>2. Install core</h2>
    ${codeBlock(installExample, "shell")}
  </article>

  <article>
    <h2>3. Worker</h2>
    ${codeBlock(workerExample)}
  </article>

  <article>
    <h2>4. Route</h2>
    ${codeBlock(routeExample)}
  </article>

  <article>
    <h2>5. Browser</h2>
    ${codeBlock(browserExample)}
  </article>

  <article>
    <h2>6. Component</h2>
    ${codeBlock(componentExample)}
  </article>

  <article>
    <h2>7. Agent skill</h2>
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
    <code>node_modules/@nativefragments/core/skills/nativefragments/SKILL.md</code>.
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
    client-only application shell. That makes pages easier to inspect, click, scrape,
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
