import assert from "node:assert/strict";
import test from "node:test";
import {
  html,
  redirect,
  route,
} from "../src/server/index.js";
import { createCloudflareHandler } from "../src/cloudflare/index.js";

const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <title>${meta.title}</title>
  </head>
  <body><main id="content-slot">${body}</main></body>
</html>`;

test("HTML responses include default HTML, security, and Vary headers", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [route("/", { render: () => html`<p>Home</p>` })],
  });
  const response = await app.fetch(new Request("https://example.com/"), {}, {});

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("vary"), "x-fragment, x-fragment-slot");
  assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("throwing render produces the error route and calls onError", async () => {
  const errors = [];
  const app = createCloudflareHandler({
    onError: (event) => errors.push(event),
    shell,
    routes: [
      route("/", {
        render: () => {
          throw new Error("render failed");
        },
      }),
    ],
  });
  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const body = await response.text();

  assert.equal(response.status, 500);
  assert.match(body, /Something went wrong/);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].phase, "route");
});

test("throwing error route produces the plain text fallback", async () => {
  const errors = [];
  const app = createCloudflareHandler({
    error: route("/error", {
      render: () => {
        throw new Error("error route failed");
      },
    }),
    onError: (event) => errors.push(event),
    shell,
    routes: [
      route("/", {
        render: () => {
          throw new Error("render failed");
        },
      }),
    ],
  });
  const response = await app.fetch(new Request("https://example.com/"), {}, {});

  assert.equal(response.status, 500);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(await response.text(), "Internal error");
  assert.deepEqual(errors.map((event) => event.phase), ["route", "error-route"]);
});

test("POST to a route without action returns 405 and Allow", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [route("/", { render: () => html`Home` })],
  });
  const response = await app.fetch(
    new Request("https://example.com/", { method: "POST" }),
    {},
    {},
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("routes can return redirects from render", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [route("/", { render: () => redirect("/other") })],
  });
  const response = await app.fetch(new Request("https://example.com/"), {}, {});

  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "/other");
});

test("fragment redirects render the target route and expose the final hash URL", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", { render: () => redirect("/done#anchor") }),
      route("/done", { render: () => html`<h1 id="anchor">Done</h1>` }),
    ],
  });
  const response = await app.fetch(
    new Request("https://example.com/", {
      headers: { "x-fragment": "true" },
    }),
    {},
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("x-nativefragments-url"),
    "https://example.com/done#anchor",
  );
  assert.match(body, /<h1 id="anchor">Done<\/h1>/);
});

test("route status and headers land on rendered responses", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        status: 410,
        headers: () => ({
          "Cache-Control": "public, max-age=60",
          "X-Content-Type-Options": "custom",
        }),
        render: () => html`Gone`,
      }),
    ],
  });
  const response = await app.fetch(new Request("https://example.com/"), {}, {});

  assert.equal(response.status, 410);
  assert.equal(response.headers.get("cache-control"), "public, max-age=60");
  assert.equal(response.headers.get("x-content-type-options"), "custom");
});

test("404s render the notFound route with status 404", async () => {
  const app = createCloudflareHandler({
    shell,
    routes: [route("/", { render: () => html`Home` })],
  });
  const response = await app.fetch(new Request("https://example.com/missing"), {}, {});
  const body = await response.text();

  assert.equal(response.status, 404);
  assert.match(body, /Nothing rendered here/);
});
