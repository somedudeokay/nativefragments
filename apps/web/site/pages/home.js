import { declarativeShadow, html, raw } from "@nativefragments/core/server";
import {
  runtimeMapHtml,
  runtimeMapStyles,
} from "../../public/app/components/runtime-map-template.js";
import { codeBlock } from "../code.js";

const routeExample = `import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", {
    meta: () => ({
      title: "Dashboard",
      description: "A fast HTML-first dashboard.",
      canonical: "https://example.com/",
    }),
    render: () => html\`
      <h1>Revenue</h1>
      <metric-card value="$42k"></metric-card>
    \`,
  }),
];`;

const streamExample = `const stats = fragment("stats", {
  loading: () => html\`<p class="skeleton">Crunching…</p>\`,
  error: () => html\`<p role="status">Stats are unavailable.</p>\`,
  render: async (context) =>
    statsCard(await loadStats(context.url, { signal: context.signal })),
});

route("/", {
  render: (context) => html\`<section>
    <h1>Today</h1>
    \${context.defer(stats, { class: "stats-slot" })}
  </section>\`,
  fragments: [stats],
});`;

const fragmentExample = `import { fragment, html, route } from "@nativefragments/core/server";

const settingsPanel = fragment("settings-panel", renderSettingsPanel);

export const settingsRoute = route("/settings/profile", {
  render: () => html\`
    <a href="/settings/profile"\${settingsPanel.prefetchAttrs("intent")}>
      Profile
    </a>
    <section\${settingsPanel.attrs()}>
      \${renderSettingsPanel()}
    </section>
  \`,
  fragments: [settingsPanel],
});`;

const componentExample = `import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(\`
  button {
    border: 1px solid currentColor;
  }
\`);

class ThemeSwitch extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: \`<button type="button">Switch theme</button>\`,
    });
  }
}

customElements.define("theme-switch", ThemeSwitch);`;

const apiExample = `import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";

const api = new Hono();

api.get("/api/health", (context) => context.json({ ok: true }));

export default createCloudflareHandler({ api, routes, shell });`;

const stats = [
  { value: "0", caption: "runtime dependencies" },
  { value: "0", caption: "build steps" },
  { value: "3.6 kB", caption: "client router, gzipped" },
  { value: "67 ms", caption: "first byte, streamed live demo" },
];

const pillars = [
  {
    kicker: "Performance",
    tone: "green",
    title: "Streamed HTML, no hydration cliff.",
    copy: "Pages render at the edge and stream while slow data is still loading. The browser parses HTML as it arrives — there is no bundle to download, parse, and replay before the page works.",
    proof: "~6.3 kB gzipped: the entire browser runtime",
  },
  {
    kicker: "Low maintenance",
    tone: "yellow",
    title: "Nothing to update on Tuesday.",
    copy: "Zero dependencies means zero dependency bumps, zero audit warnings, and no bundler config slowly drifting out of date. An app you scaffold today still runs unchanged next year — there is no build to break.",
    proof: "npm ls → @nativefragments/core (and that's it)",
  },
  {
    kicker: "Native web APIs",
    tone: "blue",
    title: "Standards don't ship breaking changes.",
    copy: "Routes return HTML. Components are Custom Elements with Shadow DOM. Modules load as ES modules. Everything you learn is the platform itself, and view-source still tells the truth.",
    proof: "Custom Elements · Shadow DOM · ESM · fetch · streams",
  },
  {
    kicker: "Agents first",
    tone: "pink",
    title: "Made to be written — and read — by machines.",
    copy: "Small explicit files in, readable HTML out. Real anchors, server-rendered content, and route manifests an agent can follow without executing a bundle. The npm package ships its own agent skill and docs.",
    proof: "agents.txt · llms.txt · skills/ in the package",
  },
];

const pillarCard = ({ kicker, tone, title, copy, proof }) => html`<article
  class="pillar pillar--${tone}"
>
  <p class="pillar-kicker">${kicker}</p>
  <h3>${title}</h3>
  <p class="pillar-copy">${copy}</p>
  <p class="pillar-proof"><span aria-hidden="true">▸</span> ${proof}</p>
</article>`;

const streamRows = [
  { label: "Document shell", time: "0 ms", state: "ready", width: "4%" },
  { label: "Stats card", time: "+112 ms", state: "ready", width: "18%" },
  { label: "Artwork table", time: "+384 ms", state: "ready", width: "42%" },
  { label: "Provenance feed", time: "error → boundary", state: "error", width: "70%" },
];

const streamTimeline = () => html`<div class="stream-timeline" aria-hidden="true">
  <p class="stream-timeline-head">one connection · fastest first</p>
  ${raw(
    streamRows
      .map(
        (row) => html`<div class="stream-row" data-state="${row.state}">
          <span class="stream-label">${row.label}</span>
          <span class="stream-bar"><span style="width: ${row.width}"></span></span>
          <span class="stream-time">${row.time}</span>
        </div>`,
      )
      .join(""),
  )}
</div>`;

export const homePage = () => html`<section class="hero">
  <div class="hero-copy">
    <h1>The tiny web framework built for <span class="accent">coding agents</span>.</h1>
    <p class="lede">
      Native Fragments renders HTML at the edge and streams it to the browser —
      no bundler, no dependencies, no hydration step. Apps stay small, fast,
      and readable enough for an agent to maintain.
    </p>
    <div class="hero-actions">
      <a class="primary-action" href="/docs">Start building <span class="cta-arrow" aria-hidden="true">→</span></a>
      <a class="secondary-action agent-action" href="/agents.txt" data-nativefragments-reload>
        <span class="agent-glyph" aria-hidden="true">&gt;_</span> Get started for agents
      </a>
      <a class="secondary-action" href="https://docs.nativefragments.org/reference">API reference</a>
    </div>
  </div>
  <nf-runtime-map>
    ${declarativeShadow({
      styles: [runtimeMapStyles],
      html: runtimeMapHtml,
    })}
  </nf-runtime-map>
</section>

<section class="stats-strip" aria-label="Measured numbers">
  ${raw(
    stats
      .map(
        (stat) => html`<div class="stat">
          <strong>${stat.value}</strong>
          <span>${stat.caption}</span>
        </div>`,
      )
      .join(""),
  )}
</section>

<section class="statement">
  <p class="eyebrow">The bet</p>
  <h2 class="statement-text">
    The web platform is the framework. We just wired it together.
  </h2>
  <div class="statement-copy">
    <p>
      Most frontend stacks hide the thing agents need to reason about: the
      actual HTML, links, styles, and behavior. Native Fragments keeps those
      surfaces explicit, so generated apps are easy to read, debug, click,
      scrape, and extend.
    </p>
    <p>
      The framework adds only the small contracts an app needs — route
      manifests, escaped HTML templates, fragment responses, metadata updates,
      Shadow DOM helpers. Everything else is ordinary browser code that was
      already there.
    </p>
  </div>
</section>

<section class="pillars" aria-label="Why Native Fragments">
  ${raw(pillars.map(pillarCard).join(""))}
</section>

<section class="stream-slab">
  <div class="stream-slab-copy">
    <p class="eyebrow">New in 0.5 — HTML streaming</p>
    <h2>Slow data never blocks a fast page.</h2>
    <p>
      Defer a fragment and the document streams immediately: shell first,
      skeletons in place, then each fragment's real HTML arrives the moment its
      data resolves — out of order, on one connection. A two-second API call
      delays one region, not the page.
    </p>
    <p>
      Failures stream an error boundary instead of breaking the response, every
      fragment has a timeout, and the content arrives as crawlable HTML in the
      same response — not a client-side fetch.
    </p>
    ${raw(streamTimeline())}
    <div class="stream-actions">
      <a class="stream-link" href="https://met-gallery.nativefragments.org" data-nativefragments-reload>Watch it stream live <span aria-hidden="true">→</span></a>
      <a class="stream-link stream-link--quiet" href="https://docs.nativefragments.org/concepts/streaming">Streaming docs</a>
    </div>
  </div>
  <div class="stream-slab-code">
    ${codeBlock(streamExample, "js", "site/routes.js")}
  </div>
</section>

<section class="landing-section">
  <div>
    <p class="eyebrow">HTML first</p>
    <h2>Routes are files agents can understand.</h2>
  </div>
  <div class="section-copy">
    <p>
      A route is a path, metadata, and a render function. Normal requests return
      the full document. Fragment requests return only the page body and the
      metadata the browser needs to update the head. No loaders, no actions, no
      compiler conventions to memorize.
    </p>
    ${codeBlock(routeExample, "js", "site/routes.js")}
  </div>
</section>

<section class="landing-section landing-section--flip fragment-section">
  <div>
    <p class="eyebrow">Declarative fragments</p>
    <h2>Partial updates without hiding the page.</h2>
  </div>
  <div class="section-copy">
    <p>
      Mark the region that can update; the route exposes the same fragment on
      the server. The browser router upgrades real anchors and prefetches on
      intent, visibility, or load — links keep working with JavaScript off.
    </p>
    ${codeBlock(fragmentExample, "js", "site/settings.js")}
  </div>
</section>

<section class="landing-section">
  <div>
    <p class="eyebrow">Native islands</p>
    <h2>Interactive pieces are Custom Elements.</h2>
  </div>
  <div class="section-copy">
    <p>
      Components use Shadow DOM for scoped CSS but expose normal DOM that
      browsers, tests, and agents can inspect. When an island needs local
      state, optional signal bindings cover it — the first payload stays
      server-rendered HTML either way.
    </p>
    ${codeBlock(componentExample, "js", "public/app/components/theme-switch.js")}
  </div>
</section>

<section class="landing-section landing-section--flip install-section">
  <div>
    <p class="eyebrow">Edge native</p>
    <h2>One Worker renders pages, fragments, and the API.</h2>
  </div>
  <div class="section-copy">
    <p>
      Deploy as a Cloudflare Worker close to users. Mount Hono — or anything
      with a Web Standards <code>fetch</code> — under <code>/api/*</code> while
      the same Worker streams the pages. The free tier carries a real app.
    </p>
    ${codeBlock(apiExample, "js", "worker.js")}
  </div>
</section>

<section class="landing-section agent-section">
  <div>
    <p class="eyebrow">AI-friendly output</p>
    <h2>Better for agents to build. Better for agents to browse.</h2>
  </div>
  <div class="section-copy">
    <p>
      Native Fragments is not just a framework agents can use. It produces apps
      that are easier for agents to operate: real anchors, server-rendered
      content, small modules, readable source, and minimal framework magic.
    </p>
    <ul class="agent-list">
      <li>Route manifests expose the app map without executing a bundle.</li>
      <li>Fragment navigation keeps every link crawlable.</li>
      <li>Streamed content lands as real HTML in the response, not a client fetch.</li>
      <li>Shadow DOM keeps component styling local and inspectable.</li>
      <li><code>agents.txt</code>, <code>llms.txt</code>, and an agent skill ship with the package.</li>
    </ul>
  </div>
</section>

<section class="cta-section">
  <p class="eyebrow">Start small</p>
  <h2>Install the scaffold. Read every line before lunch.</h2>
  <p class="cta-install"><code>npm create @nativefragments/app@latest my-app</code></p>
  <div class="hero-actions">
    <a class="primary-action" href="/docs">Get started <span class="cta-arrow" aria-hidden="true">→</span></a>
    <a class="secondary-action" href="https://github.com/somedudeokay/nativefragments">View GitHub</a>
  </div>
</section>`;
