import { apiRoute, fragment, html, redirect, route } from "@nativefragments/core/server";
import { digest, newSession, readForm, requireWorkspace, sessionCookie, token, validRecoveryKey } from "./auth.js";
import { shell } from "./shell.js";

const privateHeaders = { "Cache-Control": "private, no-store", "Referrer-Policy": "same-origin" };
const page = (path, definition) => route(path, { headers: privateHeaders, ...definition });
const redirectWith = (location, cookie) => new Response(null, { status: 303, headers: { ...privateHeaders, Location: location, "Set-Cookie": cookie } });
const rateLimit = async ({ env, request }) => {
  const key = request.headers.get("cf-connecting-ip") ?? "local";
  if (env.AUTH_LIMITER && !(await env.AUTH_LIMITER.limit({ key })).success) throw new Response("Please wait a minute before trying again.", { status: 429 });
};
const login = () => html`<section class="welcome"><p class="eyebrow">A little room to get things done</p><h1>Your work.<br>Your workspace.</h1><p class="intro">Keep a short list, finish what matters, and pick it up again later.</p>
  <div class="entry-options"><form action="/signup" method="post"><h2>Start fresh</h2><p>Create a private workspace. You’ll get a recovery key to reopen it on another device.</p><button>Create workspace <span aria-hidden="true">↗</span></button></form>
  <form action="/login" method="post"><h2>Pick up where you left off</h2><label for="key">Recovery key</label><input id="key" name="key" type="password" required minlength="43" maxlength="43" autocomplete="off"><button class="secondary">Open workspace</button></form></div></section>`;
const tasks = fragment("tasks", async scope => {
  const workspace = requireWorkspace(scope);
  const filter = scope.params.filter === "done" ? "done" : scope.params.filter === "open" ? "open" : "all";
  const condition = filter === "all" ? "" : ` AND done = ${filter === "done" ? 1 : 0}`;
  const { results } = await scope.env.DB.prepare(`SELECT id, title, done FROM tasks WHERE workspace_id = ?${condition} ORDER BY created_at DESC, id DESC LIMIT 100`).bind(workspace).all();
  return html`<div class="task-list">${results.length ? results.map(task => html`<article class="task" data-task-id="${task.id}" data-done="${task.done}">
    <form action="/tasks/${task.id}/toggle" method="post" data-task-form><button class="check" aria-label="${task.done ? "Reopen" : "Complete"} ${task.title}">${task.done ? "✓" : "○"}</button></form><span class="task-title">${task.title}</span>
    <form action="/tasks/${task.id}/delete" method="post" data-task-form><button class="remove" aria-label="Delete ${task.title}">×</button></form></article>`) : html`<p class="empty">Nothing here yet. Add a task above to get started.</p>`}</div>`;
});
const summary = fragment("summary", {
  loading: () => html`<p>Counting your tasks…</p>`,
  render: async scope => {
    const workspace = requireWorkspace(scope);
    const row = await scope.env.DB.prepare("SELECT count(*) AS total, coalesce(sum(done),0) AS done FROM tasks WHERE workspace_id = ?").bind(workspace).first();
    return html`<p class="summary"><b>${row.done}</b> of ${row.total} tasks complete</p>`;
  },
});
const workspace = async scope => {
  if (!scope.locals.workspace) return redirect("/login");
  return html`<section class="workspace"><aside><p class="eyebrow">Your workspace</p><h1>Make room<br>for progress.</h1>${scope.defer(summary)}<form action="/logout" method="post"><button class="text-button">Sign out</button></form></aside>
  <div class="workspace-main"><form action="/tasks" method="post" data-task-form class="add-task"><label for="title">What needs doing?</label><div><input id="title" name="title" required maxlength="200" placeholder="Write the next small step" autocomplete="off"><button>Add task</button></div></form><p id="form-status" role="status"></p>
  <nav class="filters" aria-label="Filter tasks">${["all", "open", "done"].map(filter => html`<a href="/workspace/${filter}"${tasks.attrs()}>${filter === "all" ? "Everything" : filter === "open" ? "To do" : "Done"}</a>`)}</nav>
  <section${tasks.attrs()} aria-label="Tasks">${await tasks.render(scope)}</section></div></section>`;
};
const mutationResult = request => request.headers.get("accept")?.includes("application/json")
  ? Response.json({ ok: true }, { headers: privateHeaders }) : redirect("/workspace", 303);
export const routes = [
  page("/", { render: () => redirect("/workspace") }),
  page("/login", { render: login, action: async scope => {
    const form = await readForm(scope); await rateLimit(scope);
    const key = form.get("key");
    const found = validRecoveryKey(key) && await scope.env.DB.prepare("SELECT id FROM workspaces WHERE recovery_hash = ?").bind(await digest(key)).first();
    if (!found) return new Response("Recovery key not recognized. Go back and try again.", { status: 401, headers: privateHeaders });
    return redirectWith("/workspace", await newSession(scope.env, found.id, scope.request));
  } }),
  page("/signup", { render: () => redirect("/login"), action: async scope => {
    await readForm(scope); await rateLimit(scope);
    const key = token(); const id = crypto.randomUUID();
    await scope.env.DB.prepare("INSERT INTO workspaces(id, recovery_hash, created_at) VALUES (?, ?, ?)").bind(id, await digest(key), Date.now()).run();
    const cookie = await newSession(scope.env, id, scope.request);
    const body = html`<section class="welcome"><p class="eyebrow">Your workspace is ready</p><h1>Keep your key.</h1><p class="intro">Save this recovery key somewhere private. Anyone with it can open your workspace. We show it only now.</p><code class="recovery-key" id="recovery-key">${key}</code><a class="button" href="/workspace">Go to my tasks →</a></section>`;
    return new Response(String(shell({ body, meta: { title: "Save your recovery key" } })), { status: 201, headers: { ...privateHeaders, "Content-Type": "text/html; charset=utf-8", "Set-Cookie": cookie } });
  } }),
  page("/logout", { render: () => redirect("/login"), action: async scope => {
    await readForm(scope);
    if (scope.locals.sessionHash) await scope.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(scope.locals.sessionHash).run();
    return redirectWith("/login", sessionCookie("", scope.request, 0));
  } }),
  page("/workspace", { render: workspace, fragments: [tasks, summary] }),
  page("/workspace/:filter", { render: workspace, fragments: [tasks, summary] }),
  page("/tasks", { render: () => redirect("/workspace"), action: async scope => {
    const id = requireWorkspace(scope); const form = await readForm(scope); const title = form.get("title")?.trim();
    if (!title || title.length > 200) return new Response("Use a task title between 1 and 200 characters.", { status: 400 });
    const result = await scope.env.DB.prepare("INSERT INTO tasks(id, workspace_id, title, created_at) SELECT ?, ?, ?, ? WHERE (SELECT count(*) FROM tasks WHERE workspace_id = ?) < 100").bind(crypto.randomUUID(), id, title, Date.now(), id).run();
    if (!result.meta.changes) return new Response("This workspace has 100 tasks. Delete a task to make room.", { status: 409 });
    return mutationResult(scope.request);
  } }),
  ...["toggle", "delete"].map(operation => page(`/tasks/:id/${operation}`, { render: () => redirect("/workspace"), action: async scope => {
    const id = requireWorkspace(scope); await readForm(scope);
    const sql = operation === "delete" ? "DELETE FROM tasks WHERE id = ? AND workspace_id = ?" : "UPDATE tasks SET done = 1 - done WHERE id = ? AND workspace_id = ?";
    const result = await scope.env.DB.prepare(sql).bind(scope.params.id, id).run();
    if (!result.meta.changes) return new Response("Task not found", { status: 404 });
    return mutationResult(scope.request);
  } })),
];
export const api = [apiRoute("GET", "/api/tasks", async scope => {
  const workspace = requireWorkspace(scope);
  const { results } = await scope.env.DB.prepare("SELECT id, title, done FROM tasks WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 100").bind(workspace).all();
  return Response.json(results, { headers: privateHeaders });
})];
