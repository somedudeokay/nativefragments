import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const apiRoutesPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "API Routes",
    intro:
      "Serve a JSON or HTTP API alongside your pages. The Cloudflare adapter delegates a URL prefix to any router with a Web Standards fetch method — Hono works directly, and core stays dependency-free.",
    body: html`
      <h2>Mounting an API</h2>
      <p>
        Pass an <code>api</code> to
        <a href="/reference#createCloudflareHandler"><code>createCloudflareHandler</code></a>.
        Requests under <code>apiPrefix</code> (default <code>/api</code>) go to
        the API; everything else renders pages.
      </p>
      ${code(`// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { Hono } from "hono";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const api = new Hono();
api.get("/api/health", (c) => c.json({ ok: true }));

export default createCloudflareHandler({ routes, shell, api });`)}
      ${callout(
        "Note",
        "Requests under apiPrefix are delegated to api.fetch before route matching. The shell does not parse them, so the API owns its own request/response handling.",
      )}

      <h2>Any Web Standards router</h2>
      <p>
        <code>api</code> only needs a
        <code>fetch(request, env, context)</code> method, so anything that
        speaks the Workers fetch contract works — Hono is one option, a plain
        function is another.
      </p>
      ${code(`const api = {
  fetch(request) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};`)}

      <h2>Changing the prefix</h2>
      ${code(`export default createCloudflareHandler({
  routes,
  shell,
  api,
  apiPrefix: "/rpc", // /rpc and /rpc/* now go to the API
});`)}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — page routes the adapter renders.</li>
        <li><a href="/concepts/workers">Workers</a> — offload client-side work instead.</li>
        <li><a href="/reference#createCloudflareHandler">Reference: <code>createCloudflareHandler</code></a>.</li>
      </ul>
    `,
  });
