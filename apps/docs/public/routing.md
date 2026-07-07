# Routing

A route maps a URL path to a render function and optional metadata. Routes are plain objects, so humans and agents can read the whole map at a glance.

## Defining a route

[route](/reference#route) takes a path and a definition with a `render` function and an optional `meta` function.

```js
// site/pages/home.js
import { html, route } from "@nativefragments/core/server";

export const home = route("/", {
  meta: () => ({ title: "Home", description: "Welcome." }),
  render: () => html`<h1>Home</h1>`,
});
```

## Path parameters

Use `:name` segments. Matched values arrive on `ctx.params`.

```js
// site/pages/blog.js
export const post = route("/blog/:slug", {
  render: (ctx) => html`<h1>${ctx.params.slug}</h1>`,
});
```

## Catch-all segments

A trailing `:rest*` captures zero or more remaining segments as a single slash-joined string on `ctx.params.rest`. It must be the final segment — declaring it anywhere else throws at definition time.

```js
// /docs, /docs/guides, /docs/guides/routing all match
export const docs = route("/docs/:rest*", {
  render: (ctx) => html`<h1>${ctx.params.rest || "Docs home"}</h1>`,
});
```

## Query parameters

`ctx.query` is the request's [URLSearchParams](/reference#RouteContext). Read it directly, or use [readSearch](/reference#readSearch) to pull typed string values with defaults for missing or empty params.

```js
import { readSearch, route } from "@nativefragments/core/server";

export const list = route("/posts", {
  render: (ctx) => {
    const { filter, sort } = readSearch(ctx.query, {
      filter: "all",
      sort: "newest",
    });
    return html`<h1>${filter} · ${sort}</h1>`;
  },
});
```

## The route context

Every `render`, `meta`, and `action` receives a [RouteContext](/reference#RouteContext):

- `ctx.params` — captured path parameters, including `:rest*`.
- `ctx.query` — the request's `URLSearchParams`.
- `ctx.url` — the parsed `URL`.
- `ctx.request` — the original `Request`.
- `ctx.signal` — an `AbortSignal` that fires on cancellation or a deferred timeout; pass it to `fetch`.
- `ctx.defer(fragment)` — render a loading boundary now, [stream the fragment](/concepts/streaming) when its data resolves.

## Status and headers

Set `status` for a non-200 rendered page and `headers` for per-route response headers (an object or a function of the context). Route headers merge in after the adapter's defaults, so a route can set its own `Cache-Control`.

```js
export const gone = route("/legacy", {
  status: 410,
  headers: () => ({ "Cache-Control": "public, max-age=3600" }),
  render: () => html`<h1>This page is gone</h1>`,
});
```

A route can also return or throw a native `Response` from `meta` or `render`; the adapter passes it through untouched.

## Redirects

[redirect(location, status = 302)](/reference#redirect) builds a native redirect `Response`. Return it from `render` for a permanent move, or from an `action` for POST-redirect-GET.

```js
import { redirect, route } from "@nativefragments/core/server";

export const old = route("/old", {
  render: () => redirect("/new", 301),
});
```

## Mutations with actions

A route `action` handles `POST` for no-JavaScript forms. Actions never render — they must return a `Response`, usually a `303`[redirect](/reference#redirect) back to a `GET` URL. POST forms are never fragment-intercepted, so the browser follows the redirect normally.

```js
import { redirect, route } from "@nativefragments/core/server";

export const todos = route("/todos", {
  action: async ({ request }) => {
    const form = await request.formData();
    await saveTodo(form.get("title"));
    return redirect("/todos", 303);
  },
  render: () => html`<form method="post">
    <input name="title" />
    <button>Add</button>
  </form>`,
});
```

> **Note:** GET renders the page and POST runs the action. A POST to a route without an action returns 405 with an Allow header.

## Metadata

`meta` returns a [RouteMeta](/reference#RouteMeta) object — `title`, `description`, `canonical`, and `alternates`. The shell renders it into the document head, and fragment responses carry it so the browser can update the head on navigation.

## The route manifest

An app exports an array of routes. The Cloudflare adapter builds a manifest with [createRoutes](/reference#createRoutes); exact paths match first, then parameterized routes in declaration order.

```js
// site/routes.js
import { createRoutes } from "@nativefragments/core/server";

export const routes = [home, post];
// createCloudflareHandler calls createRoutes(routes) for you.
```

> **Note:** When no route matches, the adapter renders notFoundRoute with a 404 status. Override it with the notFound option on createCloudflareHandler.

## See also

- [Fragments](/concepts/fragments) — partial navigation within a route.
- [Streaming](/concepts/streaming) — defer slow regions with `ctx.defer()`.
- [API Routes](/concepts/api-routes) — JSON endpoints alongside pages.
- [Reference: route](/reference#route), [readSearch](/reference#readSearch), [redirect](/reference#redirect), [createRoutes](/reference#createRoutes).
