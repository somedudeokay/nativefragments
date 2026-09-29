import { startRouter } from "@nativefragments/core/client/router.js";
const router = startRouter({ prefetch: "none" });
document.addEventListener("submit", async event => {
  const form = event.target.closest("form[data-task-form]");
  if (!form || event.defaultPrevented) return;
  event.preventDefault();
  const button = event.submitter;
  if (button) button.disabled = true;
  const status = document.getElementById("form-status");
  try {
    const response = await fetch(form.action, { method: "POST", headers: { accept: "application/json" }, body: new URLSearchParams(new FormData(form)) });
    if (!response.ok) throw new Error(await response.text());
    router.invalidate();
    await router.navigate(location.pathname, { history: "replace" });
    document.getElementById("title")?.focus();
  } catch (error) {
    if (status) status.textContent = error.message;
  } finally { if (button) button.disabled = false; }
});
