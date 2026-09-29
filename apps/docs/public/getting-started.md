# Getting Started

Create a Native Fragments application with streamed routes, package-based browser imports, Lit SSR, and a local Cloudflare Worker.

## Create and run

```shell
npm create @nativefragments/app@latest my-app
cd my-app
npm install
npm run dev
```

The dev command builds the Worker and browser entry, starts `wrangler dev --live-reload`, and watches `site/` and `client/`. It is the Cloudflare runtime locally—not a second framework server.

## Project structure

```shell
worker.js                     # Cloudflare entry
site/routes.js                # route manifest
site/shell.js                 # persistent document shell
site/pages/                   # server HTML renderers
client/index.js               # hydration + startRouter()
client/components/            # Lit elements
public/app/                   # CSS and static assets
scripts/build-app.mjs         # small esbuild step
wrangler.jsonc                # runtime, assets, build command
.nativefragments/worker.js    # generated, ignored
public/build/client.js        # generated, ignored
```

## Edit server HTML

```js
// site/pages/home.js
import { html } from "@nativefragments/core/server";

export const homePage = () => html`
  <section>
    <h1>My first HTML application</h1>
    <a href="/about">About</a>
  </section>
`;
```

## Add a Lit element

Define the element once in `client/components`, import it on the server, and pass a Lit template to `renderLit()`. The response contains hydratable Declarative Shadow DOM.

```js
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-counter.js";

export const counter = () =>
  renderLit(html`<app-counter count="0"></app-counter>`);
```

> **Why Lit Labs is isolated:** Lit SSR is mature in practice but still published under @lit-labs. Native Fragments pins that evolving surface inside @nativefragments/lit so applications only depend on renderLit() and the client hydration import.

## Build and deploy

```shell
npm run build
npm run deploy
```

Deployment is intentionally a separate command. Nothing in the development or verification workflow publishes your application.

## Next

- [Routing](/concepts/routing) — paths, metadata, and actions.
- [Streaming](/concepts/streaming) — reveal slow regions independently.
- [Fragments](/concepts/fragments) — browser navigation and named targets.
- [Components](/concepts/components) — Lit SSR and hydration.
