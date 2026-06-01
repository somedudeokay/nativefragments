import { html } from "@nativefragments/core/server";
import { code, docPage } from "./blocks.js";

export const apiRoutesPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "API routes are Worker adapters.",
    intro:
      "Native Fragments delegates API paths to any Web Standards router with a fetch method. Hono works directly, while core stays dependency-free.",
    body: html`
      <h2>Mount Hono</h2>
      ${code(`import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const api = new Hono();

api.get("/api/health", (context) =>
  context.json({ ok: true })
);

export default createCloudflareHandler({
  api,
  routes,
  shell
});`)}
      <h2>Change the prefix</h2>
      <p>
        The adapter sends <code>/api</code> and <code>/api/*</code> to the API
        router by default. Use <code>apiPrefix</code> when an app needs a
        different path.
      </p>
      ${code(`export default createCloudflareHandler({
  api,
  apiPrefix: "/rpc",
  routes,
  shell
});`)}
    `,
  });
