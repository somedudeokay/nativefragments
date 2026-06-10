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

      <h2>The route context</h2>
      <p>
        Every <code>render</code> and <code>meta</code> receives a
        <a href="/reference#RouteContext"><code>RouteContext</code></a>:
      </p>
      <ul>
        <li><code>ctx.params</code> — captured path parameters.</li>
        <li><code>ctx.url</code> — the parsed <code>URL</code>.</li>
        <li><code>ctx.request</code> — the original <code>Request</code>.</li>
        <li><code>ctx.signal</code> — an <code>AbortSignal</code> that fires on cancellation or a deferred timeout; pass it to <code>fetch</code>.</li>
        <li><code>ctx.defer(fragment)</code> — render a loading boundary now, <a href="/concepts/streaming">stream the fragment</a> when its data resolves.</li>
      </ul>

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
        <li><a href="/reference#route">Reference: <code>route</code></a>, <a href="/reference#createRoutes"><code>createRoutes</code></a>, <a href="/reference#notFoundRoute"><code>notFoundRoute</code></a>.</li>
      </ul>
    `,
  });
