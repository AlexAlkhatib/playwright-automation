import { test } from '@playwright/test';

test("Browser Context Playwright Test", async ({ browser }) => {
    // Browser context options can include proxies, cookies, permissions, etc.
    // Open a new browser context.
    // The browser type is defined in playwright.config.js.
    const context = await browser.newContext();

    // Open a new page within the browser context.
    // This is the actual page where the URL will be loaded.
    const page = await context.newPage();

    // Navigate to the specified URL.
    // Here, the browser context and page are created explicitly.
    await page.goto("https://www.google.com/");
});

test("Page Fixture Playwright Test", async ({ page }) => {
    // Playwright automatically creates the browser context and page.
    await page.goto("https://www.google.com/");
});

/**
 * test.only("Page Fixture Playwright Test", async ({ page }) => {
    // Playwright automatically creates the browser context and page.
    await page.goto("https://www.google.com/");
});
 */