# Components

A component is a Custom Element that renders into a Shadow DOM. Styles stay scoped to the element, and you can ship the shadow root in server HTML so it never flashes unstyled.

Native Fragments adds two browser helpers — [shadow](/reference#shadow) and [sheet](/reference#sheet) — plus the server helper [declarativeShadow](/reference#declarativeShadow). Everything else is the platform: `customElements.define`, `HTMLElement`, and adopted stylesheets.

## A minimal component

Define a Custom Element and call [shadow](/reference#shadow) in `connectedCallback`. It attaches an open shadow root, adopts your stylesheets, and sets the inner HTML.

```js
// public/app/components/reading-progress.js
import { shadow, sheet } from "/nativefragments/component.js";

const styles = sheet(`
  :host { display: block; height: 3px; background: #eee; }
  .bar { height: 100%; width: var(--progress, 0%); background: #1ed760; }
`);

class ReadingProgress extends HTMLElement {
  connectedCallback() {
    // Scoped CSS + markup, isolated from the page.
    shadow(this, { styles: [styles], html: `<div class="bar"></div>` });
  }
}

customElements.define("reading-progress", ReadingProgress);
```

Use it like any element: `<reading-progress></reading-progress>`. The `.bar` class can never collide with page CSS.

## Sharing styles with sheet()

[sheet](/reference#sheet) builds a `CSSStyleSheet` once and returns it. Create it at module scope so every instance adopts the _same_ stylesheet object instead of re-parsing CSS per element.

```js
// One stylesheet, shared by every <reading-progress> on the page.
const styles = sheet(`:host { display: block }`);
```

## Server-rendered components

Render the shadow root on the server with [declarativeShadow](/reference#declarativeShadow). It emits a `<template shadowrootmode="open">` the browser upgrades before your module loads, so there is no flash of unstyled content.

```js
// site/pages/article.js — on the server
import { declarativeShadow, html } from "@nativefragments/core/server";

export const article = () => html`<reading-progress>
  ${declarativeShadow({
    styles: [`:host { display: block } .bar { background: #1ed760 }`],
    html: `<div class="bar"></div>`,
  })}
</reading-progress>`;
```

Pair it with the same [shadow](/reference#shadow) call on the client. On first upgrade `shadow` preserves the server-rendered root instead of replacing it.

> **Good to know:** shadow() also materializes declarative shadow templates that arrive during a fragment swap, so server-rendered components keep working after client navigation.

## Hydration across fragment navigation

Fragment responses are inserted as HTML, which does not activate declarative shadow templates on its own. [shadow](/reference#shadow) handles this for you: with `hydrate` left on (the default), it adopts the existing root the first time the element upgrades and only writes `html` when there is nothing to preserve.

```js
shadow(this, { styles: [styles], html: markup });        // hydrate: true (default)
shadow(this, { styles: [styles], html: markup, hydrate: false }); // always overwrite
```

## See also

- [Fragments](/concepts/fragments) — how components survive partial navigation.
- [Signals](/concepts/signals) — add local reactive state inside a component.
- [Reference: shadow](/reference#shadow), [sheet](/reference#sheet), [declarativeShadow](/reference#declarativeShadow).
