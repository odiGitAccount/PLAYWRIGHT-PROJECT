import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'https://rahulshettyacademy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    // ── Desktop browsers ──────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // ── Mobile browsers ───────────────────────────────────────────────────
    // Only run tests tagged @mobile or not tagged @desktop-only
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Ensure touch is enabled
        hasTouch: true,
      },
      // Exclude tests marked as desktop-only
      testIgnore: ['**/example.spec.ts'],
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        hasTouch: true,
      },
      testIgnore: ['**/example.spec.ts'],
    },
  ],
});
