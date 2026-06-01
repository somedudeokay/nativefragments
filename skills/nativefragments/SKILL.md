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
