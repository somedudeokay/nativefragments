# Native Fragments API Reference

Native Fragments Core is split into server helpers, a Cloudflare adapter, and
browser-loadable helpers.

## `@nativefragments/core/server`

### `html(strings, ...values)`

Escaped HTML template tag. Interpolated values are escaped by default.

```js
import { html } from "@nativefragments/core/server";

const view = (name) => html`<h1>Hello ${name}</h1>`;
```

### `raw(value)`

Marks a value as trusted HTML. Use only for framework-generated or already
validated markup.

```js
import { html, raw } from "@nativefragments/core/server";

html`<main>${raw(pageBody)}</main>`;
```

### `attrs(attributes)`

Builds escaped HTML attributes from an object. `false`, `null`, and `undefined`
values are skipped. `true` renders a boolean attribute.

```js
import { attrs, html } from "@nativefragments/core/server";

html`<button${attrs({ disabled: true, "data-id": "save" })}>Save</button>`;
```

### `declarativeShadow(options)`

Renders a native declarative Shadow DOM template for server-rendered custom
elements. Put it as the first child of a custom element to avoid a flash of
unstyled light DOM while the browser module loads.

```js
import { declarativeShadow, html } from "@nativefragments/core/server";

const styles = `
  :host { display: inline-block; }
  button { border: 1px solid currentColor; }
`;

html`<app-counter>${declarativeShadow({
  styles: [styles],
  html: html`<button type="button">Count 0</button>`
})}</app-counter>`;
```

### `jsonScript(value)`

Serializes JSON for safe embedding in an inline script payload.

### `fragment(name, render)`

Creates a named fragment definition for nested route regions.

```js
import { fragment, html, route } from "@nativefragments/core/server";

const profile = fragment("settings-panel", () => html`<p>Profile</p>`);

export const settingsRoute = route("/settings/profile", {
  render: () => html`<main>
    <a href="/settings/profile"${profile.prefetchAttrs("intent")}>
      Profile
    </a>
    <section${profile.attrs()}>
      ${profile.render()}
    </section>
  </main>`,
  fragments: [profile]
});
```

`fragment.attrs()` returns `data-fragment-slot`. `fragment.prefetchAttrs()`
returns both `data-fragment-slot` and `data-fragment-prefetch`.

### `route(path, definition)`

Creates a route definition. A route usually provides `meta` and `render`
functions. A route can also expose named `fragments` for nested navigation.
`fragments` can be an object map or an array created with `fragment()`. Use
`:name` path segments to capture params into `context.params`.

```js
import { html, route } from "@nativefragments/core/server";

export const homeRoute = route("/", {
  meta: () => ({
    title: "Home",
    description: "Home page",
    canonical: "https://example.com/"
  }),
  render: () => html`<h1>Home</h1>`
});
```

```js
export const postRoute = route("/posts/:slug", {
  meta: ({ params }) => ({
    title: params.slug,
    description: `Post ${params.slug}`,
    canonical: `https://example.com/posts/${params.slug}`
  }),
  render: ({ params }) => html`<h1>${params.slug}</h1>`
});
```

Nested fragments let a route render a full page for normal requests and a
smaller region for links that target a named slot.

```js
export const settingsRoute = route("/settings/profile", {
  render: () => html`<main>
    <nav>
      <a href="/settings/profile" data-fragment-slot="settings-panel">
        Profile
      </a>
    </nav>
    <section data-fragment-slot="settings-panel">
      ${profilePanel()}
    </section>
  </main>`,
  fragments: {
    "settings-panel": profilePanel
  }
});
```

### `createRoutes(routes)`

Creates a normalized route manifest with a `match(pathname)` method. Exact
static routes match first; parameterized routes such as `/posts/:slug` match in
declaration order.

### `renderRoute({ match, request, slot })`

Renders a matched route and returns `{ body, meta }`. When `slot` matches a key
in `match.fragments`, only that named fragment renderer is used.

### `renderFragment({ body, meta })`

Combines route body HTML with fragment metadata for client-side fragment
navigation.

### `notFoundRoute`

Default 404 route used by adapters unless an app provides its own.

## `@nativefragments/core/cloudflare`

### `createCloudflareHandler(options)`

Creates a Cloudflare Worker module with a `fetch` handler.

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./routes.js";
import { shell } from "./shell.js";

export default createCloudflareHandler({
  routes,
  shell
});
```

Options:

- `routes`: Array of route definitions.
- `shell`: Function receiving `{ body, meta }` and returning a full document.
- `api`: Optional Web Standards router with a `fetch(request, env, context)`
  method. Hono apps can be passed directly.
- `apiPrefix`: Optional path prefix delegated to `api`. Defaults to `/api`.
- `notFound`: Optional 404 route.
- `assetsBinding`: Optional Cloudflare assets binding name. Defaults to
  `ASSETS`.
- `fragmentManifest`: Optional Cloudflare `HTMLRewriter` manifest injection.
  Defaults to `true`.

Fragment requests use the `x-fragment: true` request header. Nested fragment
requests also send `x-fragment-slot`. Full document responses inject a
`data-fragment-manifest` JSON script on Cloudflare when `HTMLRewriter` is
available.

## `/nativefragments/router.js`

### `installFragmentNavigation(options)`

Installs same-origin link interception and fragment navigation in the browser.

```js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  afterNavigate({ meta, url }) {
    console.log(meta.title, url.pathname);
  }
});
```

Options:

- `slot`: CSS selector for the content slot. Defaults to `#content-slot`.
- `ttl`: Fragment cache TTL in milliseconds. Defaults to `30000`.
- `prefetch`: Default fragment prefetch mode. Defaults to `intent`. Use
  `none`, `intent`, `visible`, or `load`.
- `afterNavigate`: Callback after a successful fragment swap.

For nested fragments, put the same `data-fragment-slot` name on the link and
target container:

```html
<a href="/settings/profile" data-fragment-slot="settings-panel">Profile</a>
<section data-fragment-slot="settings-panel"></section>
```

The router fetches the route with `x-fragment-slot: settings-panel`, replaces
only that section, updates history, and keeps full-page navigation as the
fallback.

The links are real URLs. Path subroutes work the same way as query-string
routes when the server route exists:

```html
<a href="/settings/profile" data-fragment-slot="settings-panel">Profile</a>
<a href="/settings/billing" data-fragment-slot="settings-panel">Billing</a>
```

### `prefetchFragment(href, options)`

Prefetches a same-origin fragment into the shared fragment cache.

```js
import { prefetchFragment } from "/nativefragments/router.js";

await prefetchFragment("/settings/profile", {
  slot: "settings-panel"
});
```

Links can declare prefetch behavior:

```html
<a href="/reports" data-fragment-prefetch="intent">Reports</a>
<a href="/dashboard" data-fragment-prefetch="visible">Dashboard</a>
<a href="/settings" data-fragment-prefetch="load">Settings</a>
<a href="/logout" data-fragment-prefetch="none">Log out</a>
```

## `/nativefragments/component.js`

### `sheet(cssText)`

Creates a constructable stylesheet from CSS text.

### `shadow(element, options)`

Attaches or reuses an open Shadow Root, applies constructable stylesheets, and
sets the shadow HTML. If the element already has a server-rendered declarative
shadow root, the first call preserves it by default so the component hydrates
without a refresh flash. Later calls update the HTML normally.

```js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host { display: block; }
`);

class AppCard extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: `<article><slot></slot></article>`
    });
  }
}

customElements.define("app-card", AppCard);
```

## `/nativefragments/worker.js`

### `createWorkerClient(workerOrUrl, options)`

Creates a module worker from a URL, or wraps an existing `Worker`, and returns a
small RPC client.

```js
import { createWorkerClient } from "/nativefragments/worker.js";

const worker = createWorkerClient("/app/search-worker.js", {
  timeout: 10000
});

const results = await worker.call("search", {
  rows,
  query: "native"
});
```

Options:

- `timeout`: Call timeout in milliseconds. Defaults to `30000`.
- `workerOptions`: Options passed to the `Worker` constructor when a URL is
  provided. Defaults to `{ type: "module" }`.

### `workerClient(worker, options)`

Wraps an existing dedicated worker. Use this when the app owns worker creation.

### `exposeWorker(handlers, scope)`

Registers named handlers inside a dedicated worker.

```js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  search: ({ rows, query }) =>
    rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase()))
});
```

### `transferResult(payload, transfer)`

Returns a worker response with Transferable objects so large buffers can move
without copying.

```js
import { exposeWorker, transferResult } from "/nativefragments/worker.js";

exposeWorker({
  bytes: (buffer) => transferResult(buffer, [buffer])
});
```
