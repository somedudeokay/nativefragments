import { test, expect } from "@playwright/test";

for (const javaScriptEnabled of [true, false]) {
  test(`task workspace persists edits and sign-in (JavaScript ${javaScriptEnabled})`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled, baseURL: "http://127.0.0.1:8922" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/login");
    await page.getByRole("button", { name: "Create workspace" }).click();
    const recovery = await page.locator("#recovery-key").textContent();
    await page.getByRole("link", { name: "Go to my tasks" }).click();
    await page.getByLabel("What needs doing?").fill("Ship the framework");
    await page.getByRole("button", { name: "Add task" }).click();
    await expect(page.locator(".task-title")).toHaveText("Ship the framework");
    await page.getByRole("button", { name: "Complete Ship the framework", exact: true }).click();
    await expect(page.locator(".task")).toHaveAttribute("data-done", "1");
    await page.getByRole("link", { name: "To do", exact: true }).click();
    await expect(page.locator(".task")).toHaveCount(0);
    await page.getByRole("link", { name: "Done", exact: true }).click();
    await expect(page.locator(".task-title")).toHaveText("Ship the framework");
    await page.goBack();
    await expect(page.locator(".task")).toHaveCount(0);
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.getByLabel("Recovery key").fill(recovery);
    await page.getByRole("button", { name: "Open workspace" }).click();
    await expect(page.locator(".task-title")).toHaveText("Ship the framework");
    await page.getByRole("button", { name: "Delete Ship the framework" }).click();
    await expect(page.locator(".task")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".task")).toHaveCount(0);
    expect(errors).toEqual([]);
    await context.close();
  });
}
