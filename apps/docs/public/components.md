# Lit Components

Interactive regions are ordinary Lit custom elements. @nativefragments/lit renders them on the server and installs Lit's hydration support in the browser.

## Define an element

```js
// client/components/app-counter.js
import { LitElement, css, html } from "lit";

export class AppCounter extends LitElement {
  static properties = { count: { type: Number } };
  static styles = css`
    :host { display: block }
    button { font: inherit }
  `;

  constructor() {
    super();
    this.count = 0;
  }

  render() {
    return html`
      <output>${this.count}</output>
      <button @click=${() => this.count += 1}>Increment</button>
    `;
  }
}

customElements.define("app-counter", AppCounter);
```

## Render it on the Worker

```js
// site/pages/counter.js
import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/app-counter.js";

export const counterPage = () =>
  renderLit(html`<app-counter count="4"></app-counter>`);
```

[renderLit](/reference#renderLit) returns trusted server HTML containing Lit hydration markers and Declarative Shadow DOM. Route and shell renderers may therefore be asynchronous.

## Hydrate in the browser

```js
// client/index.js
import "@nativefragments/lit/client";
import "./components/app-counter.js";
```

Import hydration support before the element definitions. Lit attaches event listeners to the server-rendered tree instead of replacing the first paint.

> **Adapter boundary:** Application components import from lit. Only server integration imports @nativefragments/lit/server. This keeps @lit-labs/ssr and its DOM shim out of core and behind a small replaceable contract.

## State belongs to the element

Use Lit properties and normal JavaScript state for local interaction. Put durable state in your Worker, database, URL, or browser storage as appropriate. Native Fragments no longer ships a second reactive-state abstraction beside Lit.

## Fragment navigation

Lit elements can arrive in any streamed fragment frame. Once inserted, the browser upgrades and hydrates them through the same registered custom element definition. Persistent elements outside the navigation target remain mounted.

## See also

- [Fragments](/concepts/fragments) — target and swap regions.
- [Streaming](/concepts/streaming) — components arriving in deferred frames.
- [Reference: renderLit](/reference#renderLit).
