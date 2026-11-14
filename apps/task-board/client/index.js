import { startRouter } from "@nativefragments/core/client/router.js";
const router = startRouter({ prefetch: "none" });
const pending = new WeakSet();
const announce = (message, state = "ok") => {
  const status = document.getElementById("form-status");
  if (!status) return;
  status.dataset.state = state;
  status.textContent = message;
};
// Describe the mutation before the DOM changes, so focus and the announcement
// can be restored once only the affected fragments have re-rendered.
const describe = (form, button) => {
  const match = /\/tasks\/([^/]+)\/(toggle|delete)$/.exec(new URL(form.action).pathname);
  if (!match) return { kind: "add", title: new FormData(form).get("title")?.toString().trim() ?? "" };
  const row = form.closest(".task");
  const neighbour = row?.nextElementSibling ?? row?.previousElementSibling;
  return {
    kind: match[2], id: match[1], neighbour: neighbour?.dataset.taskId,
    title: row?.querySelector(".task-title")?.textContent ?? "",
    wasDone: row?.dataset.done === "1", control: button?.className,
  };
};
const check = id => id ? document.querySelector(`.task[data-task-id="${CSS.escape(id)}"] .check`) : null;
const settle = action => {
  const title = document.getElementById("title");
  if (action.kind === "add") {
    announce(`Added “${action.title}”.`);
    title?.focus();
  } else if (action.kind === "toggle") {
    announce(action.wasDone ? `Reopened “${action.title}”.` : `Marked “${action.title}” done.`);
    (check(action.id) ?? check(action.neighbour) ?? title)?.focus();
  } else {
    announce(`Deleted “${action.title}”.`);
    (check(action.neighbour) ?? title)?.focus();
  }
};
document.addEventListener("submit", async event => {
  const form = event.target.closest("form[data-task-form]");
  if (!form || event.defaultPrevented) return;
  event.preventDefault();
  if (pending.has(form)) return;
  pending.add(form);
  const button = event.submitter;
  // aria-disabled keeps keyboard focus on the button; `disabled` would drop it to <body>.
  button?.setAttribute("aria-disabled", "true");
  const action = describe(form, button);
  try {
    const response = await fetch(form.action, { method: "POST", headers: { accept: "application/json" }, body: new URLSearchParams(new FormData(form)) });
    if (!response.ok) throw new Error(await response.text());
    if (action.kind === "add") form.reset();
    router.invalidate();
    // Re-render only what changed; the page keeps its scroll position.
    await Promise.all(["tasks", "summary"].map(slot => router.navigate(location.href, { slot, history: "none" })));
    settle(action);
  } catch (error) {
    announce(error.message, "error");
  } finally {
    pending.delete(form);
    button?.removeAttribute("aria-disabled");
  }
});
