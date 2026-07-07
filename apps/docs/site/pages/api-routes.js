import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const apiRoutesPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "API Routes",
    intro:
      "Serve a JSON API alongside your pages. Define endpoints with apiRoute and createApi — the same :param and :rest* matcher as page routes, dependency-free — or delegate the prefix to any router with a Web Standards fetch method.",
    body: html`
      <h2>Defining routes</h2>
      <p>
        <a href="/reference#apiRoute"><code>apiRoute(method, path, handler)</code></a>
        creates one endpoint;
        <a href="/reference#createApi"><code>createApi(routes, options)</code></a>
        assembles them into a Fetch-compatible router. Handlers receive
        <code>{ request, env, context, url, params, query, signal }</code>. A
        returned <code>Response</code> passes through; any other value becomes
        <code>Response.json(value)</code>.
      </p>
      ${code(`// site/api.js
import { apiRoute, createApi } from "@nativefragments/core/server";

export const api = createApi([
  apiRoute("GET", "/api/todos", ({ query }) => listTodos(query.get("filter"))),
  apiRoute("POST", "/api/todos", async ({ request }) =>
    Response.json(await createTodo(await request.json()), { status: 201 }),
  ),
  apiRoute("DELETE", "/api/todos/:id", ({ params }) => removeTodo(params.id)),
]);`)}
      <p>
        API paths use the same matcher as pages: <code>:id</code> captures one
        segment onto <code>params</code>, and a trailing <code>:rest*</code>
        captures the remainder.
      </p>

      <h2>Mounting an API</h2>
      <p>
        Pass the <code>api</code> to
        <a href="/reference#createCloudflareHandler"><code>createCloudflareHandler</code></a>.
        Requests under <code>apiPrefix</code> (default <code>/api</code>) go to
        the API; everything else renders pages. The adapter also accepts an
        array of <code>apiRoute()</code> items directly and calls
        <code>createApi</code> for you.
      </p>
      ${code(`// worker.js
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { api } from "./site/api.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({ routes, shell, api });`)}
      ${callout(
        "Note",
        "API-prefixed requests are delegated to api.fetch before page method handling. The shell does not wrap them, so the API owns its own request and response.",
      )}

      <h2>Dispatch semantics</h2>
      <p>
        <a href="/reference#createApi"><code>createApi</code></a> resolves each
        request against the matched path:
      </p>
      <ul>
        <li>No path match returns JSON <code>404</code>.</li>
        <li>A path match with an unsupported method returns <code>405</code> with an <code>Allow</code> header listing the methods.</li>
        <li><code>HEAD</code> falls back to the <code>GET</code> handler when no <code>HEAD</code> handler exists.</li>
        <li>A handler that throws calls <code>onError</code> and returns JSON <code>500</code> without leaking the message.</li>
      </ul>
      ${code(`export const api = createApi(routes, {
  onError: ({ error, request, route }) =>
    console.error(request.url, route?.path, error),
});`)}

      <h2>Any Web Standards router</h2>
      <p>
        You are not limited to <code>createApi</code>. <code>api</code> only
        needs a <code>fetch(request, env, context)</code> method, so anything
        that speaks the Workers fetch contract works — a Hono app, or a plain
        object.
      </p>
      ${code(`import { Hono } from "hono";

const app = new Hono();
app.get("/api/health", (c) => c.json({ ok: true }));

export default createCloudflareHandler({ routes, shell, api: app });`)}

      <h2>Changing the prefix</h2>
      ${code(`export default createCloudflareHandler({
  routes,
  shell,
  api,
  apiPrefix: "/rpc", // /rpc and /rpc/* now go to the API
});`)}

      <h2>Content Security Policy</h2>
      <p>
        The Cloudflare adapter passes a per-request <code>nonce</code> to the
        shell and to framework streaming scripts. Keep the default compatible
        policy, or opt into a strict nonce-based policy with
        <code>contentSecurityPolicy</code>.
      </p>
      ${code(`import { attrs, html, raw } from "@nativefragments/core/server";

export const shell = ({ body, meta, nonce }) => html\`<!doctype html>
<html>
  <head>
    <title>\${meta.title}</title>
    <script\${attrs({ nonce })}>
      document.documentElement.classList.add("js");
    </script>
  </head>
  <body>\${body}</body>
</html>\`;

export default createCloudflareHandler({
  routes,
  shell,
  contentSecurityPolicy: ({ nonce }) =>
    [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      \`script-src 'self' 'nonce-\${nonce}'\`,
      \`style-src 'self' 'nonce-\${nonce}'\`
    ].join("; ")
});`)}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/routing">Routing</a> — page routes, and <code>action</code> for form mutations.</li>
        <li><a href="/concepts/workers">Workers</a> — offload client-side work instead.</li>
        <li><a href="/reference#apiRoute">Reference: <code>apiRoute</code></a>, <a href="/reference#createApi"><code>createApi</code></a>, <a href="/reference#createCloudflareHandler"><code>createCloudflareHandler</code></a>.</li>
      </ul>
    `,
  });
