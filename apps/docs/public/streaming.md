# Streaming

Deferred fragments stream a page in two phases on one connection: the shell and loading boundaries flush immediately, then each fragment's completed HTML arrives as soon as its data resolves — out of order, without blocking the others.

## One connection, out of order

A route that waits for slow data normally holds the whole document hostage. With deferred streaming, the first chunk on the wire is the complete document skeleton — `<head>`, layout, and a loading boundary for every deferred fragment. The connection stays open and each fragment streams in when its renderer finishes. A fragment that takes two seconds never delays one that takes fifty milliseconds: the fastest fragment renders first regardless of the order it was deferred.

## Deferring a fragment

Define the fragment with a `render` function and optional `loading` and `error` renderers, then call `context.defer(fragment)` where its content belongs. `defer()` returns the loading boundary synchronously, so it interpolates straight into the route body.

```js
import { fragment, html, route } from "@nativefragments/core/server";

const relatedPosts = fragment("related-posts", {
  loading: () => html`<p class="skeleton">Finding related posts…</p>`,
  error: () => html`<p role="status">Related posts are unavailable.</p>`,
  render: async (context) => {
    const posts = await loadRelated(context.params.slug, {
      signal: context.signal,
    });
    return html`<ul>
      ${posts.map((post) => html`<li><a href="${post.url}">${post.title}</a></li>`).join("")}
    </ul>`;
  },
});

export const postRoute = route("/posts/:slug", {
  render: (context) => html`<article>
    <h1>…</h1>
    ${context.defer(relatedPosts, { class: "related" })}
  </article>`,
  fragments: [relatedPosts],
});
```

The second argument spreads attributes onto the boundary element, which carries `aria-busy` and `data-fragment-state` while loading. Deferred renderers start the moment `defer()` collects them, so data fetches overlap with the rest of the route render.

## Loading, errors, and timeouts

`loading()` must be synchronous — it ships in the first chunk. `render()` and `error()` may be async. The HTTP status is committed with the first byte, so a fragment that fails mid-stream can never turn the page into a 500: it streams its `error()` boundary in place and the rest of the page is unaffected.

Every deferred fragment has a timeout (default 15 seconds, configurable per fragment via `timeout` or per app via the adapter's `deferredTimeout` option), so a hung data source ends as an error boundary instead of a never-finishing response. Pass `context.signal` to `fetch` so timed-out or abandoned requests cancel their network work.

## Streaming shells

To stream, the adapter needs to know where the route body sits inside your [shell](/concepts/shell). A shell that returns `{ before, after }` when called without a `body` makes the split explicit:

```js
import { html } from "@nativefragments/core/server";

export const shell = ({ body, meta, nonce }) => {
  const parts = {
    before: html`<!doctype html>
<html lang="en">
  <head><title>${meta.title}</title></head>
  <body><main id="content-slot">`,
    after: html`</main></body></html>`,
  };
  if (body === undefined) return parts;
  return html`${parts.before}${body}${parts.after}`;
};
```

Plain string shells keep working — the adapter locates the body automatically. If it cannot (for example the shell escapes `body`), the response falls back to buffered rendering and a warning is logged, so streaming never fails silently.

## Fragment navigation streams too

Client-side navigation requests (the `x-fragment: true` path) use the same deferred work. The browser router replaces the target with the route body and its loading boundaries as soon as the first HTML frame arrives, then reveals each completed fragment from later frames on that same response. The shell stays mounted, links and history keep their normal fragment-navigation behavior, and one slow region does not hold the rest of the navigation hostage.

Streaming is negotiated with `X-NativeFragments-Protocol: 2`. Compatible responses echo the version and include a private frame token. Requests without a supported version receive completed buffered HTML. This makes stale browser tabs safe across protocol changes.

Prefetching still ends in completed HTML in the fragment cache. If a prefetched route has finished before it is opened, navigation applies it immediately; otherwise a user-initiated request streams normally.

## Crawlers and SEO

Reveals wait for the payload's closing tag and completion sentinel. Response-scoped IDs and targets prevent old streams from changing a new route. Both documents and navigation emit `nativefragments:fragment-reveal`; use these events for timing, including cached replay. Cancelling a body aborts deferred context signals.

With JavaScript disabled, resolved sections appear after the initial route body through noscript fallbacks. A nonce-bearing style hides placeholders; strict CSP must allow the nonce in both style-src and script-src. Router parsing materializes declarative shadow roots before connecting custom elements, preserving the original Lit SSR nodes during hydration.

Streamed fragments arrive as real, parseable HTML in the same response the crawler fetched — not inert templates and not client-side fetches. Stream _order_ is invisible to anything that reads the final document. On document loads, a single delegated script (carrying the adapter's CSP nonce) moves each fragment into its boundary. During client-side navigation, the browser router performs the same reveal as HTML frames arrive. Crawlability is determined by what is in the response, and the full content is in the response.

> **See it live:** met-gallery.nativefragments.org streams four museum-data fragments out of order on one connection — including one that intentionally fails to show the error boundary. The stream dock in the corner shows each fragment's arrival time.

## See also

- [Fragments](/concepts/fragments) — the navigation model deferred fragments build on.
- [Shell](/concepts/shell) — everything else the shell owns.
- [API Routes](/concepts/api-routes) — strict Content Security Policy with the per-request nonce.
- [Reference: RouteContext.defer](/reference#RouteContext), [FragmentDefinition](/reference#FragmentDefinition), [CloudflareHandlerOptions](/reference#CloudflareHandlerOptions).
