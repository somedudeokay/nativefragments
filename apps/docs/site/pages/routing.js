import { html } from "@nativefragments/core/server";
import { callout, code, docPage } from "./blocks.js";

export const routingPage = () =>
  docPage({
    eyebrow: "Concepts",
    title: "Routing",
    intro:
      "A route maps a URL path to a render function and optional metadata. Routes are plain objects, so humans and agents can read the whole map at a glance.",
    body: html`
      <h2>Defining a route</h2>
      <p>
        <a href="/reference#route"><code>route</code></a> takes a path and a
        definition with a <code>render</code> function and an optional
        <code>meta</code> function.
      </p>
      ${code(`// site/pages/home.js
import { html, route } from "@nativefragments/core/server";

export const home = route("/", {
  meta: () => ({ title: "Home", description: "Welcome." }),
  render: () => html\`<h1>Home</h1>\`,
});`)}

      <h2>Path parameters</h2>
      <p>
        Use <code>:name</code> segments. Matched values arrive on
        <code>ctx.params</code>.
      </p>
      ${code(`// site/pages/blog.js
export const post = route("/blog/:slug", {
  render: (ctx) => html\`<h1>\${ctx.params.slug}</h1>\`,
});`)}

      <h2>Catch-all segments</h2>
      <p>
        A trailing <code>:rest*</code> captures zero or more remaining segments
        as a single slash-joined string on <code>ctx.params.rest</code>. It must
        be the final segment — declaring it anywhere else throws at definition
        time.
      </p>
      ${code(`// /docs, /docs/guides, /docs/guides/routing all match
export const docs = route("/docs/:rest*", {
  render: (ctx) => html\`<h1>\${ctx.params.rest || "Docs home"}</h1>\`,
});`)}

      <h2>Query parameters</h2>
      <p>
        <code>ctx.query</code> is the request's
        <a href="/reference#RouteContext"><code>URLSearchParams</code></a>. Read
        it directly, or use
        <a href="/reference#readSearch"><code>readSearch</code></a> to pull typed
        string values with defaults for missing or empty params.
      </p>
      ${code(`import { readSearch, route } from "@nativefragments/core/server";

export const list = route("/posts", {
  render: (ctx) => {
    const { filter, sort } = readSearch(ctx.query, {
      filter: "all",
      sort: "newest",
    });
    return html\`<h1>\${filter} · \${sort}</h1>\`;
  },
});`)}

      <h2>The route context</h2>
      <p>
        Every <code>render</code>, <code>meta</code>, and <code>action</code>
        receives a
        <a href="/reference#RouteContext"><code>RouteContext</code></a>:
      </p>
      <ul>
        <li><code>ctx.params</code> — captured path parameters, including <code>:rest*</code>.</li>
        <li><code>ctx.query</code> — the request's <code>URLSearchParams</code>.</li>
        <li><code>ctx.url</code> — the parsed <code>URL</code>.</li>
        <li><code>ctx.request</code> — the original <code>Request</code>.</li>
        <li><code>ctx.signal</code> — an <code>AbortSignal</code> that fires on cancellation or a deferred timeout; pass it to <code>fetch</code>.</li>
        <li><code>ctx.defer(fragment)</code> — render a loading boundary now, <a href="/concepts/streaming">stream the fragment</a> when its data resolves.</li>
      </ul>

      <h2>Status and headers</h2>
      <p>
        Set <code>status</code> for a non-200 rendered page and
        <code>headers</code> for per-route response headers (an object or a
        function of the context). Route headers merge in after the adapter's
        defaults, so a route can set its own <code>Cache-Control</code>.
      </p>
      ${code(`export const gone = route("/legacy", {
  status: 410,
  headers: () => ({ "Cache-Control": "public, max-age=3600" }),
  render: () => html\`<h1>This page is gone</h1>\`,
});`)}
      <p>
        A route can also return or throw a native <code>Response</code> from
        <code>meta</code> or <code>render</code>; the adapter passes it through
        untouched.
      </p>

      <h2>Redirects</h2>
      <p>
        <a href="/reference#redirect"><code>redirect(location, status = 302)</code></a>
        builds a native redirect <code>Response</code>. Return it from
        <code>render</code> for a permanent move, or from an
        <code>action</code> for POST-redirect-GET.
      </p>
      ${code(`import { redirect, route } from "@nativefragments/core/server";

export const old = route("/old", {
  render: () => redirect("/new", 301),
});`)}

      <h2>Mutations with actions</h2>
      <p>
        A route <code>action</code> handles <code>POST</code> for
        no-JavaScript forms. Actions never render — they must return a
        <code>Response</code>, usually a <code>303</code>
        <a href="/reference#redirect"><code>redirect</code></a> back to a
        <code>GET</code> URL. POST forms are never fragment-intercepted, so the
        browser follows the redirect normally.
      </p>
      ${code(`import { redirect, route } from "@nativefragments/core/server";

export const todos = route("/todos", {
  action: async ({ request }) => {
    const form = await request.formData();
    await saveTodo(form.get("title"));
    return redirect("/todos", 303);
  },
  render: () => html\`<form method="post">
    <input name="title" />
    <button>Add</button>
  </form>\`,
});`)}
      ${callout(
        "Note",
        "GET renders the page and POST runs the action. A POST to a route without an action returns 405 with an Allow header.",
      )}

      <h2>Metadata</h2>
      <p>
        <code>meta</code> returns a
        <a href="/reference#RouteMeta"><code>RouteMeta</code></a> object —
        <code>title</code>, <code>description</code>, <code>canonical</code>, and
        <code>alternates</code>. The shell renders it into the document head, and
        fragment responses carry it so the browser can update the head on
        navigation.
      </p>

      <h2>The route manifest</h2>
      <p>
        An app exports an array of routes. The Cloudflare adapter builds a
        manifest with <a href="/reference#createRoutes"><code>createRoutes</code></a>;
        exact paths match first, then parameterized routes in declaration order.
      </p>
      ${code(`// site/routes.js
import { createRoutes } from "@nativefragments/core/server";

export const routes = [home, post];
// createCloudflareHandler calls createRoutes(routes) for you.`)}
      ${callout(
        "Note",
        "When no route matches, the adapter renders notFoundRoute with a 404 status. Override it with the notFound option on createCloudflareHandler.",
      )}

      <h2>See also</h2>
      <ul>
        <li><a href="/concepts/fragments">Fragments</a> — partial navigation within a route.</li>
        <li><a href="/concepts/streaming">Streaming</a> — defer slow regions with <code>ctx.defer()</code>.</li>
        <li><a href="/concepts/api-routes">API Routes</a> — JSON endpoints alongside pages.</li>
        <li><a href="/reference#route">Reference: <code>route</code></a>, <a href="/reference#readSearch"><code>readSearch</code></a>, <a href="/reference#redirect"><code>redirect</code></a>, <a href="/reference#createRoutes"><code>createRoutes</code></a>.</li>
      </ul>
    `,
  });
