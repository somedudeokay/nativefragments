import assert from "node:assert/strict";
import test from "node:test";
import { createFragmentLoader } from "../client/fragment-loader.js";

const origin = "https://example.com";
const url = (path) => new URL(path, origin);
const ttl = 30_000;

test("stream framing survives every byte split, including Unicode", async t => {
  const bytes = new TextEncoder().encode("<!--nativefragments-stream-test--><p>æ💙</p><!--nativefragments-stream-test--><b>done</b><!--nativefragments-stream-test--><!--nativefragments-stream-test-end-->");
  for (let split = 1; split < bytes.length; split++) {
    t.mock.method(globalThis, "fetch", async () => new Response(new ReadableStream({ start(controller) {
      controller.enqueue(bytes.slice(0, split)); controller.enqueue(bytes.slice(split)); controller.close();
    } }), { headers: { "content-type": "text/html", "x-nativefragments-stream": "test" } }));
    const frames = [];
    const result = await createFragmentLoader().consume({ url: url("/split"), ttl: 0, onFrame: frame => frames.push(frame.html) });
    assert.deepEqual(frames, ["<p>æ💙</p>", "<b>done</b>"], `split ${split}`);
    assert.equal(result.html, frames.join(""));
  }
});

test("truncated streams reject and never populate cache", async t => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    return new Response("<!--nativefragments-stream-test--><p>incomplete", { headers: { "content-type": "text/html", "x-nativefragments-stream": "test" } });
  });
  const loader = createFragmentLoader();
  for (let i = 0; i < 2; i++) await assert.rejects(loader.prefetch({ url: url("/truncated"), ttl }), /final boundary/);
  assert.equal(requests, 2);
});

test("slow consumers do not block transport or independent subscribers", async t => {
  const slow = Promise.withResolvers();
  t.mock.method(globalThis, "fetch", async () => new Response("<p>shared</p>", { headers: { "content-type": "text/html" } }));
  const loader = createFragmentLoader();
  const first = loader.consume({ url: url("/shared"), ttl, onFrame: () => slow.promise });
  const second = await loader.consume({ url: url("/shared"), ttl, onFrame() {} });
  assert.equal(second.html, "<p>shared</p>");
  slow.resolve();
  await first;
  loader.invalidate();
});

const setup = (t, responseHeaders = {}) => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return new Response(`<p>Version ${requests}</p>`, {
      headers: { "content-type": "text/html", ...responseHeaders },
    });
  });
  const loader = createFragmentLoader();
  return { loader, requests: () => requests };
};

test("cached navigation rejects an already-aborted consumer without applying HTML", async (t) => {
  const { loader, requests } = setup(t);
  await loader.prefetch({ url: url("/page"), ttl });
  let applied = false;
  await assert.rejects(loader.consume({
    url: url("/page"), ttl, signal: AbortSignal.abort(),
    onFrame: () => { applied = true; },
  }), { name: "AbortError" });
  assert.equal(applied, false);
  await assert.rejects(loader.prefetch({
    url: url("/page"), ttl, signal: AbortSignal.abort(),
  }), { name: "AbortError" });
  assert.equal(requests(), 1);
});

test("cached HTML uses each consumer's hash, including no hash", async (t) => {
  const { loader, requests } = setup(t);
  await loader.prefetch({ url: url("/page#first"), ttl });
  for (const path of ["/page#second", "/page"]) {
    const result = await loader.consume({
      url: url(path), ttl,
      onFrame: (frame) => assert.equal(frame.url.href, url(path).href),
    });
    assert.equal(result.url.href, url(path).href);
  }
  assert.equal(requests(), 1);
});

test("consumers sharing one request keep independent hashes", async (t) => {
  const { loader, requests } = setup(t);
  await Promise.all(["/page#first", "/page#second"].map(async (path) => {
    const result = await loader.consume({
      url: url(path), ttl,
      onFrame: (frame) => assert.equal(frame.url.href, url(path).href),
    });
    assert.equal(result.url.href, url(path).href);
  }));
  assert.equal(requests(), 1);
});

test("redirect cache preserves the redirect hash without imposing it on the destination", async (t) => {
  const { loader, requests } = setup(t, { "x-nativefragments-url": `${origin}/final#done` });
  await loader.prefetch({ url: url("/source"), ttl });
  for (const [path, destination] of [["/source", "/final#done"], ["/final#other", "/final#other"]]) {
    const result = await loader.consume({
      url: url(path), ttl,
      onFrame: (frame) => assert.equal(frame.url.href, url(destination).href),
    });
    assert.equal(result.url.href, url(destination).href);
  }
  assert.equal(requests(), 1);
});

test("invalidating a request during frame delivery prevents stale cache resurrection", async (t) => {
  const { loader, requests } = setup(t);
  const entered = Promise.withResolvers();
  const released = Promise.withResolvers();
  const first = loader.consume({
    url: url("/page"), ttl,
    onFrame: async () => { entered.resolve(); await released.promise; },
  });
  await entered.promise;
  const cancelled = assert.rejects(first, { name: "AbortError" });
  loader.invalidate(url("/page"));
  released.resolve();
  await cancelled;
  const second = await loader.consume({ url: url("/page"), ttl, onFrame: () => {} });
  assert.equal(requests(), 2);
  assert.match(second.html, /Version 2/);
});

test("no-store, no-cache and expired max-age responses are not replayed", async (t) => {
  for (const policy of ["private, no-store", "no-cache", "max-age=0"]) {
    const { loader, requests } = setup(t, { "cache-control": policy });
    await loader.prefetch({ url: url("/page"), ttl });
    await loader.consume({ url: url("/page"), ttl, onFrame() {} });
    assert.equal(requests(), 2, policy);
    loader.invalidate();
  }
});

test("cache evicts the least recently used response and respects a byte limit", async (t) => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    return new Response("small", { headers: { "content-type": "text/html" } });
  });
  const loader = createFragmentLoader({ maxEntries: 2, maxBytes: 10 });
  for (const path of ["/a", "/b", "/a", "/c", "/b"]) await loader.prefetch({ url: url(path), ttl });
  assert.equal(requests, 4);
  loader.invalidate();
  const tiny = createFragmentLoader({ maxBytes: 2 });
  await tiny.prefetch({ url: url("/a"), ttl });
  await tiny.prefetch({ url: url("/a"), ttl });
  assert.equal(requests, 6);
});

test("invalidating a redirect destination evicts its source alias", async (t) => {
  const { loader, requests } = setup(t, { "x-nativefragments-url": `${origin}/final` });
  await loader.prefetch({ url: url("/source"), ttl });
  loader.invalidate(url("/final"));
  await loader.prefetch({ url: url("/source"), ttl });
  assert.equal(requests(), 2);
  loader.invalidate();
});

test("expired entries are evicted and HTTP max-age caps the router TTL", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 1000 });
  const { loader, requests } = setup(t, { "cache-control": "max-age=2", age: "1" });
  await loader.prefetch({ url: url("/page"), ttl });
  t.mock.timers.tick(1001);
  await loader.prefetch({ url: url("/page"), ttl });
  assert.equal(requests(), 2);
  loader.invalidate();
});
