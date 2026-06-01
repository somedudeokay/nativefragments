# API Routes

> Native Fragments delegates API paths to a Web Standards router.

```js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const api = new Hono();

api.get("/api/health", (context) => context.json({ ok: true }));

export default createCloudflareHandler({
  api,
  routes,
  shell,
});
```

The default API prefix is `/api`. Pass `apiPrefix` to use another route prefix.
