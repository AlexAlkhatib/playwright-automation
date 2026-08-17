import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Directory containing Playwright tests.
  testDir: './tests',

  // Maximum time allowed for each test.
  timeout: 30 * 1000,

  // Maximum time allowed for assertions.
  expect: {
    timeout: 5000,
  },

  // Generate an HTML test report.
  reporter: 'html',

  use: {
    // Run tests using Chromium.
    browserName: 'chromium',

    // Run the browser in headed mode.
    // Change to true if you want headless execution.
    headless: false,

    // Collect a trace when a test fails for the first time.
    trace: 'on-first-retry',
  },
});