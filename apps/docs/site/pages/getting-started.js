import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const gettingStartedPage = () =>
  docPage({
    eyebrow: "Start",
    title: "Getting Started",
    intro:
      "Create and run a Native Fragments app on Cloudflare Workers. The scaffold ships routes, a shell, browser helpers, and a Shadow DOM component.",
    body: html`
      <h2>Prerequisites</h2>
      <p>
        Node.js and npm to develop; a Cloudflare account to deploy. The app runs
        on Wrangler — run <code>npx wrangler login</code> before your first
        deploy if this machine is not authenticated yet.
      </p>

      <h2>Create</h2>
      ${code(`npm create @nativefragments/app@latest my-app
cd my-app
npm install
npm run dev`, "shell")}
      <p>
        <code>npm run dev</code> starts a local Worker and prints a URL —
        usually <code>http://localhost:8787</code>.
      </p>

      <h2>Project structure</h2>
      ${code(`worker.js                  # Cloudflare entrypoint — createCloudflareHandler
site/routes.js             # the route manifest
site/shell.js              # the full HTML document
site/pages/home.js         # one renderer per route
public/app/client.js       # installs fragment navigation
public/app/components/     # Custom Elements
public/nativefragments/    # browser helpers (router, component, worker)`, "shell")}
      <p>
        One route, one renderer, one component file — the layout stays obvious.
      </p>

      <h2>Make your first change</h2>
      <p>
        Open <code>site/pages/home.js</code>, change the heading, and reload.
        There is no bundler in the loop — the file you edited is the file the
        Worker runs, so the change is live as fast as Wrangler restarts.
      </p>
      ${code(`// site/pages/home.js
render: () => html\`<h1>My first fragment</h1>\`,`)}

      <h2>Deploy</h2>
      <p>
        The Worker renders pages, fragments, and API routes at the edge.
      </p>
      ${code(`npm run deploy`, "shell")}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — structure your URLs.</li>
        <li><a href="/concepts/fragments">Fragments</a> — fast partial navigation.</li>
        <li><a href="/concepts/components">Components</a> — build UI with Shadow DOM.</li>
      </ul>
    `,
  });
