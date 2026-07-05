---
name: nativefragments
description: Build and edit Native Fragments apps with zero dependencies, zero build, Cloudflare Workers, fragment navigation, API routes, forms, and Shadow DOM components.
---

# Native Fragments Skill

Use this skill when creating or editing a Native Fragments app.

## Goals

- Keep apps zero dependency and zero build unless the product explicitly earns
  an exception.
- Use native Fetch, Request, Response, URL, URLSearchParams, FormData, Custom
  Elements, Shadow DOM, and History APIs.
- Render real HTML on the server; enhance same-origin navigation with fragments.
- Keep files obvious for agents: one route, one renderer, one API resource, one
  component module.
- Server-render initially visible custom elements with `declarativeShadow()`
  and hydrate with `shadow()` on the client.

## Default Structure

- `worker.js`: Cloudflare Worker entrypoint.
- `site/routes.js`: explicit page route manifest.
- `site/api.js`: exports `createApi([...])`.
- `site/api/*.js`: optional resource route arrays for larger APIs.
- `site/model.js`: pure URL/query/form parsing and domain helpers.
- `site/pages/*.js`: route renderers.
- `site/shell.js`: full document shell.
- `public/nativefragments/*.js`: browser-loadable framework helpers.
- `public/app/*.js`: app browser modules and custom elements.

## HTML Safety

`html` returns a trusted wrapper. Nested templates and arrays compose directly:

```js
const row = (item) => html`<li>${item.label}</li>`;
html`<ul>${items.map(row)}</ul>`;
```

Never wrap a variable in `raw()` unless the value is framework-authored static
markup. If you find yourself wrapping `html` output in `raw()`, the code is
wrong.

Correct `raw()` uses are external trusted strings: inline SVG constants,
`jsonScript()` text, CSS text inside `<style>`, and syntax-highlighted HTML.

## Route Pattern

```js
import { html, route } from "@nativefragments/core/server";

route("/docs/:rest*", {
  meta: ({ params }) => ({
    title: params.rest || "Docs",
    description: "Documentation",
    canonical: "https://example.com/docs"
  }),
  render: ({ params, query }) => html`<h1>${params.rest || query.get("q")}</h1>`
});
```

Exact static routes match first. Parameterized routes match in declaration
order. A catch-all `:rest*` segment must be final.

Use route `status` and `headers` for rendered HTML responses:

```js
route("/gone", {
  status: 410,
  headers: () => ({ "Cache-Control": "public, max-age=60" }),
  render: () => html`<h1>Gone</h1>`
});
```

Use `redirect(location, status)` or return/throw a native `Response` when a
route owns the entire response.

## Nested Fragment Pattern

Use `fragment()` when a route contains a sub-region with its own links.

```js
import { fragment, html, route } from "@nativefragments/core/server";

const panel = fragment("settings-panel", settingsPanel);

route("/settings/:panel", {
  render: (context) => html`<main>
    <nav>
      <a href="/settings/profile"${panel.prefetchAttrs("intent")}>Profile</a>
    </nav>
    <section${panel.attrs()}>${settingsPanel(context)}</section>
  </main>`,
  fragments: [panel]
});
```

The link slot name, target slot name, and route fragment name must match. The
full `render` output remains the no-JavaScript fallback.

## API Routes

Use `apiRoute()` and `createApi()` instead of hand-rolled pathname chains.

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

For complex APIs, each `site/api/<resource>.js` exports an array of
`apiRoute()` entries:

```js
// site/api/todos.js
export const todoRoutes = [
  apiRoute("GET", "/api/todos", listTodosHandler),
  apiRoute("POST", "/api/todos", createTodoHandler),
];

// site/api.js
export const api = createApi([...todoRoutes]);
```

Handler context is `{ request, env, context, url, params, query, signal }`.
Return a `Response` for full control; return any other value for `Response.json`.

## Query Params

Parse query state in pure model helpers, not inline in renderers.

```js
import { readSearch } from "@nativefragments/core/server";

export const filtersFromSearch = (query) =>
  readSearch(query, { filter: "all", sort: "newest" });
```

Renderers call the model helper:

```js
route("/todos", {
  render: ({ query }) => todoPage(filtersFromSearch(query))
});
```

## Mutations

Use route `action()` for no-JavaScript POST-redirect-GET forms.

```js
import { html, redirect, route } from "@nativefragments/core/server";

route("/todos", {
  action: async ({ request }) => {
    const form = await request.formData();
    await createTodo(form.get("title"));
    return redirect("/todos", 303);
  },
  render: () => html`<form method="post"><input name="title" /></form>`
});
```

POST forms are never fragment-intercepted. They submit to the server, run
`action()`, and return through a redirect.

After any request that mutates server state, call `clearFragmentCache()` before
navigating.

```js
import { clearFragmentCache } from "/nativefragments/router.js";

await fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) });
clearFragmentCache();
```

Use `data-fragment-form` only for GET forms whose URL state should fragment
navigate:

```html
<form action="/search" method="get" data-fragment-form>
  <input name="q" />
</form>
```

## Prefetch Pattern

The router prefetches same-origin fragment links on hover/focus by default.
Links can override the mode:

```html
<a href="/reports" data-fragment-prefetch="visible">Reports</a>
<a href="/settings" data-fragment-prefetch="load">Settings</a>
<a href="/logout" data-fragment-prefetch="none">Log out</a>
```

Use `data-nativefragments-reload` or `data-fragment-navigation="false"` for
links that must use normal browser navigation.

## Component Pattern

For visible custom elements, share shadow CSS and HTML between server and
client modules.

```js
import { declarativeShadow, html } from "@nativefragments/core/server";

export const appCard = (content) => html`<app-card>${declarativeShadow({
  styles: [cardStyles],
  html: html`<article>${content}</article>`
})}</app-card>`;
```

The browser component hydrates with `shadow()`. Do not send an empty
above-the-fold custom element and fill it after module load.

## Worker Pattern

Use `/nativefragments/worker.js` for dedicated worker RPC.

```js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  filter: ({ rows, query }) =>
    rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
});
```

```js
import { createWorkerClient } from "/nativefragments/worker.js";

const worker = createWorkerClient("/app/filter-worker.js");
const rows = await worker.call("filter", { rows: allRows, query });
```

Call `dispose()` when the owner tears down the client. Workers created by
`createWorkerClient(url)` are terminated on dispose.

## Testing Guidance

Core uses `node --test` and `node --check`. App repos can add focused HTTP,
component, and browser checks for navigation, layout, and real DOM behavior.
