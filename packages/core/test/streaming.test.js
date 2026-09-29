import assert from "node:assert/strict";
import test from "node:test";
import { createCloudflareHandler } from "../src/cloudflare/index.js";
import { fragment, html, renderRoute, route } from "../src/server/index.js";

const readStreamText = async (reader) => {
  const decoder = new TextDecoder();
  let output = "";

  while (true) {
    const chunk = await reader.read();
    if (chunk.done) return output;
    output += decoder.decode(chunk.value, { stream: true });
  }
};

const readUntil = async (reader, pattern) => {
  const decoder = new TextDecoder();
  let output = "";

  while (!pattern.test(output)) {
    const chunk = await reader.read();
    if (chunk.done) return output;
    output += decoder.decode(chunk.value, { stream: true });
  }

  return output;
};

const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <title>${meta.title}</title>
  </head>
  <body>
    <main id="content-slot">${body}</main>
  </body>
</html>`;

test("cancelling either response stream aborts deferred rendering", { timeout: 2000 }, async () => {
  for (const headers of [{}, { "x-fragment": "true", "x-nativefragments-protocol": "2" }]) {
    const cancelled = Promise.withResolvers();
    const slow = fragment("slow", { render: ({ signal }) => new Promise((_, reject) => {
      signal.addEventListener("abort", () => { cancelled.resolve(signal.aborted); reject(signal.reason); }, { once: true });
    }) });
    const app = createCloudflareHandler({ shell, routes: [route("/", { render: ctx => ctx.defer(slow) })] });
    const response = await app.fetch(new Request("https://example.com/", { headers }));
    const reader = response.body.getReader();
    await reader.read();
    await reader.cancel();
    assert.equal(await cancelled.promise, true);
  }
});

test("deferred identities differ across independent responses", async () => {
  const item = fragment("item", () => html`Ready`);
  const app = createCloudflareHandler({ shell, routes: [route("/", { render: ctx => ctx.defer(item) })] });
  const bodies = await Promise.all([1, 2].map(async () => (await app.fetch(new Request("https://example.com/"))).text()));
  const ids = bodies.map(body => /data-nativefragments-deferred="([^"]+)"/.exec(body)[1]);
  assert.notEqual(ids[0], ids[1]);
});

test("document responses stream loading boundaries before deferred fragments resolve", async () => {
  let release;
  const remoteData = new Promise((resolve) => {
    release = () => resolve("Curator note ready");
  });

  const curatorNote = fragment("curator-note", {
    loading: () => html`<p class="loading">Reading the archive...</p>`,
    render: async () => html`<article><h2>${await remoteData}</h2></article>`,
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        meta: () => ({ title: "Streaming Gallery" }),
        render: (context) => html`<section>
          <h1>Open gallery</h1>
          ${context.defer(curatorNote, { class: "note-slot" })}
        </section>`,
        fragments: [curatorNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const reader = response.body.getReader();
  const firstText = await readUntil(reader, /Reading the archive/);

  assert.equal(response.status, 200);
  assert.match(firstText, /<!doctype html>/);
  assert.match(firstText, /Open gallery/);
  assert.match(firstText, /Reading the archive/);
  assert.match(firstText, /data-fragment-state="loading"/);
  assert.doesNotMatch(firstText, /Curator note ready/);

  release();
  const rest = await readStreamText(reader);

  assert.match(rest, /Curator note ready/);
  assert.match(rest, /data-nativefragments-deferred-bootstrap/);
  assert.match(rest, /data-nativefragments-deferred-content="nf-curator-note-1-[a-f0-9-]+"/);
  assert.match(rest, /data-fragment-state="ready"/);
  assert.doesNotMatch(rest, /<template data-nativefragments-deferred-fragment/);
  assert.match(rest, /<\/html>/);
});

test("older fragment clients receive a completed buffered fragment", async () => {
  const curatorNote = fragment("curator-note", {
    loading: () => html`<p>Loading...</p>`,
    render: async () => html`<article><h2>Fragment response ready</h2></article>`,
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        meta: () => ({ title: "Streaming Gallery" }),
        render: (context) => html`${context.defer(curatorNote)}`,
        fragments: [curatorNote],
      }),
    ],
  });

  const response = await app.fetch(
    new Request("https://example.com/", {
      headers: {
        "x-fragment": "true",
        "x-fragment-slot": "curator-note",
      },
    }),
    {},
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-NativeFragments-Protocol"), null);
  assert.equal(response.headers.get("X-NativeFragments-Stream"), null);
  assert.match(body, /Fragment response ready/);
  assert.match(body, /data-fragment-meta/);
  assert.doesNotMatch(body, /Loading/);
  assert.doesNotMatch(body, /<!doctype html>/);
});

test("unknown protocol versions fall back to completed buffered fragments", async () => {
  const detail = fragment("detail", {
    loading: () => html`<p>Loading...</p>`,
    render: async () => html`<p>Completed safely</p>`,
  });
  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(detail)}`,
        fragments: [detail],
      }),
    ],
  });
  const response = await app.fetch(new Request("https://example.com/", {
    headers: {
      "x-fragment": "true",
      "x-nativefragments-protocol": "99",
    },
  }), {}, {});
  const body = await response.text();

  assert.equal(response.headers.get("X-NativeFragments-Protocol"), null);
  assert.equal(response.headers.get("X-NativeFragments-Stream"), null);
  assert.match(body, /Completed safely/);
  assert.doesNotMatch(body, /Loading/);
});

test("default fragment navigation streams loading boundaries and deferred content", async () => {
  let release;
  const remoteData = new Promise((resolve) => {
    release = () => resolve("Deferred page content ready");
  });
  const curatorNote = fragment("curator-note", {
    loading: () => html`<p>Loading deferred page content...</p>`,
    render: async () => html`<article><h2>${await remoteData}</h2></article>`,
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        meta: () => ({ title: "Streaming Gallery" }),
        render: (context) => html`<section>
          <h1>Open gallery</h1>
          ${context.defer(curatorNote)}
        </section>`,
        fragments: [curatorNote],
      }),
    ],
  });

  let responseSettled = false;
  const responsePromise = app.fetch(
    new Request("https://example.com/", {
      headers: {
        "x-fragment": "true",
        "x-nativefragments-protocol": "2",
      },
    }),
    {},
    {},
  ).then((response) => {
    responseSettled = true;
    return response;
  });
  await new Promise((resolve) => setImmediate(resolve));
  const returnedBeforeDeferred = responseSettled;
  if (!returnedBeforeDeferred) release();

  const response = await responsePromise;
  const reader = response.body.getReader();
  const firstText = await readUntil(reader, /Loading deferred page content/);

  assert.equal(returnedBeforeDeferred, true);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-NativeFragments-Protocol"), "2");
  assert.ok(response.headers.get("X-NativeFragments-Stream"));
  assert.match(firstText, /Open gallery/);
  assert.match(firstText, /Loading deferred page content/);
  assert.match(firstText, /data-fragment-meta/);
  assert.doesNotMatch(firstText, /Deferred page content ready/);
  assert.doesNotMatch(firstText, /<!doctype html>/i);

  release();
  const rest = await readStreamText(reader);

  assert.match(rest, /Deferred page content ready/);
  assert.match(rest, /data-nativefragments-deferred-content/);
  assert.match(rest, /nativefragments-stream-[A-Za-z0-9_-]+-end-->/);
  assert.doesNotMatch(rest, /<!doctype html>/i);
});

test("deferred fragment errors render an error boundary chunk", async () => {
  const failingNote = fragment("failing-note", {
    loading: () => html`<p>Loading...</p>`,
    error: () => html`<p role="status">Archive temporarily unavailable.</p>`,
    render: async () => {
      throw new Error("Remote API failed");
    },
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(failingNote)}`,
        fragments: [failingNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Archive temporarily unavailable/);
  assert.match(body, /data-nativefragments-deferred-content="nf-failing-note-1-[a-f0-9-]+"/);
  assert.match(body, /data-fragment-state="error"/);
});

test("deferred fragments time out to their error boundary", async () => {
  const slowNote = fragment("slow-note", {
    timeout: 1,
    loading: () => html`<p>Still loading...</p>`,
    error: () => html`<p role="status">Archive request timed out.</p>`,
    render: () => new Promise(() => {}),
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(slowNote)}`,
        fragments: [slowNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(body, /Archive request timed out/);
  assert.match(body, /data-fragment-state="error"/);
});

test("streamed deferred bootstrap uses the CSP nonce from the adapter", async () => {
  const curatorNote = fragment("curator-note", {
    loading: () => html`<p>Loading...</p>`,
    render: async () => html`<article><h2>Nonce protected</h2></article>`,
  });

  const app = createCloudflareHandler({
    contentSecurityPolicy: ({ nonce }) => `script-src 'self' 'nonce-${nonce}'`,
    shell,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(curatorNote)}`,
        fragments: [curatorNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const body = await response.text();
  const csp = response.headers.get("Content-Security-Policy");
  const nonce = body.match(/<script nonce="([^"]+)" data-nativefragments-deferred-bootstrap>/)?.[1];

  assert.ok(nonce);
  assert.equal(csp, `script-src 'self' 'nonce-${nonce}'`);
  assert.match(body, /Nonce protected/);
  assert.doesNotMatch(body, /data-fragment-manifest/);
});

test("the default loading boundary announces via its content, not the slot wrapper", async () => {
  let release;
  const pending = new Promise((resolve) => {
    release = () => resolve();
  });
  const curatorNote = fragment("curator-note", {
    render: async () => {
      await pending;
      return html`<article>Done</article>`;
    },
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(curatorNote)}`,
        fragments: [curatorNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const reader = response.body.getReader();
  const firstText = await readUntil(reader, /data-fragment-loading/);
  const wrapper = firstText.match(/<section[^>]*data-nativefragments-deferred="nf-curator-note-1-[a-f0-9-]+"[^>]*>/)?.[0];

  assert.ok(wrapper);
  assert.match(wrapper, /aria-busy="true"/);
  assert.doesNotMatch(wrapper, /role=/);
  assert.match(firstText, /<div data-fragment-loading role="status">/);

  release();
  await readStreamText(reader);
});

test("deferred renderers start as soon as defer() collects them", async () => {
  let started = false;
  const note = fragment("note", {
    render: async () => {
      started = true;
      return html`<p>Started</p>`;
    },
  });
  const match = route("/", {
    render: (context) => html`${context.defer(note)}`,
    fragments: [note],
  });

  const rendered = await renderRoute({
    match,
    request: new Request("https://example.com/"),
  });

  assert.equal(rendered.deferred.length, 1);
  assert.equal(started, true);
});

test("a shell without a body insertion point warns and buffers deferred content", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const curatorNote = fragment("curator-note", {
    render: async () => html`<article>Buffered fallback content</article>`,
  });
  const shellWithoutStableBodyMarker = ({ body, meta }) => {
    const safeBody =
      body && String(body).includes("nativefragments-body-") ? "" : body;
    return html`<!doctype html>
<html lang="en">
  <head>
    <title>${meta.title}</title>
  </head>
  <body>${safeBody ?? ""}</body>
</html>`;
  };

  const app = createCloudflareHandler({
    shell: shellWithoutStableBodyMarker,
    routes: [
      route("/", {
        render: (context) => html`${context.defer(curatorNote)}`,
        fragments: [curatorNote],
      }),
    ],
  });

  const response = await app.fetch(new Request("https://example.com/"), {}, {});
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /buffered instead of streamed/);
  assert.match(body, /Buffered fallback content/);
});

test("dropping the defer() boundary warns and omits its resolved content", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const curatorNote = fragment("curator-note", {
    render: async () => html`<article>Never placed</article>`,
  });

  const app = createCloudflareHandler({
    shell,
    routes: [
      route("/", {
        render: (context) => {
          context.defer(curatorNote);
          return html`<p>No boundary in output</p>`;
        },
        fragments: [curatorNote],
      }),
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
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /"curator-note".*not found in the rendered body/);
  assert.match(body, /No boundary in output/);
  assert.doesNotMatch(body, /Never placed/);
});
