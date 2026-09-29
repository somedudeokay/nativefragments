import { html } from "@nativefragments/core/server";
import { renderLit } from "@nativefragments/lit/server";
import { html as lit } from "lit";
import "../../client/components/runtime-map.js";
import { codeBlock } from "../code.js";

const routeExample = `import { fragment, html, route } from "@nativefragments/core/server";

const activity = fragment("activity", {
  loading: () => html\`<p aria-live="polite">Loading activity…</p>\`,
  render: async ({ signal }) =>
    activityFeed(await loadActivity({ signal })),
});

export const dashboard = route("/dashboard", {
  meta: () => ({ title: "Dashboard" }),
  render: (context) => html\`
    <h1>Dashboard</h1>
    \${context.defer(activity)}
  \`,
  fragments: [activity],
});`;

const routerExample = `import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";

const lifetime = new AbortController();
const router = startRouter({
  prefetch: "intent",
  signal: lifetime.signal,
});

await router.navigate("/dashboard");
router.prefetch("/settings");
router.invalidate("/dashboard");`;

const litExample = `// app-card.js — ordinary Lit
import { LitElement, css, html } from "lit";

class AppCard extends LitElement {
  static styles = css\`:host { display: block }\`;
  render() { return html\`<slot></slot>\`; }
}
customElements.define("app-card", AppCard);

// Server route — Lit SSR stays behind one adapter
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";

export const card = () =>
  renderLit(html\`<app-card>Ready now.</app-card>\`);`;

const modes = [
  {
    label: "Direct visit",
    request: "GET /dashboard",
    response: "Complete document, streamed",
  },
  {
    label: "Link navigation",
    request: "GET /dashboard · x-fragment",
    response: "Only the target HTML, streamed",
  },
  {
    label: "JavaScript off",
    request: "Native anchor or form",
    response: "The same route still works",
  },
];

const principles = [
  {
    number: "01",
    title: "HTML is the interface",
    copy: "Routes return escaped HTML. The browser receives useful content before application JavaScript runs.",
  },
  {
    number: "02",
    title: "Navigation stays native",
    copy: "Real anchors and forms are the baseline. A small router upgrades them with history, prefetch, and streamed swaps.",
  },
  {
    number: "03",
    title: "Interactivity stays local",
    copy: "Use Lit and Web Components for the parts that own state. Server rendering and hydration live in a replaceable adapter.",
  },
  {
    number: "04",
    title: "Tooling serves the app",
    copy: "esbuild resolves modern ESM and creates deployable files. It is a fast implementation detail, not a compiler-shaped architecture.",
  },
];

const principle = ({ number, title, copy }) => html`<article class="home-principle">
  <span>${number}</span>
  <h3>${title}</h3>
  <p>${copy}</p>
</article>`;

export const homePage = async () => html`
  <section class="hero home-hero">
    <div class="hero-copy">
      <p class="eyebrow">HTML application framework</p>
      <h1>Fast applications.<br /><span class="accent">Explicit HTML.</span></h1>
      <p class="lede">
        Native Fragments is a small framework for Cloudflare Workers that
        streams server-rendered HTML, upgrades native navigation, and uses Lit
        for interactive islands. Modern tooling, very little ceremony.
      </p>
      <div class="hero-actions">
        <a class="primary-action" href="https://docs.nativefragments.org/getting-started">
          Build an app <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
        <a class="secondary-action" href="https://met-gallery.nativefragments.org" data-nativefragments-reload>
          Watch HTML stream
        </a>
        <a class="secondary-action" href="https://github.com/somedudeokay/nativefragments">
          Read the source
        </a>
      </div>
      <p class="home-stack" aria-label="Technology stack">
        <span>Cloudflare Workers</span><span>Lit</span><span>Web Components</span><span>Native APIs</span>
      </p>
    </div>
    ${await renderLit(lit`<nf-runtime-map></nf-runtime-map>`)}
  </section>

  <section class="home-proof" aria-label="Framework guarantees">
    <div><strong>HTML</strong><span>first response</span></div>
    <div><strong>Stream</strong><span>shell, then fragments</span></div>
    <div><strong>Native</strong><span>links and forms</span></div>
    <div><strong>Lit</strong><span>SSR + hydration adapter</span></div>
  </section>

  <section class="home-intro">
    <p class="eyebrow">The working model</p>
    <h2>One route. Three honest response modes.</h2>
    <p class="home-intro-lede">
      The server owns routing and the first render. The browser router asks for
      the same route as a fragment and swaps only its declared target. Without
      JavaScript, the anchor simply performs a document navigation.
    </p>
    <div class="response-modes">
      ${modes.map((mode) => html`<article>
        <p>${mode.label}</p>
        <code>${mode.request}</code>
        <strong>${mode.response}</strong>
      </article>`)}
    </div>
  </section>

  <section class="home-code-grid">
    <div class="home-code-copy">
      <p class="eyebrow">Server</p>
      <h2>Render the application you mean.</h2>
      <p>
        Route definitions keep path, metadata, actions, and HTML together.
        Deferred work starts immediately and fills its own boundary when ready.
        A slow dependency delays one region—not the whole document.
      </p>
      <ul>
        <li>Escaped interpolation by default</li>
        <li>Abort signals follow the request</li>
        <li>Error and loading boundaries are visible HTML</li>
      </ul>
    </div>
    ${codeBlock(routeExample, "js", "site/routes.js")}
  </section>

  <section class="home-stream">
    <div>
      <p class="eyebrow">Streaming navigation</p>
      <h2>The next page reveals itself as its HTML arrives.</h2>
      <p>
        Fragment navigation uses a framed HTML protocol. The first frame swaps
        the page immediately; later frames reveal deferred regions out of order.
        Old tabs that do not speak the protocol receive a safe buffered response.
      </p>
      <div class="stream-actions">
        <a class="stream-link" href="https://met-gallery.nativefragments.org" data-nativefragments-reload>
          Open the Met Gallery <span aria-hidden="true">→</span>
        </a>
        <a class="stream-link stream-link--quiet" href="https://docs.nativefragments.org/concepts/streaming">Read the protocol</a>
      </div>
    </div>
    <div class="stream-console" aria-label="Example fragment stream">
      <p><span>00 ms</span><b>shell</b><em>painted</em></p>
      <p><span>18 ms</span><b>page fragment</b><em>swapped</em></p>
      <p><span>112 ms</span><b>summary</b><em>revealed</em></p>
      <p><span>384 ms</span><b>artworks</b><em>revealed</em></p>
      <p data-state="error"><span>421 ms</span><b>provenance</b><em>error boundary</em></p>
    </div>
  </section>

  <section class="home-principles">
    <div class="home-principles-head">
      <p class="eyebrow">Design constraints</p>
      <h2>Small core. Deliberate layers.</h2>
      <p>
        Native Fragments does not compete with the platform. It defines the
        contracts the platform is missing for an HTML application, then gets out
        of the way.
      </p>
    </div>
    <div class="home-principles-grid">${principles.map(principle)}</div>
  </section>

  <section class="home-code-grid home-code-grid--reverse">
    <div class="home-code-copy">
      <p class="eyebrow">Browser</p>
      <h2>A router you can hold in your hand.</h2>
      <p>
        Starting navigation returns three explicit capabilities. Lifecycle is
        owned by an AbortSignal; cache invalidation is an application decision;
        semantic DOM events make integrations observable.
      </p>
    </div>
    ${codeBlock(routerExample, "js", "client/index.js")}
  </section>

  <section class="home-code-grid">
    <div class="home-code-copy">
      <p class="eyebrow">Interactive islands</p>
      <h2>Use Lit where state actually lives.</h2>
      <p>
        Components are normal Lit elements. The adapter pins the evolving Lit
        SSR surface and emits hydratable Declarative Shadow DOM, keeping labs
        APIs out of application code.
      </p>
    </div>
    ${codeBlock(litExample, "js", "client/app-card.js")}
  </section>

  <section class="home-build-note">
    <p class="eyebrow">Build policy</p>
    <h2>No framework compiler. No build-step theatre.</h2>
    <p>
      Source stays standards-based ESM. A tiny esbuild step resolves packages,
      bundles browser modules, and lets Wrangler run the Worker. You can import
      from npm without turning the framework into a compiler or forcing every
      dependency to publish browser-ready bare-specifier graphs.
    </p>
    <code>npm run dev&nbsp;&nbsp;→&nbsp;&nbsp;esbuild + wrangler dev --live-reload</code>
  </section>

  <section class="cta-section home-cta">
    <p class="eyebrow">Start with the whole stack</p>
    <h2>From empty directory to streamed HTML.</h2>
    <p class="cta-install"><code>npm create @nativefragments/app@latest my-app</code></p>
    <div class="hero-actions">
      <a class="primary-action" href="https://docs.nativefragments.org/getting-started">
        Get started <span class="cta-arrow" aria-hidden="true">→</span>
      </a>
      <a class="secondary-action" href="/examples">Explore examples</a>
    </div>
  </section>
`;
