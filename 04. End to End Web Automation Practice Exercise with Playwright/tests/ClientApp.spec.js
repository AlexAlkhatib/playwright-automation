import { expect, test } from '@playwright/test';

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
    await page.locator(".card-body b").first().waitFor();

    // Select Adidas shoes
    // Create a loctor for all products, iterate on each on, check if the product name contains addidas, add the product to the cart

    // Locate all products
    const products = page.locator(".card-body");

    // Product name
    const productName = "ADIDAS ORIGINAL";

    // Get number of products
    const productCount = await products.count();

    // Iterate through all products
    for (let i = 0; i < productCount; i++) {

        // Get the current product
        const product = products.nth(i);

        // Get product title
        const currentProductName = await product.locator("b").textContent();

        // Check if product name contains ADIDAS ORIGINAL
        if (currentProductName.includes(productName)) {

            // Add the product to the cart
            await product.locator("text= Add To Cart").click();

            // Exit loop
            break;
        }
    }

    // Click the cart button
    await page.locator("[routerLink*='cart']").click();

    // Wait until the product is available in hte cart
    await page.locator("h3:has-text('ADIDAS ORIGINAL')").waitFor();

    // Check if the product is visible in the cart
    const productIsVisibleInCart = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();

    // Assert that hte item is visible in the cart
    expect(productIsVisibleInCart).toBeTruthy();

    // Click the checkout button page.locator("[type='button']").last().click();
    await page.locator("text=Checkout").click();

    // Select country
    await page.locator("[placeholder*='Country']").pressSequentially("Fra", {delay:100});

    // Locate country options
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    // Select France
    const optionsCount = await dropdown.locator("button").count();

    // Iterate through each option
    for (let i = 0; i < optionsCount; i++) {
        // Get the current option
        const option = dropdown.locator("button").nth(i);

        // Get option title
        const currentOptionName = await option.textContent();

        // Check if option name contains France
        if (currentOptionName.includes("France")) {

            // Add the option buton
            await option.click();

            // Exit loop
            break;
        }
    }

    // To see the result
    await page.pause();
});