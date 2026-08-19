import { expect, test } from '@playwright/test';

/**
 * ============================================================
 * TEST 1 - Browser Context / Login
 * ============================================================
 *
 * This test demonstrates:
 * - Creating a browser context manually
 * - Creating a page manually
 * - Navigating to a URL
 * - Using locators
 * - Filling input fields
 * - Clicking a button
 * - Reading text
 * - Assertions
 * - Handling multiple elements with nth()
 * - Retrieving multiple texts with allTextContents()
 */
test("Browser Context - Login and Product Titles", async ({ browser }) => {
    // Create a new browser context.
    //
    // A browser context is an isolated browser session.
    // It can contain its own cookies, local storage, permissions, etc.
    const context = await browser.newContext();

    // Create a new page inside the browser context.
    const page = await context.newPage();

    // Navigate to the login page.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    // Display the page title in the console.
    console.log(await page.title());

    /*
     * ----------------------------------------------------------
     * LOCATORS
     * ----------------------------------------------------------
     *
     * Examples of CSS selectors:
     *
     * ID:
     * #username
     *
     * Class:
     * .form-control
     *
     * Attribute:
     * [name='username']
     */

    // Locate the username field.
    const username = page.locator("#username");

    // Locate the password field.
    const password = page.locator("#password");

    // Locate the Sign In button.
    const signInButton = page.locator("#signInBtn");

    /*
     * ----------------------------------------------------------
     * LOGIN WITH INVALID CREDENTIALS
     * ----------------------------------------------------------
     */

    // Fill the username field.
    await username.fill("Alex");

    // Fill the password field.
    await password.fill("test123");

    // Click the Sign In button.
    await signInButton.click();

    /*
     * ----------------------------------------------------------
     * ERROR MESSAGE
     * ----------------------------------------------------------
     */

    // Locate the error message.
    const errorLocator = page.locator("[style*='block']");

    // Extract the error message text.
    const errorMessage = await errorLocator.textContent();

    // Display the error message in the console.
    console.log(errorMessage);

    // Verify that the error message contains "Incorrect".
    await expect(errorLocator).toContainText("Incorrect");

    /*
     * ----------------------------------------------------------
     * LOGIN WITH VALID CREDENTIALS
     * ----------------------------------------------------------
     */

    // Replace the invalid username with valid credentials.
    await username.fill("rahulshettyacademy");

    // Replace the password with valid credentials.
    await password.fill("Learning@830$3mK2");

    // Click the Sign In button again.
    await signInButton.click();

    /*
     * ----------------------------------------------------------
     * PRODUCT TITLES
     * ----------------------------------------------------------
     */

    // Locate all product title links.
    //
    // This locator can match multiple elements.
    const cardTitles = page.locator(".card-body a");

    // Get the first product title.
    //
    // nth(0) means the first element because indexes start at 0.
    const firstProductTitle = await cardTitles.nth(0).textContent();

    // Display the first product title.
    console.log(firstProductTitle);

    // Get all product titles at once.
    const allTitles = await cardTitles.allTextContents();

    // Display all product titles.
    console.log(allTitles);
});

/**
 * ============================================================
 * TEST 2 - UI Controls
 * ============================================================
 *
 * This test demonstrates:
 * - Dropdowns
 * - Radio buttons
 * - Checkboxes
 * - isChecked()
 * - toBeChecked()
 * - toBeTruthy()
 * - toBeFalsy()
 * - toHaveAttribute()
 */
test("UI Controls", async ({ page }) => {
    // Navigate to the login page.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    /*
     * ----------------------------------------------------------
     * LOCATORS
     * ----------------------------------------------------------
     */

    // Locate the username field.
    const username = page.locator("#username");

    // Locate the password field.
    const password = page.locator("#password");

    // Locate the Sign In button.
    const signInButton = page.locator("#signInBtn");

    // Locate the dropdown.
    const dropdown = page.locator("select.form-control");

    /*
     * ----------------------------------------------------------
     * DROPDOWN
     * ----------------------------------------------------------
     */

    // Select the "Consult" option.
    await dropdown.selectOption("consult");

    /*
     * ----------------------------------------------------------
     * RADIO BUTTON
     * ----------------------------------------------------------
     */

    // Locate the radio buttons and select the last one.
    const userRadioButton = page.locator(".radiotextsty").last();

    // Click the last radio button.
    await userRadioButton.click();

    // Click "Okay" on the popup.
    await page.locator("#okayBtn").click();

    // Display whether the radio button is checked.
    console.log(await userRadioButton.isChecked());

    // Verify that the radio button is checked.
    await expect(userRadioButton).toBeChecked();

    /*
     * ----------------------------------------------------------
     * CHECKBOX
     * ----------------------------------------------------------
     */

    // Locate the Terms and Conditions checkbox.
    const termsCheckbox = page.locator("#terms");

    // Check the checkbox.
    await termsCheckbox.check();

    // Verify that the checkbox is checked.
    await expect(termsCheckbox).toBeChecked();

    // Uncheck the checkbox.
    await termsCheckbox.uncheck();

    // Verify that the checkbox is NOT checked.
    expect(await termsCheckbox.isChecked()).toBeFalsy();

    /*
     * ----------------------------------------------------------
     * LINK ATTRIBUTE
     * ----------------------------------------------------------
     */

    // Locate the document request link.
    const documentLink = page.locator(
        "[href*='documents-request']"
    );

    // Verify that the link has the expected CSS class.
    await expect(documentLink).toHaveAttribute(
        "class",
        "blinkingText"
    );

    /*
     * ----------------------------------------------------------
     * DEBUGGING
     * ----------------------------------------------------------
     */

    // Uncomment this line if you want to pause the test
    // and inspect the browser manually.
    //
    // await page.pause();
});

/**
 * ============================================================
 * TEST 3 - Child Windows Handling
 * ============================================================
 *
 * This test demonstrates:
 * - Browser Context
 * - Multiple pages
 * - Handling a new browser page
 * - Promise.all()
 * - waitForEvent("page")
 * - Extracting text
 * - String manipulation
 * - Using information from one page in another page
 */
test("Child Windows Handling", async ({ browser }) => {
    /*
     * ----------------------------------------------------------
     * CREATE BROWSER CONTEXT AND PAGE
     * ----------------------------------------------------------
     */

    // Create a new browser context.
    const context = await browser.newContext();

    // Create the main page.
    const page = await context.newPage();

    // Navigate to the login page.
    await page.goto(
        "https://rahulshettyacademy.com/loginpagePractise/"
    );

    /*
     * ----------------------------------------------------------
     * DOCUMENT LINK
     * ----------------------------------------------------------
     */

    // Locate the document request link.
    const documentLink = page.locator(
        "[href*='documents-request']"
    );

    /*
     * ----------------------------------------------------------
     * HANDLE NEW PAGE
     * ----------------------------------------------------------
     *
     * Clicking the link opens a new page.
     *
     * We need to:
     *
     * 1. Wait for the new page event.
     * 2. Click the link.
     *
     * Both operations must be started together.
     *
     * Promise.all() waits until both promises are fulfilled.
     */

    const [newPage] = await Promise.all([
        // Listen for a new page being opened.
        context.waitForEvent("page"),

        // Click the link that opens the new page.
        documentLink.click(),
    ]);

    /*
     * ----------------------------------------------------------
     * AUTOMATE THE NEW PAGE
     * ----------------------------------------------------------
     */

    // Locate the red text in the new page.
    const redText = newPage.locator(".red");

    // Extract the text.
    const text = await redText.textContent();

    // Display the complete text.
    console.log(text);

    /*
     * ----------------------------------------------------------
     * EXTRACT THE DOMAIN
     * ----------------------------------------------------------
     *
     * Example:
     *
     * text = "Please email us at mentor@rahulshettyacademy.com ..."
     *
     * split("@")[1]
     *      ↓
     * rahulshettyacademy.com ...
     *
     * split(" ")[0]
     *      ↓
     * rahulshettyacademy.com
     */

    const domain = text.split("@")[1].split(" ")[0];

    // Display the extracted domain.
    console.log(domain);

    /*
     * ----------------------------------------------------------
     * USE THE DOMAIN ON THE FIRST PAGE
     * ----------------------------------------------------------
     */

    // Locate the username field on the original page.
    const username = page.locator("#username");

    // Fill the username field with the extracted domain.
    await username.fill(domain);

    // Display the value entered into the username field.
    console.log(await username.inputValue());

    /*
     * ----------------------------------------------------------
     * DEBUGGING
     * ----------------------------------------------------------
     */

    // Pause the test if you want to inspect both pages manually.
    //
    // await page.pause();
});