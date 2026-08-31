// Login UI
// Test adding to cart
// Test order confirmation
// Test order details
// Test order history

import { expect, test, request } from '@playwright/test';

const loginPayload = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};

let token;

test.beforeAll(async () => {
    const apiContext = await request.newContext();

    // =========================
    // Login API
    // =========================
    const loginResponse = await apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayload
        }
    );

    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    console.log("Token:", token);
});

test("Client App", async ({ page }) => {

    // =========================
    // Inject token into browser
    // =========================
    await page.addInitScript((value) => {
        window.localStorage.setItem("token", value);
    }, token);

    // =========================
    // Open application
    // =========================
    await page.goto("https://rahulshettyacademy.com/client/");

    // Wait for products to load
    await page.locator(".card-body b").first().waitFor();

    // =========================
    // Add Adidas product
    // =========================
    await page
        .locator(".card-body")
        .filter({ hasText: "ADIDAS ORIGINAL" })
        .getByRole("button", { name: "Add To Cart" })
        .click();

    // =========================
    // Go to Cart
    // =========================
    await page
        .getByRole("listitem")
        .getByRole("button", { name: "Cart" })
        .click();

    // Verify product is in cart
    await expect(
        page.getByText("ADIDAS ORIGINAL")
    ).toBeVisible();

    // =========================
    // Checkout
    // =========================
    await page
        .getByRole("button", { name: "Checkout" })
        .click();

    // =========================
    // Select France
    // =========================
    await page
        .getByPlaceholder("Select Country")
        .pressSequentially("Fra", { delay: 100 });

    await page.locator(".ta-results").waitFor();

    await page
        .getByRole("button", { name: "Fra" })
        .first()
        .click();

    // =========================
    // Place Order
    // =========================
    await page.getByText("PLACE ORDER").click();

    // =========================
    // Verify confirmation
    // =========================
    await expect(
        page.getByText("Thankyou for the order.")
    ).toBeVisible();
});