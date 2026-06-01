# Routing

> Route manifests are explicit arrays of paths, metadata functions, and render functions.

```js
import { html, route } from "@nativefragments/core/server";

export const routes = [
  route("/", {
    meta: () => ({
      title: "Home",
      description: "Native Fragments home page.",
      canonical: "https://example.com/",
    }),
    render: () => html`<h1>Hello</h1>`,
  }),
];
```

Routes are matched by normalized path. A normal document request renders the full shell. A request with `x-fragment: true` renders only the route body and metadata script.

## Nested Route Regions

```js
route("/settings/profile", {
  render: settingsPage,
  fragments: {
    "settings-panel": profilePanel,
  },
});
```

The full route remains the canonical server-rendered page. Links can target the named fragment slot for a smaller update.
