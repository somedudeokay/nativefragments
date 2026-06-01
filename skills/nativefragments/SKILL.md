---
name: nativefragments
description: Build and edit Native Fragments apps with zero dependencies, zero build, Cloudflare Workers, fragment navigation, and Shadow DOM components.
---

# Native Fragments Skill

Use this skill when creating or editing a Native Fragments app.

## Goals

- Keep apps zero dependency unless the product earns an exception.
- Keep apps zero build by default: no Vite, no JSX transform, no virtual DOM.
- Use Cloudflare Workers for server rendering and static assets.
- Render HTML on the server, then use fragment navigation for fast transitions.
- Use nested fragment slots for route regions that should navigate without
  replacing the full page body.
- Use Web Workers for expensive client-side work like search, filtering,
  parsing, and background preparation.
- Put component styling inside Shadow DOM.
- Avoid refresh FOUC by server-rendering important custom elements with
  declarative Shadow DOM.
- Make files obvious for agents: one route, one renderer, one component file.

## Default Structure

- `worker.js`: Cloudflare Worker entrypoint.
- `site/routes.js`: explicit route manifest.
- `site/shell.js`: full document shell.
- `site/pages/*.js`: route renderers.
- `public/nativefragments/*.js`: browser-loadable framework helpers.
- `public/app/*.js`: app browser modules and custom elements.

## Route Pattern

```js
route("/", {
  meta: () => ({
    title: "Home",
    description: "Page description",
    canonical: "https://example.com/"
  }),
render: () => html`<h1>Hello</h1>`
});
```

## Nested Fragment Pattern

Use named fragments when a route contains a sub-region with its own links.

```js
route("/settings/profile", {
  meta: () => ({
    title: "Profile",
    description: "Profile settings",
    canonical: "https://example.com/settings/profile"
  }),
  render: () => html`<main>
    <nav>
      <a href="/settings/profile" data-fragment-slot="settings-panel">
        Profile
      </a>
    </nav>
    <section data-fragment-slot="settings-panel">
      ${profilePanel()}
    </section>
  </main>`,
  fragments: {
    "settings-panel": profilePanel
  }
});
```

The link slot name must match the target container and the route `fragments`
key. The full `render` output remains the canonical server-rendered fallback.

## Worker Pattern

Use `/nativefragments/worker.js` for worker RPC instead of inventing a custom
`postMessage` protocol in each app.

Worker module:

```js
import { exposeWorker } from "/nativefragments/worker.js";

exposeWorker({
  filter: ({ rows, query }) =>
    rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
});
```

Main thread:

```js
import { createWorkerClient } from "/nativefragments/worker.js";

const worker = createWorkerClient("/app/filter-worker.js");
const rows = await worker.call("filter", { rows: allRows, query });
```

Keep worker payloads structured-clone friendly. Use `transferResult()` for
large `ArrayBuffer` payloads that should move without copying.

## Component Pattern

For any component visible during initial render, include a declarative shadow
template in the server HTML. This prevents the browser from painting unstyled
light DOM before the component module upgrades.

Server renderer:

```js
import { declarativeShadow, html } from "@nativefragments/core/server";

const cardStyles = `
  :host { display: block; }
  article { border: 1px solid currentColor; }
`;

export const appCard = (content) => html`<app-card>${declarativeShadow({
  styles: [cardStyles],
  html: html`<article>${content}</article>`
})}</app-card>`;
```

Browser component:

```js
import { shadow, sheet } from "/nativefragments/component.js";

const cardStyles = `
  :host { display: block; }
  article { border: 1px solid currentColor; }
`;

const styles = sheet(cardStyles);

class AppCard extends HTMLElement {
  connectedCallback() {
    shadow(this, {
      styles: [styles],
      html: `<article><slot></slot></article>`
    });
  }
}

customElements.define("app-card", AppCard);
```

The `shadow()` helper preserves an existing declarative shadow root on first
upgrade, then updates normally on later renders. Use `{ hydrate: false }` only
when a component must intentionally discard server-rendered shadow DOM.

## Testing Guidance

Do not add a test framework to the package. App repos can add focused checks:

- HTTP smoke checks with `curl`.
- Component tests with Web Test Runner and Open WC.
- Browser checks only when behavior depends on navigation, layout, or real DOM
  APIs.
