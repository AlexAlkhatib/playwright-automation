import { test } from '@playwright/test';

test("Client App - Login and Get Product Titles", async ({ page }) => {
    // Navigate to the client application.
    await page.goto("https://rahulshettyacademy.com/client");

    // Locate and fill the email field.
    await page.locator("#userEmail").fill("anshika@gmail.com");

    // Locate and fill the password field.
    await page.locator("#userPassword").fill("Iamking@000");

    // Click the Login button.
    await page.locator("[value='Login']").click();

    // Wait until the first product title is available.
    //
    // Alternative:
    // await page.waitForLoadState("networkidle");
    //
    // Waiting for a specific element is often useful when we need
    // to make sure that the required content is available.
    await page.locator(".card-body b").first().waitFor();

    // Locate all product titles.
    const productTitles = page.locator(".card-body b");

    // Retrieve the text of all product titles.
    const titles = await productTitles.allTextContents();

    // Display the product titles in the console.
    console.log(titles);
});