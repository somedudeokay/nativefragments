import { html, raw } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const homePage = () =>
  docPage({
    eyebrow: "Introduction",
    title: "Native Fragments keeps the web readable.",
    intro:
      "Build edge-first Cloudflare Worker apps with server-rendered HTML, fragment navigation, and native Shadow DOM components. No framework runtime dependency graph. No build step by default.",
    body: html`
      <section class="quick-grid">
        ${callout("For builders", "Use the scaffold to start an app in one command.")}
        ${callout("For agents", "Small files, explicit routes, and readable browser output.")}
        ${callout("For users", "HTML first, fast navigation, and resilient pages.")}
      </section>
      <h2>Start here</h2>
      ${code(
        `npm create @nativefragments/app@latest my-app
cd my-app
npm run dev`,
        "shell",
      )}
      <h2>What makes it different</h2>
      <p>
        Native Fragments treats the browser as the long-lived platform. The
        framework provides small contracts around routing, fragment responses,
        metadata, and Shadow DOM helpers. The application remains ordinary
        HTML, CSS, and JavaScript.
      </p>
      <p>
        The default deployment target is Cloudflare Workers, so pages,
        fragments, and API routes can run at the edge close to users.
      </p>
    `,
  });
