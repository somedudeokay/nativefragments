import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

test("real Workers/D1 isolate users, enforce CSRF, persist mutations and revoke sessions", async t => {
  const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, scriptPath: ".nativefragments/worker.js", compatibilityDate: "2026-09-01", compatibilityFlags: ["nodejs_compat"], d1Databases: ["DB"] }));
  t.after(() => mf.dispose());
  const db = await mf.getD1Database("DB");
  const sql = await readFile("migrations/0001_workspace.sql", "utf8");
  await db.batch(sql.split(";").map(s => s.trim()).filter(Boolean).map(s => db.prepare(s)));
  const send = (path, cookie, form, origin = "https://example.test") => mf.dispatchFetch(`https://example.test${path}`, {
    method: form !== undefined ? "POST" : "GET", redirect: "manual",
    headers: { ...(cookie ? { cookie } : {}), ...(form !== undefined ? { origin, "content-type": "application/x-www-form-urlencoded" } : {}) },
    ...(form !== undefined ? { body: new URLSearchParams(form).toString() } : {}),
  });
  const a = await send("/signup", null, {});
  const cookieA = a.headers.get("set-cookie").split(";")[0];
  const recovery = /id="recovery-key">([^<]+)/.exec(await a.text())[1];
  const b = await send("/signup", null, {});
  const cookieB = b.headers.get("set-cookie").split(";")[0];
  assert.equal(a.status, 201);
  assert.equal((await send("/tasks", cookieA, { title: "Private task" })).status, 303);
  const tasks = await (await send("/api/tasks", cookieA)).json();
  assert.equal(tasks.length, 1);
  assert.deepEqual(await (await send("/api/tasks", cookieB)).json(), []);
  assert.equal((await send(`/tasks/${tasks[0].id}/toggle`, cookieB, {})).status, 404);
  assert.equal((await send(`/tasks/${tasks[0].id}/toggle`, cookieA, {}, "https://attacker.test")).status, 403);
  assert.equal((await send(`/tasks/${tasks[0].id}/toggle`, cookieA, {})).status, 303);
  assert.equal((await (await send("/api/tasks", cookieA)).json())[0].done, 1);
  assert.equal((await send("/logout", cookieA, {})).status, 303);
  assert.equal((await send("/api/tasks", cookieA)).status, 401);
  const login = await send("/login", null, { key: recovery });
  assert.equal(login.status, 303);
  const freshCookie = login.headers.get("set-cookie").split(";")[0];
  assert.notEqual(freshCookie, cookieA);
  assert.equal((await (await send("/api/tasks", freshCookie)).json()).length, 1);
  assert.equal((await send(`/tasks/${tasks[0].id}/delete`, freshCookie, {})).status, 303);
  assert.deepEqual(await (await send("/api/tasks", freshCookie)).json(), []);
  const hashes = await db.prepare("SELECT recovery_hash FROM workspaces").all();
  assert.ok(hashes.results.every(row => row.recovery_hash !== recovery));
});
