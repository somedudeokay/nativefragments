import { test, expect } from "@playwright/test";

const ready = async page => { await page.goto("/"); await page.waitForFunction(() => window.router); };
const navigate = (page, href, options) => page.evaluate(([href, options]) => window.router.navigate(href, options), [href, options]);

test("cached cancellation and hashes stay local to the consumer", async ({ page }) => {
  await ready(page);
  await page.evaluate(() => window.router.prefetch("/plain#old"));
  expect(await page.evaluate(() => window.router.navigate("/plain", { signal: AbortSignal.abort() }).then(() => "bad", e => e.name))).toBe("AbortError");
  await expect(page.locator("h1")).toHaveText("Home");
  await navigate(page, "/plain#anchor");
  await expect(page).toHaveURL(/#anchor$/);
});

test("history restores the full named-target route recipe", async ({ page }) => {
  await ready(page);
  await navigate(page, "/settings");
  await navigate(page, "/settings/profile", { slot: "panel" });
  await navigate(page, "/settings/security", { slot: "other" });
  await expect(page.getByRole("link", { name: "Profile link before target" })).toBeVisible();
  await page.goBack();
  await expect(page.locator('section[data-fragment-slot="panel"]')).toHaveText("profile");
  await expect(page.locator('[data-fragment-slot="other"]')).toHaveText("Other initial");
  await page.goBack();
  await expect(page.locator('section[data-fragment-slot="panel"]')).toHaveText("Initial");
  await page.goForward();
  await expect(page.locator('section[data-fragment-slot="panel"]')).toHaveText("profile");
});

test("a queued view-transition callback cannot commit after supersession", async ({ page }) => {
  await ready(page);
  await page.evaluate(() => {
    document.startViewTransition = arg => {
      const callback = typeof arg === "function" ? arg : arg.update;
      const pending = Promise.withResolvers();
      window.releaseSwap = () => { try { callback(); pending.resolve(); } catch (error) { pending.reject(error); } };
      return { updateCallbackDone: pending.promise };
    };
    window.oldNavigation = window.router.navigate("/plain").catch(e => e.name);
  });
  await page.waitForFunction(() => window.releaseSwap);
  await page.evaluate(async () => {
    const releaseOld = window.releaseSwap;
    delete document.startViewTransition;
    await window.router.navigate("/settings");
    releaseOld();
  });
  expect(await page.evaluate(() => window.oldNavigation)).toBe("AbortError");
  await expect(page.locator("h1")).toHaveText("Settings");
  await expect(page).toHaveURL(/\/settings$/);
});

test("redirect cookies are applied before destination rendering and hashes survive", async ({ page }) => {
  await ready(page);
  await navigate(page, "/cookie");
  await expect(page.locator("h1")).toContainText("fixture_session=alice");
  await expect(page).toHaveURL(/\/session#signed-in$/);
});

test("fragment navigation hydrates the original SSR shadow nodes", async ({ page }) => {
  await ready(page);
  await navigate(page, "/island");
  await page.waitForFunction(() => document.querySelector("test-island")?.serverButton);
  expect(await page.evaluate(async () => {
    const el = document.querySelector("test-island"); await el.updateComplete;
    return el.serverButton === el.shadowRoot.querySelector("button") && !el.querySelector("template[shadowrootmode]");
  })).toBe(true);
  await page.locator("test-island button").click();
  await expect(page.locator("test-island")).toHaveAttribute("clicked", "yes");
});

test("primary navigation focuses the heading, keeps no tabindex and syncs aria-current", async ({ page }) => {
  await ready(page);
  await navigate(page, "/plain");
  await expect(page.locator("h1")).toBeFocused();
  await expect(page.locator('nav a[href="/plain"]')).toHaveAttribute("aria-current", "page");
  await expect(page.locator('nav a[href="/"]')).not.toHaveAttribute("aria-current");
  await expect(page.locator("#content-slot")).not.toHaveAttribute("tabindex");
  await expect(page.locator("#content-slot")).not.toHaveAttribute("aria-busy");
  await page.locator("h1").evaluate(node => node.blur());
  await expect(page.locator("h1")).not.toHaveAttribute("tabindex");
});

test("named slot navigation leaves focus where it was", async ({ page }) => {
  await ready(page);
  await navigate(page, "/settings");
  const link = page.getByRole("link", { name: "Profile link before target" });
  await link.focus();
  await link.press("Enter");
  await expect(page.locator('section[data-fragment-slot="panel"]')).toHaveText("profile");
  await expect(link).toBeFocused();
});

test("fragment navigation works under enforced Trusted Types", async ({ page }) => {
  await page.goto("/strict");
  await page.waitForFunction(() => window.router);
  await page.evaluate(() => { window.sameDocument = true; });
  await navigate(page, "/plain");
  await expect(page.locator("h1")).toHaveText("Plain");
  expect(await page.evaluate(() => window.sameDocument)).toBe(true);
  expect(await page.evaluate(() => window.events.some(event => event.name === "navigation-error"))).toBe(false);
});
