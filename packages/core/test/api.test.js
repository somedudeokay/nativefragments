import assert from "node:assert/strict";
import test from "node:test";
import { apiRoute, createApi } from "../src/server/index.js";

const json = (response) => response.json();

test("createApi dispatches methods with params and query", async () => {
  const api = createApi([
    apiRoute("GET", "/api/todos/:id", ({ params, query }) => ({
      id: params.id,
      filter: query.get("filter"),
    })),
  ]);

  const response = await api.fetch(
    new Request("https://example.com/api/todos/42?filter=active"),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { id: "42", filter: "active" });
});

test("plain handler values become JSON responses", async () => {
  const api = createApi([apiRoute("GET", "/api/health", () => ({ ok: true }))]);
  const response = await api.fetch(new Request("https://example.com/api/health"));

  assert.equal(response.headers.get("content-type"), "application/json");
  assert.deepEqual(await json(response), { ok: true });
});

test("native Response values pass through", async () => {
  const passthrough = new Response("ok", {
    status: 201,
    headers: { "x-api": "native" },
  });
  const api = createApi([apiRoute("POST", "/api/items", () => passthrough)]);
  const response = await api.fetch(
    new Request("https://example.com/api/items", { method: "POST" }),
  );

  assert.equal(response, passthrough);
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("x-api"), "native");
});

test("unknown API paths return the 404 JSON shape", async () => {
  const api = createApi([]);
  const response = await api.fetch(new Request("https://example.com/api/missing"));

  assert.equal(response.status, 404);
  assert.deepEqual(await json(response), { error: "Not found" });
});

test("path matches with unsupported methods return 405 and Allow", async () => {
  const api = createApi([
    apiRoute("GET", "/api/items", () => []),
    apiRoute("POST", "/api/items", () => ({ ok: true })),
  ]);
  const response = await api.fetch(
    new Request("https://example.com/api/items", { method: "DELETE" }),
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD, POST");
  assert.deepEqual(await json(response), { error: "Method not allowed" });
});

test("HEAD falls back to GET when no HEAD route exists", async () => {
  const api = createApi([apiRoute("GET", "/api/items", () => ({ ok: true }))]);
  const response = await api.fetch(
    new Request("https://example.com/api/items", { method: "HEAD" }),
  );

  assert.equal(response.status, 200);
});

test("handler errors call onError and do not leak messages", async () => {
  const errors = [];
  const api = createApi(
    [
      apiRoute("GET", "/api/fail", () => {
        throw new Error("database password leaked");
      }),
    ],
    {
      onError: (event) => errors.push(event),
    },
  );
  const response = await api.fetch(new Request("https://example.com/api/fail"));

  assert.equal(response.status, 500);
  assert.deepEqual(await json(response), { error: "Internal error" });
  assert.equal(errors.length, 1);
  assert.match(String(errors[0].error), /database password leaked/);
});

test("API catch-all routes use the page matcher syntax", async () => {
  const api = createApi([
    apiRoute("GET", "/api/files/:rest*", ({ params }) => params),
  ]);
  const response = await api.fetch(
    new Request("https://example.com/api/files/a/b%20c"),
  );

  assert.deepEqual(await json(response), { rest: "a/b c" });
});
