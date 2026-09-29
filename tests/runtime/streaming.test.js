import assert from "node:assert/strict";
import test from "node:test";
import { get } from "node:http";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

test("workerd disconnects cancel deferred document and fragment work", { timeout: 10_000 }, async t => {
  const { outputFiles } = await build({
    stdin: { resolveDir: process.cwd(), contents: `
      import { createCloudflareHandler } from '@nativefragments/core/cloudflare';
      import { html, route, fragment } from '@nativefragments/core/server';
      // Test-only instrumentation; application request state stays scoped.
      const aborted = new Set();
      const slow = fragment('slow', { render: ({ signal, query }) => new Promise((_, reject) => {
        signal.addEventListener('abort', () => { aborted.add(query.get('id')); reject(signal.reason); }, { once: true });
      }) });
      const app = createCloudflareHandler({
        routes: [route('/', { render: ctx => html\`<h1>Ready</h1>\${ctx.defer(slow)}\` })],
        shell: ({ body }) => html\`<!doctype html><html><body><main>\${body}</main></body></html>\`,
      });
      export default { fetch(request, env, context) {
        if (new URL(request.url).pathname === '/aborted') return Response.json([...aborted]);
        return app.fetch(request, env, context);
      } };
    ` }, bundle: true, write: false, format: "esm", platform: "node",
  });
  const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: outputFiles[0].text, compatibilityDate: "2026-09-01", compatibilityFlags: ["enable_request_signal"], unsafeDirectSockets: [{ host: "127.0.0.1", port: 0 }] }));
  t.after(() => mf.dispose());
  for (const [id, headers] of [["document", {}], ["fragment", { "x-fragment": "true", "x-nativefragments-protocol": "2" }]]) {
    const address = new URL(await mf.unsafeGetDirectURL());
    address.searchParams.set("id", id);
    await new Promise((resolve, reject) => {
      const outgoing = get(address, { headers: { "accept-encoding": "identity", ...headers } }, response => {
        let initial = "";
        response.on("data", chunk => {
          initial += chunk.toString();
          // TCP reset models an observable lost connection; a FIN may remain
          // unnoticed by workerd while it awaits application I/O.
          if (initial.includes("Ready")) { response.socket.resetAndDestroy(); resolve(); }
        });
        response.on("error", error => { if (!initial.includes("Ready")) reject(error); });
      });
      outgoing.on("error", reject);
    });
    let observed = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      const aborted = await (await mf.dispatchFetch("https://example.test/aborted")).json();
      if (aborted.includes(id)) { observed = true; break; }
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.equal(observed, true, `${id} renderer should receive an aborted signal`);
  }
});
