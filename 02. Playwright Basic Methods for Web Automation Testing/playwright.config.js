import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Set the default timeout for all tests to 30 seconds.
  timeout: 30 * 1000,

  // Set the default timeout for assertions.
  expect: {
    timeout: 5000,
  },

  // Generate an HTML report after test execution.
  reporter: 'html',

  // Shared settings for all projects.
  use: {
    // Use Chromium as the browser.
    browserName: 'chromium',

    // Always run tests in headed mode.
    headless: false,

    // Collect a trace when retrying a failed test.
    trace: 'on-first-retry',
  },
});