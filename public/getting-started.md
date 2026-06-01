# Getting Started

> Create and run a Native Fragments app. For the full docs index, fetch https://docs.nativefragments.org/llms.txt.

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

The scaffold includes a Cloudflare Worker entry, a route manifest, a shell, app pages, browser fragment navigation, and Shadow DOM component helpers.

## Package Imports

```js
import { html, route } from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Browser helpers are served from app-owned files:

```js
import { installFragmentNavigation } from "/nativefragments/router.js";
import { shadow, sheet } from "/nativefragments/component.js";
```

