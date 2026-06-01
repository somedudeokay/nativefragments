import { html, raw } from "../../src/server/index.js";
import { codeBlock } from "../code.js";

const claim = (label, text) => html`<li>
  <strong>${label}</strong>
  <span>${text}</span>
</li>`;

export const homePage = () => html`<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">Native Fragments</p>
    <h1>Zero build apps built by AI agents.</h1>
    <p class="lede">
      A frontend framework that stays close to the native Web Platform:
      server-rendered fragments, Custom Elements, Shadow DOM, browser ES modules,
      and Cloudflare Workers. The result is fast for users and easy for agents
      to inspect, click, scrape, and maintain.
    </p>
    <div class="hero-actions">
      <a class="primary-action" href="/docs">Read the model</a>
      <a class="secondary-action" href="/examples">Copy an example</a>
    </div>
  </div>
  <nf-runtime-map></nf-runtime-map>
</section>

<section class="claim-band">
  <ul>
    ${raw(
      [
        claim("Zero dependencies", "Runtime code you can read in minutes."),
        claim("Zero build", "Ship browser-native modules directly."),
        claim("Blazing fast", "HTML first, fragments next, islands only where needed."),
        claim("Built for agents", "Explicit files, boring contracts, tiny APIs."),
        claim("AI-friendly apps", "Readable HTML and native modules at runtime."),
        claim("Zero maintenance", "The browser is the compatibility layer."),
        claim("Free to deploy", "Cloudflare Workers first, no server bill required."),
        claim("Infinite scale", "Static assets and edge fragments by default."),
      ].join(""),
    )}
  </ul>
</section>

<section class="split">
  <div>
    <p class="eyebrow">The bet</p>
    <h2>The Web Platform is the framework.</h2>
  </div>
  <p>
    Native Fragments adds just enough convention for agents to build durable
    applications: route manifests, escaped HTML templates, fragment responses,
    metadata updates, and Shadow DOM component islands. Everything else is
    HTML, CSS, and JavaScript.
  </p>
</section>

<section class="code-panel">
  <div>
    <p class="eyebrow">No compile step</p>
    <h2>Dev is just Wrangler.</h2>
  </div>
  ${codeBlock(`npm run dev

# internally:
npx wrangler dev`, "shell")}
</section>`;
