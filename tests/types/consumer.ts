import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { apiRoute, fragment, html, route } from "@nativefragments/core/server";
import { startRouter } from "@nativefragments/core/client/router.js";
import { createWorkerClient } from "@nativefragments/core/client/worker.js";
import { renderLit } from "@nativefragments/lit/server";
import { html as litHtml } from "lit";

const summary = fragment("summary", { render: ({ locals, env, signal }) => {
  signal.throwIfAborted();
  return html`${String(locals.user)} ${String(env.name)}`;
} });
const app = createCloudflareHandler({
  prepare: ({ env, context }) => ({ user: env.USER, runtime: context }),
  routes: [route("/", {
    render: ctx => html`${ctx.defer(summary)}`,
    headers: ({ locals }) => ({ "Cache-Control": locals.user ? "private, no-store" : "max-age=10" }),
    action: async ({ request }) => { await request.formData(); return Response.redirect("https://example.com/"); },
    fragments: [summary],
  })],
  api: [apiRoute("GET", "/api/user", ({ locals }) => Response.json(locals.user))],
  shell: ({ body, meta }) => html`<title>${String(meta)}</title><main>${body}</main>`,
  onError: async ({ phase }) => { console.error(phase); },
});
void app.fetch(new Request("https://example.com"), { USER: "alice" }, { waitUntil() {} });
const router = startRouter({ cacheMaxEntries: 10, cacheMaxBytes: 1024, signal: new AbortController().signal });
void router.navigate("/", { slot: "summary", history: "replace" });
router.invalidate("/", { slot: "summary" });
void renderLit(litHtml`<p>SSR</p>`);
const worker = createWorkerClient(new Worker("worker.js"));
worker.dispose();
// @ts-expect-error History modes are deliberately finite.
void router.navigate("/", { history: "append" });
