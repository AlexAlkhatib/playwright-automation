import { expect, test } from '@playwright/test';

test("Client App Other Way", async ({ page }) => {
    // Navigate to the client application.
    await page.goto("https://rahulshettyacademy.com/client");

    // Locate and fill the email field by placeholder.
    const email = "anshika@gmail.com";
    await page.getByPlaceholder("email@example.com").fill(email);

    // Locate and fill the password field by placeholder.
    const password = "Iamking@000";
    await page.getByPlaceholder("enter your passsword").fill(password);

    // Click the Login button by role.
    await page.getByRole("button", {name: "Login"}).click();

    // Wait until the first product title is available. (don't change)
    await page.waitForLoadState("networkidle");
    await page.locator(".card-body b").first().waitFor();

    // Locate all products and filter by the product name
    await page.locator(".card-body").filter({hasText: "ADIDAS ORIGINAL"}).getByRole("button", {name: "Add To Cart"}).click();

    // Click the cart button
    await page.getByRole("listitem").getByRole("button", {name: "Cart"}).click();

    // Wait until the product is available in hte cart
    await page.locator("h3:has-text('ADIDAS ORIGINAL')").waitFor();

    // Check if the product is visible in the cart
    // await expect(page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible()).toBeTruthy();
    await expect(page.getByText("ADIDAS ORIGINAL")).toBeVisible();

    // Click the checkout button page.locator("[type='button']").last().click();
    // await page.locator("text=Checkout").click();
    await page.getByRole("button", {name: "Checkout"}).click();

    // Select country
    // await page.locator("[placeholder*='Country']").pressSequentially("Fra", {delay:100});
    await page.getByPlaceholder("Select Country").pressSequentially("Fra", {delay:100});

    // Locate country options wait for results
    await page.locator(".ta-results").waitFor();

    // Select France and check the option
    await page.getByRole("button", {name: "Fra"}).nth(0).click();

    // Click on the place order button
    await page.getByText("PLACE ORDER").click();

    // Make sure that the page has a message like "Thank you for the order"
    // Or bool = text.contains(message) expect to be truthy
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});