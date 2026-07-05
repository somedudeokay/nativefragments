# Native Fragments Core

Zero dependencies. Zero build. Blazing fast. Built for agents. AI-friendly
applications. Zero maintenance.

Native Fragments Core is the runtime package for building fast, maintainable web
applications with native browser APIs: HTML, CSS, JavaScript, Custom Elements,
Shadow DOM, Fetch, History, and standard server-side `Response` objects.

- Website: https://nativefragments.org
- Docs: https://docs.nativefragments.org

For a new app, start with the scaffold:

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

Install the core package directly when you are wiring Native Fragments into an
existing app:

```sh
npm i @nativefragments/core
```

## What Core Provides

- Escaped server-side HTML templates that compose safely when nested.
- Explicit route helpers with path params, `:rest*` catch-alls, query access,
  route status/headers, redirects, and POST actions.
- First-class API route helpers.
- Full-page and fragment render helpers.
- Cloudflare Worker adapter.
- Browser fragment navigation with first-class prefetching.
- Nested fragment slots for routes inside routes.
- Web Worker RPC helpers for moving expensive client work off the main thread.
- Shadow DOM component helpers, including declarative Shadow DOM support to
  avoid refresh FOUC.
- Agent skill shipped with the package.

## Package Exports

```js
import {
  apiRoute,
  createApi,
  declarativeShadow,
  fragment,
  html,
  readSearch,
  redirect,
  route
} from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Browser helpers are plain ES modules that can be served from your app's
`public/nativefragments` directory:

```js
import { installFragmentNavigation } from "/nativefragments/router.js";
import { shadow, sheet } from "/nativefragments/component.js";
import { createWorkerClient } from "/nativefragments/worker.js";
```

`html` returns a trusted wrapper. Nested `html` values and arrays of `html`
values compose directly. Use `raw()` only for external trusted strings such as
inline SVG, CSS, highlighted code, or `jsonScript()` output.

## Nested Fragments

Routes can expose named fragment renderers for app regions that navigate inside
the current page:

```js
const profile = fragment("settings-panel", profilePanel);

route("/settings/profile", {
  render: settingsPage,
  fragments: [profile]
});
```

```html
<a href="/settings/profile" data-fragment-slot="settings-panel" data-fragment-prefetch="intent">
  Profile
</a>
<section data-fragment-slot="settings-panel"></section>
```

The browser router sends `x-fragment-slot: settings-panel`, swaps only that
section, and keeps the full route as the no-JavaScript fallback.

External links, static documents, modified clicks, and links marked with
`data-nativefragments-reload` or `data-fragment-navigation="false"` keep normal
browser navigation:

```html
<a href="/agents.txt" data-nativefragments-reload>Get started for agents</a>
```

Routes support path params:

```js
route("/settings/:panel", {
  render: ({ params }) => settingsPage(params.panel),
  fragments: [profile]
});
```

Routes also support a trailing catch-all segment:

```js
route("/docs/:rest*", {
  render: ({ params }) => html`<h1>${params.rest || "Docs"}</h1>`
});
```

Read query state from `context.query`, preferably through a model helper:

```js
const filtersFromSearch = (query) =>
  readSearch(query, { filter: "all", sort: "newest" });
```

Use `action()` for POST-redirect-GET forms:

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

## API Routes

`createApi()` returns the same `{ fetch }` shape the Cloudflare adapter accepts.
Handlers get native request objects plus route params and query params.

```js
import { apiRoute, createApi } from "@nativefragments/core/server";

export const api = createApi([
  apiRoute("GET", "/api/todos", ({ query }) => listTodos(query.get("filter"))),
  apiRoute("POST", "/api/todos", async ({ request }) =>
    Response.json(await createTodo(await request.json()), { status: 201 }),
  ),
]);
```

Pass the API router to the adapter:

```js
export default createCloudflareHandler({ api, routes, shell });
```

## Fragment Prefetch

The browser router prefetches same-origin fragments on hover and focus by
default. Links can override the behavior:

```html
<a href="/reports" data-fragment-prefetch="visible">Reports</a>
<a href="/settings" data-fragment-prefetch="load">Settings</a>
<a href="/logout" data-fragment-prefetch="none">Log out</a>
```

Prefetching is based on real anchors in the document. Agents and browsers can
inspect the same links; there is no separate framework manifest to understand.

After a request mutates server state, clear cached fragments before navigating:

```js
import { clearFragmentCache } from "/nativefragments/router.js";

await fetch("/api/todos", { method: "POST", body: JSON.stringify(todo) });
clearFragmentCache();
```

## Content Security Policy

The Cloudflare adapter creates a per-request `nonce` and passes it to the app
shell. Use it on inline scripts/styles when you enable a strict CSP:

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { attrs, html } from "@nativefragments/core/server";
import { routes } from "./routes.js";

export const shell = ({ body, meta, nonce }) => html`<!doctype html>
<html>
  <head>
    <script${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
  </head>
  <body>${body}</body>
</html>`;

export default createCloudflareHandler({
  routes,
  shell,
  contentSecurityPolicy: ({ nonce }) =>
    [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      `style-src 'self' 'nonce-${nonce}'`
    ].join("; ")
});
```

The default policy remains compatible: `frame-ancestors 'self'`. Strict
`script-src`/`style-src` is opt-in so existing apps do not break.

## Worker Helpers

Use workers for search, filtering, parsing, and other client work that can run
away from the main thread:

```js
// public/app/search-worker.js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  search: ({ rows, query }) =>
    rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
});
```

```js
// public/app/search.js
import { createWorkerClient } from "/nativefragments/worker.js";

const searchWorker = createWorkerClient("/app/search-worker.js");
const rows = await searchWorker.call("search", { rows: allRows, query: "oslo" });
```

## No-FOUC Components

For components visible on first paint, render a declarative shadow template on
the server and hydrate it with `shadow()` in the browser:

```js
html`<app-card>${declarativeShadow({
  styles: [`:host { display: block; }`],
  html: html`<article>Ready at first paint</article>`
})}</app-card>`;
```

The browser `shadow()` helper preserves that server-rendered shadow root on the
first upgrade, then updates normally on later renders.

Do not ship an empty above-the-fold custom element and fill it only after the
browser imports the component module. That is a layout-shift bug. For non-trivial
components, put the shadow HTML and CSS in a shared template module and import it
from both the server renderer and browser component.

## Agent Skill

Agents can read the shipped framework conventions from:

```sh
node_modules/@nativefragments/core/skills/nativefragments/SKILL.md
```

Use that file as the editing brief before changing a Native Fragments app.

## API Reference

See [docs/api-reference.md](docs/api-reference.md).

## Links

- Website: https://nativefragments.org
- Docs: https://docs.nativefragments.org
- GitHub: https://github.com/somedudeokay/nativefragments
- npm: https://www.npmjs.com/package/@nativefragments/core
