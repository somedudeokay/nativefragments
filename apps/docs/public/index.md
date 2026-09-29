# Fast applications. Explicit HTML.

Native Fragments is a small HTML application framework for Cloudflare Workers. Routes stream server-rendered HTML, the browser router upgrades native links and forms, and Lit powers interactive islands.

## The architecture

- **Core** — escaped HTML, route manifests, actions, fragments, streaming, and the browser router.
- **Lit adapter** — server-renders Lit elements and installs Lit hydration support in the browser.
- **Build** — esbuild resolves package imports and bundles two standards-based ESM entry points.
- **Runtime** — one Cloudflare Worker serves documents, fragments, API routes, and static assets.

> **Design rule:** HTML is the application interface. JavaScript upgrades navigation and local interaction; it does not reconstruct the page before users can read it.

## A minimal route

```js
// site/routes.js
import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", {
    meta: () => ({ title: "Home" }),
    render: () => html`<h1>Hello from the edge</h1>`,
  }),
];

// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });
```

## The browser entry

```js
// client/index.js
import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";

startRouter({ prefetch: "intent" });
```

The adapter import enables Lit hydration. `startRouter()` upgrades same-origin anchors and opted-in GET forms while preserving their native behavior when JavaScript is unavailable.

## What the build does

Native Fragments does not have a compiler. The scaffold uses esbuild to resolve bare package imports and create browser and Worker bundles, then Wrangler runs or deploys them. Application source remains ordinary ESM, Lit, Web Components, and Web APIs.

## Continue

- [Getting Started](/getting-started) — scaffold and run locally.
- [Fragments](/concepts/fragments) — streamed partial navigation.
- [Lit Components](/concepts/components) — SSR and hydration.
- [API Reference](/reference) — generated from current source.
