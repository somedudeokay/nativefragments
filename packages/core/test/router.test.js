import assert from "node:assert/strict";
import test from "node:test";
import {
  createRoutes,
  html,
  redirect,
  renderRoute,
  route,
} from "../src/server/index.js";

test("static routes beat param routes regardless of declaration order", () => {
  const dynamic = route("/:slug", { render: () => "" });
  const exact = route("/about", { render: () => "" });
  const routes = createRoutes([dynamic, exact]);

  assert.equal(routes.match("/about"), exact);
});

test("param routes match in declaration order", () => {
  const first = route("/:one", { render: () => "" });
  const second = route("/:two", { render: () => "" });
  const routes = createRoutes([first, second]);

  assert.equal(routes.match("/value").path, first.path);
  assert.deepEqual(routes.match("/value").params, { one: "value" });
});

test("trailing slashes normalize and root works", () => {
  const root = route("/", { render: () => "" });
  const item = route("/a/", { render: () => "" });
  const routes = createRoutes([root, item]);

  assert.equal(routes.match("/"), root);
  assert.equal(routes.match("/a/"), item);
  assert.equal(routes.match("/a"), item);
});

test("encoded segments decode into params and malformed encoding stays raw", () => {
  const routes = createRoutes([route("/:slug", { render: () => "" })]);

  assert.deepEqual(routes.match("/hello%20world").params, {
    slug: "hello world",
  });
  assert.deepEqual(routes.match("/%E0%A4%A").params, {
    slug: "%E0%A4%A",
  });
});

test("catch-all params match zero or more trailing segments", () => {
  const routes = createRoutes([route("/docs/:rest*", { render: () => "" })]);

  assert.deepEqual(routes.match("/docs").params, { rest: "" });
  assert.deepEqual(routes.match("/docs/guides/streaming").params, {
    rest: "guides/streaming",
  });
  assert.deepEqual(routes.match("/docs/guides%20and%20api").params, {
    rest: "guides and api",
  });
});

test("catch-all params must be final", () => {
  assert.throws(
    () => route("/files/:rest*/edit", { render: () => "" }),
    /must be the final segment/,
  );
});

test("duplicate route paths warn and first route wins", (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const first = route("/a", { render: () => html`first` });
  const second = route("/a/", { render: () => html`second` });
  const routes = createRoutes([first, second]);

  assert.equal(routes.match("/a"), first);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /duplicate route path "\/a"/);
});

test("renderRoute exposes query on context", async () => {
  const match = route("/", {
    render: ({ query }) => html`<p>${query.get("filter")}</p>`,
  });
  const rendered = await renderRoute({
    match,
    request: new Request("https://example.com/?filter=active"),
  });

  assert.equal(rendered.body, "<p>active</p>");
});

test("renderRoute surfaces Response returned from render", async () => {
  const response = redirect("/other");
  const rendered = await renderRoute({
    match: route("/", { render: () => response }),
    request: new Request("https://example.com/"),
  });

  assert.equal(rendered.response, response);
});

test("renderRoute surfaces Response thrown from meta", async () => {
  const response = new Response("Locked", { status: 423 });
  const rendered = await renderRoute({
    match: route("/", {
      meta: () => {
        throw response;
      },
      render: () => html`never`,
    }),
    request: new Request("https://example.com/"),
  });

  assert.equal(rendered.response, response);
});

test("renderRoute includes status and headers fields", async () => {
  const rendered = await renderRoute({
    match: route("/", {
      status: 410,
      headers: ({ query }) => ({
        "Cache-Control": `public, max-age=${query.get("ttl")}`,
      }),
      render: () => html`Gone`,
    }),
    request: new Request("https://example.com/?ttl=60"),
  });

  assert.equal(rendered.status, 410);
  assert.deepEqual(rendered.headers, {
    "Cache-Control": "public, max-age=60",
  });
});
