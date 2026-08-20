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
            await product.getByRole("button", { name: "Add To Cart" }).click();

            // Exit loop
            break;
        }
    }
});