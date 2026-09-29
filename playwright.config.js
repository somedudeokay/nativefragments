import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  timeout: 20_000,
  reporter: [["list"], ["json", { outputFile: "test-results/browser.json" }]],
  use: { baseURL: "http://127.0.0.1:8921", trace: "retain-on-failure" },
  webServer: [
    { command: "node tests/browser/server.mjs", url: "http://127.0.0.1:8921/health", reuseExistingServer: !process.env.CI },
    { command: "npm run build -w apps/task-board && node tests/browser/task-board-server.mjs", url: "http://127.0.0.1:8922/health", reuseExistingServer: !process.env.CI },
  ],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
