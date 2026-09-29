---
name: nativefragments
description: Build and edit fast, explicit HTML applications with Native Fragments, Lit, esbuild, and Cloudflare Workers.
---

# Native Fragments

Use Native Fragments for server-rendered HTML applications on Cloudflare
Workers. Preserve these constraints:

- HTML is useful in the first response.
- Routes, anchors, and forms remain the canonical application interface.
- Fragment navigation is progressive enhancement.
- Lit custom elements own local interaction.
- Keep Lit Labs imports behind `@nativefragments/lit`.
- Use the scaffold's esbuild step to resolve package ESM; do not introduce a
  framework compiler.
- Never deploy unless the user explicitly asks.

## Project shape

```txt
worker.js
site/routes.js
site/shell.js
site/pages/
client/index.js
client/components/
public/app/
scripts/build-app.mjs
wrangler.jsonc
```

Generated files belong in `.nativefragments/` and `public/build/` and remain
ignored.

## Server route

```js
import { fragment, html, route } from "@nativefragments/core/server";

const details = fragment("details", {
  loading: () => html`<p aria-live="polite">Loading…</p>`,
  error: () => html`<p role="status">Unavailable.</p>`,
  render: async ({ signal }) => detailsView(await loadDetails({ signal })),
});

export const page = route("/items/:id", {
  meta: ({ params }) => ({ title: `Item ${params.id}` }),
  render: (context) => html`
    <h1>Item ${context.params.id}</h1>
    ${context.defer(details)}
  `,
  fragments: [details],
});
```

Interpolation through `html` is escaped. Use `raw()` only for trusted,
validated markup.

Route `headers` override defaults except `Vary`, whose fields are combined with
the framework's document, fragment-slot, and protocol selectors. Add application
selectors such as `Accept-Language` there; `Vary: *` is also supported.

## Shell and Worker

The shell must interpolate `body` unmodified into `#content-slot`. It may be
async. The Cloudflare adapter wraps the route manifest:

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
export default createCloudflareHandler({ routes, shell, api });
```

## Browser entry

```js
import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";
import "./components/app-card.js";

const lifetime = new AbortController();
export const router = startRouter({
  prefetch: "intent",
  signal: lifetime.signal,
});
```

Use returned capabilities rather than globals:

```js
await router.navigate("/reports");
await router.prefetch("/settings");
router.invalidate("/reports");
```

Invalidate affected URLs after client-side mutations. Pending requests cannot
repopulate an invalidated cache entry. Cached HTML is shared across anchors,
but each navigation keeps its own hash. Already-aborted navigation and prefetch
signals reject before cached content is applied.

Listen for semantic DOM events when another component needs navigation state:

```js
document.addEventListener("nativefragments:navigation-complete", handler);
```

## Named fragments

Reuse a `fragment()` definition's attributes in both links and targets:

```js
html`<a href="/settings/profile"${panel.prefetchAttrs("intent")}>Profile</a>
<section${panel.attrs()}>${renderPanel()}</section>`;
```

Different named targets can navigate concurrently. A later request supersedes
an earlier request to the same target.

## Lit components

Application components import from `lit`:

```js
import { LitElement, css, html } from "lit";

class AppCard extends LitElement {
  static styles = css`:host { display: block }`;
  render() { return html`<slot></slot>`; }
}
customElements.define("app-card", AppCard);
```

Server-render through the adapter:

```js
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-card.js";

export const card = () => renderLit(html`<app-card>Ready</app-card>`);
```

## Forms and state

- Opt GET forms into fragment navigation with `data-fragment-form`.
- Keep POST forms native and handle them with a route `action()` followed by a
  303 redirect.
- After a client mutation, call `router.invalidate()` for affected HTML.
- Local component state belongs in Lit. Durable state belongs in the URL,
  browser storage, Worker bindings, or a database.

## Web Workers

Use package exports:

```js
import { exposeWorker } from "@nativefragments/core/client/worker.js";
import { createWorkerClient } from "@nativefragments/core/client/worker.js";
```

Bundle dedicated browser workers to `public/build/`.

## Verification

Run the app's `npm run check` and tests. For navigation changes, verify in a
real browser that:

- direct refresh contains server HTML;
- a link click sends protocol version 2;
- the first streamed frame swaps immediately;
- deferred regions reveal independently;
- back/forward, focus, scroll, title, and canonical metadata work;
- no JavaScript console errors or failed requests appear.

## Request state and release guarantees

Use adapter `prepare({request, env, context})` to return request-local state.
Pages, actions, deferred fragments and array-based APIs receive `locals`, `env`,
`context` and `signal`. Never put user state in module globals. Use private,
no-store for authenticated responses and invalidate fragments after mutations.

Protocol 2 follows redirect envelopes in the browser so Set-Cookie applies before
the next render. Rebuild server and client together. Bound completed caches using
cacheTtl, cacheMaxEntries and cacheMaxBytes. See ../../docs/migration-0.8.md for
precise behavior and safe HTML/URL/JSON examples.

Generated build URLs use revalidation, not immutable caching. Build apps through
@nativefragments/create-app/build; declare browser worker entries explicitly in
package.json.nativefragments.workers. Import @nativefragments/lit/client before
registering Lit elements. Strict CSP must allow the response nonce in style-src
as well as script-src for no-JavaScript streaming fallbacks.

Before release run npm run verify from the framework root: Node/workerd tests,
strict consumer types, three browser engines and clean packed scaffold installs.
