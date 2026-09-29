import { test, expect } from "@playwright/test";

test("document payloads wait for their closing tag across network chunks", async ({ page, request }) => {
  const gate = crypto.randomUUID();
  await page.goto(`/split-document?gate=${gate}`, { waitUntil: "commit" });
  const target = page.locator('[data-nativefragments-deferred="split"]');
  await expect(target).toHaveText("Loading");
  await request.get(`/control/release?gate=${gate}`);
  await expect(target).toHaveText("FirstLast");
  await expect(target).toHaveAttribute("data-fragment-state", "ready");
});

test("cached streamed navigation remains populated after a streamed document", async ({ page }) => {
  await page.goto("/stream?value=initial");
  await page.waitForFunction(() => window.router);
  for (const href of ["/stream?value=cached", "/plain", "/stream?value=cached"]) {
    await page.evaluate(href => window.router.navigate(href), href);
  }
  await expect(page.locator("#result")).toHaveText("Result cached");
  expect(await page.evaluate(async () => {
    const el = document.querySelector("test-island"); await el.updateComplete;
    return el.serverButton === el.shadowRoot.querySelector("button");
  })).toBe(true);
});

test("late deferred work cannot overwrite a newer navigation", async ({ page, request }) => {
  const gate = crypto.randomUUID();
  await page.goto("/");
  await page.waitForFunction(() => window.router);
  await page.evaluate(href => { window.oldNavigation = window.router.navigate(href).catch(e => e.name); }, `/stream?value=old&gate=${gate}`);
  await expect(page.locator("#loading")).toBeVisible();
  await page.evaluate(() => window.router.navigate("/plain"));
  await request.get(`/control/release?gate=${gate}`);
  expect(await page.evaluate(() => window.oldNavigation)).toBe("AbortError");
  await expect(page.locator("h1")).toHaveText("Plain");
  await expect(page.locator("#result")).toHaveCount(0);
  expect(await page.evaluate(() => window.events.filter(e => e.name === "navigation-complete" && e.url.includes("value=old")).length)).toBe(0);
});

test("deferred documents remain useful with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8921/stream?value=native");
  await expect(page.locator('[data-fragment-fallback="result"]')).toContainText("Result native");
  await expect(page.locator("#loading")).toBeHidden();
  await context.close();
});
