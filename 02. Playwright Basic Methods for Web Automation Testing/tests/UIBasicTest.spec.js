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

    // To locate elements we can use css or xpath
    // Locate the username field by 
    // id : #username
    // class: .form-control
    // [attribute=value]: [name='username']

    // Locate the username field
    const username = page.locator('#username');

    // Locate the password field
    const password = await page.locator('#password');

    // Locate the sign-in button
    const signInButton = await page.locator("#signInBtn");

    // Fill username and password
    await username.fill("Alex");
    await password.fill("test123");

    // Click the sign-in button
    await signInButton.click();

    // Wait until this locator is shown up on the screen

    // Locate the error message
    const errorLocator = page.locator("[style*='block']");

    // Extract and display the error message
    const errorMessage = await errorLocator.textContent();
    console.log(errorMessage);

    // assert that the selected locator contains a specific text
    await expect(errorLocator).toContainText('Incorrect');

    // Erase the content of username and password to test with correct credentials
    await username.fill("rahulshettyacademy");
    await password.fill("Learning@830$3mK2");
    await signInButton.click();

    // Get the first element, otherwise playwright will throw an exception of unique element violation
    console.log(await page.locator(".card-body a").nth(0).textContent());
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