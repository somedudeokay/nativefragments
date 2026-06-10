# Agent-Friendly Apps

Native Fragments apps are easy for AI agents to read and operate for the same reasons they are easy for people: real URLs, server-rendered HTML, and no client-only state.

An agent browsing your app sees what a browser sees on the first response — not a blank shell waiting for a bundle to boot. That falls out of the architecture, not a special mode.

## Why it works

- Every route is a real `GET` URL rendered by [route](/reference#route), so any page can be fetched directly.
- Content is in the initial HTML. There is no “wait for JavaScript” step before the text exists.
- Navigation uses real `<a href>` links. Fragment requests are an enhancement; the same route still returns a full page.
- [Streamed content](/concepts/streaming) arrives as real HTML in the same response — deferred regions are crawlable without executing scripts or making follow-up fetches.
- Components expose ordinary DOM that agents can inspect, even when styling lives in Shadow DOM.

## Patterns to keep

Return meaningful metadata from each route's [meta](/reference#RouteMeta) so titles, links, and descriptions are accurate.

```js
// site/pages/blog.js
import { html, route } from "@nativefragments/core/server";

export const post = route("/blog/:slug", {
  meta: (ctx) => ({
    title: ctx.params.slug,
    description: "A post on the Native Fragments blog.",
    canonical: `https://example.com/blog/${ctx.params.slug}`,
  }),
  render: (ctx) => html`<article><h1>${ctx.params.slug}</h1></article>`,
});
```

## Anti-patterns to avoid

- Content that only appears after a client fetch.
- State that exists only in memory, with no URL to reach it.
- Buttons that navigate via JavaScript instead of real links.

> **Note:** If a region updates via a fragment request, make sure its route still renders a complete page for a direct visit. The same render runs in both modes.

## See also

- [AI Docs](/ai) — machine-readable entrypoints for agents.
- [Routing](/concepts/routing) — real URLs and metadata.
