# `@nativefragments/lit`

The default Lit integration for Native Fragments. It renders Lit templates and
components inside Cloudflare Workers and hydrates their declarative Shadow DOM
in the browser.

```js
import { html as lit } from "lit";
import { renderLit } from "@nativefragments/lit/server";
import "./client/components/app-counter.js";

const counter = await renderLit(lit`<app-counter count="3"></app-counter>`);
```

Load hydration support before component definitions in the browser:

```js
import "@nativefragments/lit/client";
import "./components/app-counter.js";
```

Native Fragments pins the Lit Labs renderer behind this small interface because
the renderer's public extension APIs may still change. Applications should not
import Lit Labs SSR directly.
