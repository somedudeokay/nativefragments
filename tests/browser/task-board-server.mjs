import { readFile } from "node:fs/promises";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { createServer } from "node:http";
import { createNodeHandler } from "@nativefragments/create-app/http";

const root = new URL("../../apps/task-board/", import.meta.url);
const mf = new Miniflare(convertV4MiniflareOptions({
  modules: true, scriptPath: new URL(".nativefragments/worker.js", root).pathname,
  compatibilityDate: "2026-09-01", compatibilityFlags: ["nodejs_compat"], d1Databases: ["DB"],
}));
const db = await mf.getD1Database("DB");
const sql = await readFile(new URL("migrations/0001_workspace.sql", root), "utf8");
await db.batch(sql.split(";").map(s => s.trim()).filter(Boolean).map(s => db.prepare(s)));
const server = createServer(createNodeHandler(async request => {
  const url = new URL(request.url);
  if (url.pathname === "/health") return new Response("OK");
  if (["/build/client.js", "/app/styles.css"].includes(url.pathname)) {
    return new Response(await readFile(new URL(`public${url.pathname}`, root)), {
      headers: { "Content-Type": url.pathname.endsWith(".js") ? "text/javascript" : "text/css" },
    });
  }
  return mf.dispatchFetch(request.url, {
    method: request.method, headers: request.headers, redirect: "manual",
    ...(request.body ? { body: await request.arrayBuffer() } : {}),
  });
}));
server.listen(8922, "127.0.0.1");
const stop = async () => { server.close(); await mf.dispose(); process.exit(); };
process.once("SIGTERM", stop);
process.once("SIGINT", stop);
