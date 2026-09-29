import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const gettingStartedPage = () =>
  docPage({
    eyebrow: "Start",
    title: "Getting Started",
    intro:
      "Create a Native Fragments application with streamed routes, package-based browser imports, Lit SSR, and a local Cloudflare Worker.",
    body: html`
      <h2>Create and run</h2>
      ${code(`npm create @nativefragments/app@latest my-app
cd my-app
npm install
npm run dev`, "shell")}
      <p>
        The dev command builds the Worker and browser entry, starts
        <code>wrangler dev --live-reload</code>, and watches <code>site/</code>
        and <code>client/</code>. It is the Cloudflare runtime locally—not a
        second framework server.
      </p>

      <h2>Project structure</h2>
      ${code(`worker.js                     # Cloudflare entry
site/routes.js                # route manifest
site/shell.js                 # persistent document shell
site/pages/                   # server HTML renderers
client/index.js               # hydration + startRouter()
client/components/            # Lit elements
public/app/                   # CSS and static assets
scripts/build-app.mjs         # small esbuild step
wrangler.jsonc                # runtime, assets, build command
.nativefragments/worker.js    # generated, ignored
public/build/client.js        # generated, ignored`, "shell")}

      <h2>Edit server HTML</h2>
      ${code(`// site/pages/home.js
import { html } from "@nativefragments/core/server";

export const homePage = () => html\`
  <section>
    <h1>My first HTML application</h1>
    <a href="/about">About</a>
  </section>
\`;`)}

      <h2>Add a Lit element</h2>
      <p>
        Define the element once in <code>client/components</code>, import it on
        the server, and pass a Lit template to <code>renderLit()</code>. The
        response contains hydratable Declarative Shadow DOM.
      </p>
      ${code(`import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-counter.js";

export const counter = () =>
  renderLit(html\`<app-counter count="0"></app-counter>\`);`)}

      ${callout(
        "Why Lit Labs is isolated",
        "Lit SSR is mature in practice but still published under @lit-labs. Native Fragments pins that evolving surface inside @nativefragments/lit so applications only depend on renderLit() and the client hydration import.",
      )}

      <h2>Build and deploy</h2>
      ${code(`npm run build
npm run deploy`, "shell")}
      <p>
        Deployment is intentionally a separate command. Nothing in the
        development or verification workflow publishes your application.
      </p>

      <h2>Next</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — paths, metadata, and actions.</li>
        <li><a href="/concepts/streaming">Streaming</a> — reveal slow regions independently.</li>
        <li><a href="/concepts/fragments">Fragments</a> — browser navigation and named targets.</li>
        <li><a href="/concepts/components">Components</a> — Lit SSR and hydration.</li>
      </ul>
    `,
  });
