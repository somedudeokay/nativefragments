import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const homePage = () =>
  docPage({
    eyebrow: "Introduction",
    title: "Fast applications. Explicit HTML.",
    intro:
      "Native Fragments is a small HTML application framework for Cloudflare Workers. Routes stream server-rendered HTML, the browser router upgrades native links and forms, and Lit powers interactive islands.",
    body: html`
      <h2>The architecture</h2>
      <ul>
        <li><strong>Core</strong> — escaped HTML, route manifests, actions, fragments, streaming, and the browser router.</li>
        <li><strong>Lit adapter</strong> — server-renders Lit elements and installs Lit hydration support in the browser.</li>
        <li><strong>Build</strong> — esbuild resolves package imports and bundles two standards-based ESM entry points.</li>
        <li><strong>Runtime</strong> — one Cloudflare Worker serves documents, fragments, API routes, and static assets.</li>
      </ul>

      ${callout(
        "Design rule",
        "HTML is the application interface. JavaScript upgrades navigation and local interaction; it does not reconstruct the page before users can read it.",
      )}

      <h2>A minimal route</h2>
      ${code(`// site/routes.js
import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", {
    meta: () => ({ title: "Home" }),
    render: () => html\`<h1>Hello from the edge</h1>\`,
  }),
];

// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });`)}

      <h2>The browser entry</h2>
      ${code(`// client/index.js
import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";

startRouter({ prefetch: "intent" });`)}
      <p>
        The adapter import enables Lit hydration. <code>startRouter()</code>
        upgrades same-origin anchors and opted-in GET forms while preserving
        their native behavior when JavaScript is unavailable.
      </p>

      <h2>What the build does</h2>
      <p>
        Native Fragments does not have a compiler. The scaffold uses esbuild to
        resolve bare package imports and create browser and Worker bundles, then
        Wrangler runs or deploys them. Application source remains ordinary ESM,
        Lit, Web Components, and Web APIs.
      </p>

      <h2>Continue</h2>
      <ul>
        <li><a href="/getting-started">Getting Started</a> — scaffold and run locally.</li>
        <li><a href="/concepts/fragments">Fragments</a> — streamed partial navigation.</li>
        <li><a href="/concepts/components">Lit Components</a> — SSR and hydration.</li>
        <li><a href="/reference">API Reference</a> — generated from current source.</li>
      </ul>
    `,
  });
