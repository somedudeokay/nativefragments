# Native Fragments

A zero-dependency, zero-build framework for server-rendered HTML with fragment navigation and Shadow DOM components, deployed to Cloudflare Workers — readable by humans and AI agents.

## What you get

- **Real HTML, real links** — every route is a server-rendered `GET` URL.
- **No build step** — ship ES modules and Custom Elements straight to the browser.
- **Fragment navigation** — swap a page region without reloading the document.
- **Scoped components** — Shadow DOM with no global-CSS leakage.
- **Edge-native** — pages, fragments, and API routes run on Cloudflare Workers.

## A 30-second example

A route maps a URL to HTML; the Cloudflare adapter serves it. That is a complete app.

```js
// site/routes.js
import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", { render: () => html`<h1>Hello</h1>` }),
];

// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });
```

Uses [route](/reference#route), [html](/reference#html), and [createCloudflareHandler](/reference#createCloudflareHandler).

## How it fits together

The server renders HTML. Links swap fragments into a slot without a full reload. Interactive pieces are Custom Elements with Shadow DOM. Nothing in that chain needs a bundler or a client framework runtime.

## See also

- [Getting Started](/getting-started) — scaffold and run an app.
- [Routing](/concepts/routing) — define routes and metadata.
- [Agent-Friendly Apps](/concepts/agent-friendly) — why the output is easy for agents.
