import { html } from "../../src/server/index.js";

const smokeExample = `curl -f http://127.0.0.1:8787/
curl -f http://127.0.0.1:8787/docs \\
  -H "x-fragment: true"`;

const wtrExample = `npm i -D @web/test-runner @open-wc/testing

wtr test/**/*.test.js --node-resolve`;

const shadowTestExample = `import { expect, fixture, html } from "@open-wc/testing";
import "../public/app/components/app-counter.js";

const el = await fixture(html\`<app-counter></app-counter>\`);
el.shadowRoot.querySelector("button").click();
expect(el.count).to.equal(1);`;

const esbuildExample = `# only if you need TypeScript or npm browser deps
npx esbuild public/app/client.js \\
  --bundle --format=esm --outfile=public/app.bundle.js`;

export const examplesPage = () => html`<section class="page-hero compact">
  <p class="eyebrow">Examples</p>
  <h1>Copy the boring parts.</h1>
  <p>
    The framework does not ship a test stack. If you want tests, add the
    smallest thing that proves the behavior you care about.
  </p>
</section>

<section class="docs-grid">
  <article>
    <h2>HTTP smoke</h2>
    <pre><code>${smokeExample}</code></pre>
  </article>

  <article>
    <h2>Web Test Runner component test</h2>
    <pre><code>${wtrExample}</code></pre>
  </article>

  <article>
    <h2>Shadow DOM assertion</h2>
    <pre><code>${shadowTestExample}</code></pre>
  </article>

  <article>
    <h2>Build escape hatch</h2>
    <pre><code>${esbuildExample}</code></pre>
  </article>
</section>`;
