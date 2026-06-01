# Fragments

> Fragments preserve real links while making same-origin navigation feel instant.

Add the browser router to your shell:

```html
<main id="content-slot"><!-- route body --></main>
<script type="module" src="/app/client.js"></script>
```

```js
import { installFragmentNavigation } from "/nativefragments/router.js";

installFragmentNavigation({ slot: "#content-slot" });
```

The router intercepts same-origin clicks, fetches the route with `x-fragment: true`, replaces the slot, updates metadata, pushes history, and keeps external links as normal browser navigation.

## Nested Fragments

```html
<a href="/settings/profile" data-fragment-slot="settings-panel">Profile</a>
<section data-fragment-slot="settings-panel"></section>
```

The router sends `x-fragment-slot: settings-panel`, replaces only the matching container, updates history, and keeps the full route as the fallback.
