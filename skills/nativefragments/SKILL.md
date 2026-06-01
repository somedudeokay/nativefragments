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

```js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host { display: block; }
`);

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

## Testing Guidance

Do not add a test framework to the package. App repos can add focused checks:

- HTTP smoke checks with `curl`.
- Component tests with Web Test Runner and Open WC.
- Browser checks only when behavior depends on navigation, layout, or real DOM
  APIs.
