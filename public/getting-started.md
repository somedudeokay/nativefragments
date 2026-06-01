# Getting Started

> Create and run a Native Fragments app. For the full docs index, fetch https://docs.nativefragments.org/llms.txt.

```sh
npm create @nativefragments/app@latest my-app
cd my-app
npm run dev
```

The scaffold includes a Cloudflare Worker entry, a Hono API adapter under `/api/*`, a route manifest, a shell, app pages, browser fragment navigation, nested fragment slots, Shadow DOM component helpers, optional signals, and worker RPC helpers.

## Package Imports

```js
import { html, route } from "@nativefragments/core/server";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
```

Browser helpers are served from app-owned files:

```js
import { installFragmentNavigation } from "/nativefragments/router.js";
import { shadow, sheet } from "/nativefragments/component.js";
import { createWorkerClient } from "/nativefragments/worker.js";
```

Optional signals:

```sh
npm i @nativefragments/signals
cp node_modules/@nativefragments/signals/public/nativefragments/*.js public/nativefragments/
```
