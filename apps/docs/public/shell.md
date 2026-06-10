# Shell

The shell is the one function that wraps every route body in a full HTML document. It owns the head, the persistent chrome, and the content slot — everything that survives navigation.

## What the shell owns

A route renders the part of the page that changes. The shell renders everything around it: the doctype, the `<head>` built from route metadata, stylesheets and scripts, persistent chrome like the site header, and the slot the body lands in. It runs once per document request — fragment navigation swaps the slot's content and leaves the rest of the shell untouched.

## A minimal shell

A shell is a plain function from `{ body, meta, nonce }` to a document string. Interpolate `body` with [raw](/reference#raw) — it is already rendered, escaped HTML.

```js
// site/shell.js
import { html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <link rel="canonical" href="${meta.canonical}" />
    <link rel="stylesheet" href="/app/styles.css" />
    <script type="module" src="/app/client.js"></script>
  </head>
  <body>
    <header>…site chrome…</header>
    <main id="content-slot">${raw(body)}</main>
  </body>
</html>`;
```

## The content slot

`#content-slot` is the default target for [fragment navigation](/concepts/fragments): link clicks fetch the next route's body and replace the slot's children. Anything outside the slot persists across navigation — the header stays mounted, components in the chrome keep their state, and module scope survives. That is why persistent UI belongs in the shell, not in route bodies.

## Metadata

`meta` arrives normalized from the route's [meta()](/concepts/routing) function — `title`, `description`, and `canonical` always exist (empty string or the pathname when unset). On fragment navigation the browser router updates the document head from the fragment response, so the shell's head markup stays correct without re-rendering.

## Streaming shells

For [streamed documents](/concepts/streaming) the adapter needs the document split around the body. Return `{ before, after }` when called without a `body`; keep the string form for everything else.

```js
export const shell = ({ body, meta, nonce }) => {
  const parts = {
    before: html`<!doctype html>
<html lang="en">
  <head><title>${meta.title}</title></head>
  <body><main id="content-slot">`,
    after: html`</main></body></html>`,
  };
  if (body === undefined) return parts;
  return html`${raw(parts.before)}${raw(body)}${raw(parts.after)}`;
};
```

> **Good to know:** Plain string shells stream too — the adapter finds the body's position automatically. If it can't (for example the shell escapes body), the response falls back to buffered rendering and a warning is logged.

## The CSP nonce

The Cloudflare adapter passes a per-request `nonce`. Put it on inline scripts and styles with [attrs](/reference#attrs) if you enable a strict [contentSecurityPolicy](/concepts/api-routes) — the framework's own streaming bootstrap uses the same nonce.

```js
export const shell = ({ body, meta, nonce }) => html`<!doctype html>
<html lang="en">
  <head>
    <title>${meta.title}</title>
    <script${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
  </head>
  <body><main id="content-slot">${raw(body)}</main></body>
</html>`;
```

## See also

- [Routing](/concepts/routing) — where `meta` comes from.
- [Fragments](/concepts/fragments) — how the content slot is swapped.
- [Streaming](/concepts/streaming) — the full streamed-document model.
- [Reference: CloudflareHandlerOptions](/reference#CloudflareHandlerOptions), [raw](/reference#raw), [attrs](/reference#attrs).
