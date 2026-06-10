# Native Fragments

A zero-dependency, zero-build framework for server-rendered HTML with fragment navigation and Shadow DOM components, deployed to Cloudflare Workers — readable by humans and AI agents.

## What you get

- **Real HTML, real links** — every route is a server-rendered `GET` URL.
- **No build step** — ship ES modules and Custom Elements straight to the browser.
- **HTML streaming** — defer slow fragments and stream them in as their data resolves, out of order.
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

// site/shell.js
import { html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head><title>${meta.title}</title></head>
  <body><main id="content-slot">${raw(body)}</main></body>
</html>`;

// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell });
```

Uses [route](/reference#route), [html](/reference#html), [raw](/reference#raw), and [createCloudflareHandler](/reference#createCloudflareHandler). The shell wraps every route body; `#content-slot` is where fragment navigation swaps content later.

## How it fits together

The server renders HTML and streams it from the edge — slow data regions arrive as deferred fragments without blocking the page. Links swap fragments into a slot without a full reload. Interactive pieces are Custom Elements with Shadow DOM. Nothing in that chain needs a bundler or a client framework runtime, so the source an agent writes is the code the browser runs.

## See also

- [Getting Started](/getting-started) — scaffold and run an app.
- [Routing](/concepts/routing) — define routes and metadata.
- [Streaming](/concepts/streaming) — defer slow fragments, stream them out of order.
- [Agent-Friendly Apps](/concepts/agent-friendly) — why the output is easy for agents.
