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
    document.startViewTransition = callback => {
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
