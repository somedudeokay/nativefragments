import assert from "node:assert/strict";
import test from "node:test";
import { createCloudflareHandler } from "../src/cloudflare/index.js";
import { apiRoute, createApi, fragment, html, route } from "../src/server/index.js";

const shell = ({ body }) => html`<main>${body}</main>`;

test("request locals and bindings are shared by metadata, rendering, headers and deferred work", async () => {
  const seen = [];
  const env = { DB: { name: "test" } };
  const runtime = { waitUntil() {} };
  const inspect = (scope) => { seen.push(scope); return scope.locals.user; };
  const part = fragment("profile", { render: (scope) => html`<p>${inspect(scope)}</p>` });
  let prepared = 0;
  const app = createCloudflareHandler({ shell,
    prepare: ({ request }) => { prepared++; return { user: request.headers.get("user") }; },
    routes: [route("/", {
      meta: (scope) => ({ title: String(inspect(scope)) }),
      headers: (scope) => ({ "x-user": String(inspect(scope)) }),
      render: (scope) => { inspect(scope); return html`${scope.defer(part)}`; },
    })],
  });
  const response = await app.fetch(new Request("https://example.test/", { headers: { user: "Alice", "x-fragment": "true" } }), env, runtime);
  assert.match(await response.text(), /Alice/);
  assert.equal(prepared, 1);
  assert.equal(seen.length, 4);
  for (const scope of seen) {
    assert.equal(scope.env, env);
    assert.equal(scope.context, runtime);
    assert.equal(scope.locals, seen[0].locals);
  }
});

test("actions and API handlers receive isolated prepared locals on concurrent requests", async () => {
  const app = createCloudflareHandler({ shell,
    prepare: async ({ request }) => { await Promise.resolve(); return { user: request.headers.get("user") }; },
    routes: [route("/", { render: () => "", action: ({ locals, env }) => Response.json({ ...locals, binding: env.VALUE }) })],
    api: [apiRoute("GET", "/api/user", async ({ locals, env }) => { await Promise.resolve(); return { ...locals, binding: env.VALUE }; })],
  });
  const values = await Promise.all(["Alice", "Bob"].flatMap(user => ["/", "/api/user"].map(async path => {
    const response = await app.fetch(new Request(`https://example.test${path}`, { method: path === "/" ? "POST" : "GET", headers: { user } }), { VALUE: user });
    assert.deepEqual(await response.json(), { user, binding: user });
  })));
  assert.equal(values.length, 4);
});

test("error observers cannot break API or page error responses", async () => {
  for (const onError of [() => { throw Error("logger"); }, async () => { throw Error("logger"); }]) {
    const app = createCloudflareHandler({ shell, onError, routes: [route("/", { render: () => { throw Error("render"); } })] });
    assert.equal((await app.fetch(new Request("https://example.test/"))).status, 500);
    const api = createApi([apiRoute("GET", "/", () => { throw Error("handler"); })], { onError });
    assert.equal((await api.fetch(new Request("https://example.test/"))).status, 500);
  }
});

test("protocol 2 redirect envelopes preserve cookies and do not render the destination early", async () => {
  let destinationCalls = 0;
  const app = createCloudflareHandler({ shell, routes: [
    route("/", { render: () => new Response(null, { status: 302, headers: { Location: "/done#anchor", "Set-Cookie": "session=test; Path=/; HttpOnly" } }) }),
    route("/done", { render: () => { destinationCalls++; return "Done"; } }),
  ] });
  const response = await app.fetch(new Request("https://example.test/", { headers: { "x-fragment": "true", "x-nativefragments-protocol": "2" } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-nativefragments-redirect"), "https://example.test/done#anchor");
  assert.equal(response.headers.get("set-cookie"), "session=test; Path=/; HttpOnly");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(destinationCalls, 0);
  const native = await app.fetch(new Request("https://example.test/", { headers: { "x-fragment": "true" } }));
  assert.equal(native.status, 302);
});
