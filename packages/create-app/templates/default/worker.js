import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const api = new Hono();

api.get("/api/health", (context) =>
  context.json({
    ok: true,
    name: "__APP_NAME__",
  }),
);

export default createCloudflareHandler({
  api,
  routes,
  shell,
});
