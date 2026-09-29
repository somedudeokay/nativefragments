# Native Fragments Core

Native Fragments is a small framework for fast, explicit HTML applications on
Cloudflare Workers. Core provides server HTML, routing, fragments, streaming,
actions, API routes, browser navigation, and Web Worker RPC.

- Website: https://nativefragments.org
- Docs: https://docs.nativefragments.org

Create an application:

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

Or install core into an existing Worker:

```sh
npm i @nativefragments/core
```

## Server

```js
import { fragment, html, redirect, route } from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";

const summary = fragment("summary", {
  loading: () => html`<p>Loading…</p>`,
  error: () => html`<p role="status">Unavailable.</p>`,
  render: async ({ signal }) => html`<p>${await loadSummary({ signal })}</p>`,
});

const routes = [
  route("/", {
    meta: () => ({ title: "Dashboard" }),
    render: (context) => html`
      <h1>Dashboard</h1>
      ${context.defer(summary)}
    `,
    fragments: [summary],
  }),
  route("/todos", {
    action: async ({ request }) => {
      await addTodo(await request.formData());
      return redirect("/todos", 303);
    },
    render: renderTodos,
  }),
];

export default createCloudflareHandler({ routes, shell });
```

`html` escapes interpolated values by default. Use `raw()` only for trusted
HTML that has already been validated.

Route `headers` override the HTML defaults, except `Vary`: its fields are
combined with the framework's document, slot, and protocol selectors. A route
can add `Vary: Accept-Language` without making cached fragments interchangeable
with full documents. `Vary: *` is preserved.

## Browser router

```js
import { startRouter } from "@nativefragments/core/client/router.js";

const lifetime = new AbortController();
const router = startRouter({
  prefetch: "intent",
  signal: lifetime.signal,
});

await router.navigate("/reports");
await router.prefetch("/settings");
router.invalidate("/reports");
```

The router upgrades real anchors and opted-in GET forms. It preserves direct
navigation as the fallback, handles history and metadata, supports concurrent
named targets, and reveals streamed deferred fragments as frames arrive.

Router and server negotiate `X-NativeFragments-Protocol: 2`. Missing or unknown
versions receive completed buffered fragment HTML, keeping stale tabs safe.

Cached HTML is shared across URL anchors; each navigation keeps its own hash.
An already-aborted navigation or prefetch signal rejects with no frame delivery.
Invalidating a fragment prevents its pending request from repopulating the cache.

Lifecycle events bubble from the target:

```txt
navigation-start → navigation-swap → fragment-reveal* → navigation-complete
navigation-start → navigation-abort | navigation-error
```

Event names are prefixed with `nativefragments:`.

## Lit components

Lit integration is intentionally separate from core:

```sh
npm i @nativefragments/lit lit
```

```js
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-card.js";

export const card = () => renderLit(html`<app-card>Ready</app-card>`);
```

```js
// client/index.js
import "@nativefragments/lit/client";
import "./components/app-card.js";
```

The adapter pins Lit's evolving SSR packages and keeps that integration out of
core and application components.

## Web Workers

```js
// client/search-worker.js
import { exposeWorker } from "@nativefragments/core/client/worker.js";
exposeWorker({ search });
```

```js
import { createWorkerClient } from "@nativefragments/core/client/worker.js";
const worker = createWorkerClient("/build/search-worker.js");
const results = await worker.call("search", { query: "html" });
```

## Tooling policy

Native Fragments has no framework compiler. The scaffold uses esbuild to
resolve package imports and create browser and Worker bundles, then Wrangler
runs or deploys the Worker. Source remains standards-based ESM, Lit, Web
Components, and native Web APIs.

See [docs/api-reference.md](docs/api-reference.md) for generated API details.

## Navigation, authentication and streaming guarantees

See [the 0.8 migration guide](docs/migration-0.8.md) for request preparation,
bounded cache policy, cookie-preserving redirects, navigation ownership, streaming
lifetimes, no-JavaScript fallbacks, and the HTML trust boundary.
