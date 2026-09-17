import { defineConfig, devices } from "@playwright/test";

// Chromium 단일 프로젝트만 사용한다(CLAUDE.md 규칙 18, docs/DECISION_LOG.md DEC-009).
// Firefox/WebKit 등 다른 브라우저 프로젝트를 추가하지 않는다.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // CI에서 실패 시에만 playwright-report/를 Artifact로 올린다(.github/workflows/ci.yml).
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
