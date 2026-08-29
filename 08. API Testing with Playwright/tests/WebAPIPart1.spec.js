import { expect, test, request } from '@playwright/test';

const loginPayload = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};

const orderPayload = {
    orders: [
        {
            country: "France",
            productOrderId: "6a92a86b21054ba465fbb376"
        }
    ]
};

let token;
let orderId;

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

    // =========================
    // Create Order API
    // =========================
    const orderResponse = await apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        }
    );

    expect(orderResponse.ok()).toBeTruthy();

    const orderResponseJson = await orderResponse.json();
    orderId = orderResponseJson.orders[0];

    console.log("Order ID:", orderId);

    await apiContext.dispose();
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