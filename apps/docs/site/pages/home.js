import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const homePage = () =>
  docPage({
    eyebrow: "Introduction",
    title: "Native Fragments",
    intro:
      "A zero-dependency, zero-build framework for server-rendered HTML with fragment navigation and Shadow DOM components, deployed to Cloudflare Workers — readable by humans and AI agents.",
    body: html`
      <h2>What you get</h2>
      <ul>
        <li><strong>Real HTML, real links</strong> — every route is a server-rendered <code>GET</code> URL.</li>
        <li><strong>No build step</strong> — ship ES modules and Custom Elements straight to the browser.</li>
        <li><strong>HTML streaming</strong> — defer slow fragments and stream them in as their data resolves, out of order.</li>
        <li><strong>Fragment navigation</strong> — swap a page region without reloading the document.</li>
        <li><strong>Scoped components</strong> — Shadow DOM with no global-CSS leakage.</li>
        <li><strong>Edge-native</strong> — pages, fragments, and API routes run on Cloudflare Workers.</li>
      </ul>

      <h2>A 30-second example</h2>
      <p>
        A route maps a URL to HTML; the Cloudflare adapter serves it. That is a
        complete app.
      </p>
      ${code(`// site/routes.js
import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", { render: () => html\`<h1>Hello</h1>\` }),
];

// site/shell.js
import { html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta }) => html\`<!doctype html>
<html lang="en">
  <head><title>\${meta.title}</title></head>
  <body><main id="content-slot">\${raw(body)}</main></body>
</html>\`;

// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });`)}
      <p>
        Uses <a href="/reference#route"><code>route</code></a>,
        <a href="/reference#html"><code>html</code></a>,
        <a href="/reference#raw"><code>raw</code></a>, and
        <a href="/reference#createCloudflareHandler"><code>createCloudflareHandler</code></a>.
        The shell wraps every route body; <code>#content-slot</code> is where
        fragment navigation swaps content later.
      </p>

      <h2>How it fits together</h2>
      <p>
        The server renders HTML and streams it from the edge — slow data regions
        arrive as deferred fragments without blocking the page. Links swap
        fragments into a slot without a full reload. Interactive pieces are
        Custom Elements with Shadow DOM. Nothing in that chain needs a bundler
        or a client framework runtime, so the source an agent writes is the
        code the browser runs.
      </p>

      <h2>See also</h2>
      <ul>
        <li><a href="/getting-started">Getting Started</a> — scaffold and run an app.</li>
        <li><a href="/concepts/routing">Routing</a> — define routes and metadata.</li>
        <li><a href="/concepts/streaming">Streaming</a> — defer slow fragments, stream them out of order.</li>
        <li><a href="/concepts/agent-friendly">Agent-Friendly Apps</a> — why the output is easy for agents.</li>
      </ul>
    `,
  });
