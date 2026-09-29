import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
import { html as litHtml } from "lit";
import { renderLit } from "@nativefragments/lit/server";
import { createNodeHandler } from "@nativefragments/create-app/http";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { fragment, html, raw, route } from "@nativefragments/core/server";
// Match Wrangler's keepNames transform: emitted inline scripts must not capture
// any bundler helpers from the server module's surrounding scope.
const bootstrapBundle = await build({
  stdin: { contents: 'export { deferredFragmentBootstrap } from "./packages/core/src/server/defer.js";', resolveDir: process.cwd() },
  bundle: true, write: false, minify: true, keepNames: true, format: "esm", platform: "node",
});
const { deferredFragmentBootstrap } = await import(`data:text/javascript;base64,${Buffer.from(bootstrapBundle.outputFiles[0].contents).toString("base64")}`);
import "./island.js";

const { outputFiles } = await build({ entryPoints: ["tests/browser/island.js"], bundle: true, write: false, format: "esm", platform: "browser" });
const islandBundle = outputFiles[0].contents;
const gates = new Map();
const gate = (id) => {
  if (!gates.has(id)) gates.set(id, Promise.withResolvers());
  return gates.get(id);
};
const client = html`<script type="module" async>
  import { startRouter } from "/nativefragments/router.js";
  window.events = [];
  for (const name of ["navigation-start", "navigation-swap", "navigation-complete", "navigation-abort", "navigation-error", "fragment-reveal"]) {
    document.addEventListener("nativefragments:" + name, e => window.events.push({ name, url: e.detail.url.href, state: e.detail.state }));
  }
  const start = () => {
    if (!document.getElementById("content-slot")) return false;
    window.lifetime = new AbortController();
    window.router = startRouter({ prefetch: "none", viewTransitions: true, signal: window.lifetime.signal });
    return true;
  };
  if (!start()) {
    const observer = new MutationObserver(() => { if (start()) observer.disconnect(); });
    observer.observe(document.documentElement, { subtree: true, childList: true });
  }
</script><script type="module" src="/island.js"></script>`;
const shell = ({ body, meta }) => {
  const before = html`<!doctype html><html><head><meta charset="utf-8"><title>${meta.title ?? "Fixture"}</title>${client}</head><body><a href="/plain">Plain</a><main id="content-slot">`;
  const after = html`</main></body></html>`;
  return body === undefined ? { before, after } : html`${before}${body}${after}`;
};
const island = () => renderLit(litHtml`<test-island></test-island>`);
const slow = fragment("result", {
  loading: () => html`<p id="loading">Loading</p>`,
  render: async ({ query, signal }) => {
    if (query.has("gate")) {
      await Promise.race([gate(query.get("gate")).promise, new Promise((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }))]);
    }
    return html`<p id="result">Result ${query.get("value") ?? "stream"}</p>${await island()}`;
  },
});
const routes = [
  route("/", { render: () => html`<h1>Home</h1>` }),
  route("/plain", { render: () => html`<h1>Plain</h1><div style="height:1000px"></div><h2 id="anchor">Anchor</h2>` }),
  route("/stream", { render: ctx => html`<h1>Stream</h1>${ctx.defer(slow)}`, fragments: [slow] }),
  route("/island", { render: island }),
  route("/settings", { render: () => html`<h1>Settings</h1><a href="/settings/profile" data-fragment-slot="panel">Profile link before target</a><section data-fragment-slot="panel">Initial</section><section data-fragment-slot="other">Other initial</section>` }),
  route("/settings/:name", {
    render: ({ params }) => html`<h1>Settings</h1><section data-fragment-slot="panel">${params.name}</section>`,
    fragments: {
      panel: ({ params }) => html`<b>${params.name}</b>`,
      other: ({ params }) => html`<b>${params.name}</b>`,
    },
  }),
  route("/cookie", { render: () => new Response(null, { status: 302, headers: { Location: "/session#signed-in", "Set-Cookie": "fixture_session=alice; HttpOnly; Path=/; SameSite=Lax" } }) }),
  route("/session", { render: ({ request }) => html`<h1 id="signed-in">${request.headers.get("cookie") ?? "missing"}</h1>` }),
];
const app = createCloudflareHandler({ routes, shell });
const encoder = new TextEncoder();
const fetchFixture = async request => {
  const url = new URL(request.url);
  if (url.pathname === "/health") return new Response("OK");
  if (url.pathname === "/control/release") { gate(url.searchParams.get("gate")).resolve(); return new Response("released"); }
  if (url.pathname === "/island.js") return new Response(islandBundle, { headers: { "content-type": "text/javascript" } });
  if (/^\/nativefragments\/[a-z-]+\.js$/.test(url.pathname)) {
    return new Response(await readFile(new URL(`../../packages/core/client/${url.pathname.split("/").at(-1)}`, import.meta.url)), { headers: { "content-type": "text/javascript" } });
  }
  if (url.pathname === "/split-document") {
    const markup = String(html`<!doctype html><html><body><main id="content-slot"><section data-nativefragments-deferred="split" data-fragment-state="loading">Loading</section></main>${raw(String(deferredFragmentBootstrap()))}<div hidden data-nativefragments-deferred-content="split" data-fragment-state="ready">`);
    return new Response(new ReadableStream({ async start(controller) {
      controller.enqueue(encoder.encode(markup));
      await gate(url.searchParams.get("gate")).promise;
      controller.enqueue(encoder.encode('<span id="first">First</span>'));
      await new Promise(resolve => setTimeout(resolve, 20));
      controller.enqueue(encoder.encode('<span id="last">Last</span></div><template data-nativefragments-deferred-complete="split"></template><template data-nativefragments-stream-complete></template></body></html>'));
      controller.close();
    } }), { headers: { "content-type": "text/html" } });
  }
  return app.fetch(request, {}, { waitUntil() {} });
};
createServer(createNodeHandler(fetchFixture)).listen(8921, "127.0.0.1");
