# Native Fragments API Reference

Native Fragments Core is split into server helpers, a Cloudflare adapter, and
browser-loadable modules.

## `@nativefragments/core/server`

### `html(strings, ...values)`

Escaped HTML template tag. It returns a trusted wrapper, so nested templates and
arrays of templates compose directly without `raw()`.

```js
import { html } from "@nativefragments/core/server";

const item = (label) => html`<li>${label}</li>`;
const list = (items) => html`<ul>${items.map(item)}</ul>`;
```

Plain strings are escaped. `null`, `undefined`, and `false` render empty; `0`
renders as `0`. Calling `String()` on an `html` result returns rendered markup.

### `raw(value)`

Marks external trusted HTML as safe. Use it for framework-authored static
markup strings such as inline SVG, highlighted code, JSON script text, or CSS
text. Do not wrap `html()` or `attrs()` output in `raw()`.

```js
import { html, jsonScript, raw } from "@nativefragments/core/server";

html`<script type="application/json">${raw(jsonScript(state))}</script>`;
```

### `attrs(attributes)`

Builds escaped HTML attributes from an object. `false`, `null`, and `undefined`
values are skipped. `true` renders a boolean attribute. Invalid attribute names
throw a `TypeError`.

```js
import { attrs, html } from "@nativefragments/core/server";

html`<button${attrs({ disabled: true, "data-id": "save" })}>Save</button>`;
```

### `jsonScript(value)`

Serializes JSON for safe inline script text. It escapes `<`, so a payload
containing `</script>` cannot terminate the tag.

### `declarativeShadow(options)`

Renders a declarative Shadow DOM template for initially visible custom
elements.

```js
import { declarativeShadow, html } from "@nativefragments/core/server";

html`<app-card>${declarativeShadow({
  styles: [`:host { display: block; }`],
  html: html`<article>Ready at first paint</article>`
})}</app-card>`;
```

### `route(path, definition)`

Creates a route definition. `:name` captures one path segment. A trailing
`:rest*` captures zero or more remaining segments and must be the final segment.
Exact static routes match before parameterized routes; parameterized routes
match in declaration order.

```js
import { html, route } from "@nativefragments/core/server";

route("/docs/:rest*", {
  meta: ({ params }) => ({ title: params.rest || "Docs" }),
  render: ({ params, query }) => html`<main>${params.rest}:${query.get("q")}</main>`
});
```

Route definitions support:

- `meta(context)`: returns document metadata or a native `Response`.
- `render(context)`: returns HTML or a native `Response`.
- `status`: status for rendered HTML, such as `410`.
- `headers`: object or function merged after default HTML headers.
- `action(context)`: POST handler that must return a native `Response`.
- `fragments`: nested fragment definitions.

```js
route("/private", {
  status: 401,
  headers: () => ({ "Cache-Control": "private, max-age=60" }),
  render: () => html`<h1>Sign in required</h1>`
});
```

### `redirect(location, status = 302)`

Creates a native redirect response.

```js
import { redirect, route } from "@nativefragments/core/server";

route("/old", {
  render: () => redirect("/new", 301)
});
```

### `action(context)`

Use route actions for POST-redirect-GET forms. Actions never render; they
return a `Response`, usually `redirect(url, 303)`.

```js
route("/todos", {
  action: async ({ request }) => {
    const form = await request.formData();
    await saveTodo(form.get("title"));
    return redirect("/todos", 303);
  },
  render: () => html`<form method="post"><input name="title" /></form>`
});
```

### `readSearch(searchParams, defaults)`

Reads string query parameters with defaults. Empty and missing values use the
default.

```js
import { readSearch } from "@nativefragments/core/server";

export const filtersFromSearch = (query) =>
  readSearch(query, { filter: "all", sort: "newest" });
```

### `fragment(name, definition)`

Creates a named nested fragment. Use the returned `attrs()` on the target and
`prefetchAttrs()` on links.

```js
const panel = fragment("settings-panel", settingsPanel);

route("/settings/:panel", {
  render: (context) => html`<main>
    <a href="/settings/profile"${panel.prefetchAttrs("intent")}>Profile</a>
    <section${panel.attrs()}>${settingsPanel(context)}</section>
  </main>`,
  fragments: [panel]
});
```

Fragments can define `loading`, `error`, and `timeout` for deferred document
streaming via `context.defer(fragment)`.

### `apiRoute(method, path, handler)` and `createApi(routes, options)`

Creates a Fetch-compatible API router. API paths use the same `:param` and
`:rest*` matcher as page routes. Handler context is `{ request, env, context,
url, params, query, signal }`. Returning a `Response` passes through; any other
value becomes `Response.json(value)`.

```js
import { apiRoute, createApi } from "@nativefragments/core/server";

export const api = createApi([
  apiRoute("GET", "/api/todos", ({ query }) => listTodos(query.get("filter"))),
  apiRoute("POST", "/api/todos", async ({ request }) =>
    Response.json(await createTodo(await request.json()), { status: 201 }),
  ),
  apiRoute("DELETE", "/api/todos/:id", ({ params }) => removeTodo(params.id)),
]);
```

No path match returns JSON `404`. Path match with unsupported method returns
`405` with `Allow`. `HEAD` falls back to `GET` when no `HEAD` handler exists.
Handler errors call `onError` and return JSON `500` without leaking messages.

### `createRoutes`, `renderRoute`, `renderFragment`

Adapters use these lower-level helpers. `createRoutes()` warns on duplicate
normalized paths and keeps the first route. `renderRoute()` returns either
rendered HTML data or `{ response }` when `meta` or `render` returns or throws a
native `Response`.

### `notFoundRoute` and `errorRoute`

Default routes for adapter-rendered 404 and 500 pages.

## `@nativefragments/core/cloudflare`

### `createCloudflareHandler(options)`

Creates a Cloudflare Worker module.

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { api } from "./site/api.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ api, routes, shell });
```

Options:

- `routes`: page route definitions.
- `shell({ body, meta, nonce })`: full document shell. `body` is already trusted
  HTML, so write `${body}`.
- `api`: Fetch-compatible `{ fetch }` object or an array of `apiRoute()` items.
- `apiPrefix`: API prefix, default `/api`.
- `notFound`: custom 404 route.
- `error`: custom 500 route.
- `onError({ error, request, phase })`: route/API error hook.
- `assetsBinding`: Cloudflare assets binding, default `ASSETS`.
- `deferredTimeout`: default deferred fragment timeout, default `15000`.
- `contentSecurityPolicy`: string, `false`, or nonce-aware function.

HTML responses include `Vary: x-fragment, x-fragment-slot`,
`Content-Type: text/html; charset=utf-8`, and `X-Content-Type-Options:
nosniff`. Route `headers` are merged after these defaults.

GET and HEAD render pages. POST runs the matched route `action`; without an
action it returns `405`. API-prefixed requests are delegated before page method
handling. Native `Response` values returned or thrown by route `meta`/`render`
pass through untouched.

## `/nativefragments/router.js`

### `installFragmentNavigation(options)`

Installs same-origin fragment navigation.

```js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({
  prefetch: "intent",
  viewTransitions: true,
  afterNavigate({ meta, url, slot }) {
    console.log(url.pathname, slot, meta?.title);
  }
});
```

Options:

- `slot`: default content slot, default `#content-slot`.
- `ttl`: fragment cache TTL, default `30000`.
- `prefetch`: `none`, `intent`, `visible`, `load`, or boolean.
- `viewTransitions`: use `document.startViewTransition()` when available,
  default `true`.
- `afterNavigate`: callback after a successful swap.

Hash links keep native behavior for same-route anchors. Cross-page hashes are
preserved in history and scrolled after the fragment swap. Back/forward restores
saved scroll positions. Fragment responses must be `text/html`; non-HTML
responses fall back to document navigation.

GET forms opt in with `data-fragment-form`:

```html
<form action="/search" method="get" data-fragment-form>
  <input name="q" />
</form>
```

POST forms are never intercepted. They go to route `action()` handlers and come
back through a redirect.

### `prefetchFragment(href, options)`

Prefetches same-origin fragment HTML into the shared cache.

```js
await prefetchFragment("/settings/profile", { slot: "settings-panel" });
```

### `clearFragmentCache(href?)`

Clears cached fragments. With no argument it clears all cached and in-flight
fragments. With `href` it clears every slot for that pathname and search.

```js
import { clearFragmentCache } from "/nativefragments/router.js";

await fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) });
clearFragmentCache();
```

### Window Globals

Module imports are preferred. The router also exposes globals for inline
handlers and console debugging:

- `window.nativeFragmentsNavigate(href, pushState?, slot?)`
- `window.nativeFragmentsPrefetch(href, slot?)`
- `window.nativeFragmentsClearFragmentCache(href?)`

## `/nativefragments/component.js`

### `sheet(cssText)` and `shadow(element, options)`

`sheet()` creates a constructable stylesheet. `shadow()` attaches or reuses an
open Shadow Root, preserves declarative Shadow DOM on first upgrade by default,
adopts stylesheets, and renders HTML.

## `/nativefragments/worker.js`

### `createWorkerClient`, `workerClient`, `exposeWorker`, `transferResult`

Use the worker RPC helpers for dedicated Worker calls. `createWorkerClient()`
terminates workers it constructs when disposed. Wrapped caller-provided workers
are not terminated. Worker error stacks are preserved.
