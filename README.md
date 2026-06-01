# Native Fragments Core

Zero dependencies. Zero build. Blazing fast. Built for agents. AI-friendly
applications. Zero maintenance.

Native Fragments Core is the runtime package for building fast, maintainable web
applications with native browser APIs: HTML, CSS, JavaScript, Custom Elements,
Shadow DOM, Fetch, History, and standard server-side `Response` objects.

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

- Escaped server-side HTML templates.
- Explicit route helpers with path params.
- Full-page and fragment render helpers.
- Cloudflare Worker adapter.
- Browser fragment navigation with first-class prefetching.
- Nested fragment slots for routes inside routes.
- Declarative fragment manifests on Cloudflare through `HTMLRewriter`.
- Web Worker RPC helpers for moving expensive client work off the main thread.
- Shadow DOM component helpers, including declarative Shadow DOM support to
  avoid refresh FOUC.
- Agent skill shipped with the package.

## Package Exports

```js
import { declarativeShadow, fragment, html, route } from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Browser helpers are plain ES modules that can be served from your app's
`public/nativefragments` directory:

```js
import { installFragmentNavigation } from "/nativefragments/router.js";
import { shadow, sheet } from "/nativefragments/component.js";
import { createWorkerClient } from "/nativefragments/worker.js";
```

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

Routes support path params:

```js
route("/settings/:panel", {
  render: ({ params }) => settingsPage(params.panel),
  fragments: [profile]
});
```

## Fragment Prefetch

The browser router prefetches same-origin fragments on hover and focus by
default. Links can override the behavior:

```html
<a href="/reports" data-fragment-prefetch="visible">Reports</a>
<a href="/settings" data-fragment-prefetch="load">Settings</a>
<a href="/logout" data-fragment-prefetch="none">Log out</a>
```

Cloudflare apps inject a tiny fragment manifest with `HTMLRewriter` when the
runtime supports it. The manifest is generated from `data-fragment-slot` and
`data-fragment-prefetch` markup and exposed as `window.nativeFragmentsManifest`.

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

## Agent Skill

Agents can read the shipped framework conventions from:

```sh
node_modules/@nativefragments/core/skills/nativefragments/SKILL.md
```

Use that file as the editing brief before changing a Native Fragments app.

## API Reference

See [docs/api-reference.md](docs/api-reference.md).

## Links

- Docs: https://nativefragments.org
- GitHub: https://github.com/somedudeokay/nativefragments
- npm: https://www.npmjs.com/package/@nativefragments/core
