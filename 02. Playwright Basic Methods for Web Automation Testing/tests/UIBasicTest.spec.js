import { expect, test } from '@playwright/test';

test.only("Browser Context Playwright Test", async ({ browser }) => {
    // Browser context options can include proxies, cookies, permissions, etc.
    // Open a new browser context.
    // The browser type is defined in playwright.config.js.
    const context = await browser.newContext();

    // Open a new page within the browser context.
    // This is the actual page where the URL will be loaded.
    const page = await context.newPage();

    // Navigate to the specified URL.
    // Here, the browser context and page are created explicitly.
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    // Print the page title in console
    console.log(await page.title());

    // To identify elements we can use css or xpath
    // Locate the username field by 
    // id : input#username
    // class: input.form-control
    // [attribute=value]: [name='username']
    // Fill the field with value or click the button

    await page.locator('#username').fill("Alex");

    await page.locator('#password').fill("test123");

    await page.locator("#signInBtn").click();

    // Wait until this locator is shown up on the screen
    // Locate and extract the error message for invalid credentails and display it in console
    
    const errorLocator = await page.locator("[style*='block']");
    const errorMessage = errorLocator.textContent()
    console.log(errorMessage);

    // assert that the selected locator contains a specific text
    await expect(errorLocator).toContainText('Incorrect');
});

test("Page Fixture Playwright Test", async ({ page }) => {
    // Playwright automatically creates the browser context and page.
    await page.goto("https://www.google.com/");

    // Print the page title in console
    console.log(await page.title());

    // Assert that the page has the correct title
    await expect(page).toHaveTitle("Google");
});

// to run only one test and skip the others
/**
 * test.only("Playwright Sample Test", async ({ page }) => {});
 */