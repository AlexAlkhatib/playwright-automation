import { expect, test, request } from '@playwright/test';

const loginPayload = {
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};

const fakePayLoadOrders = { 
    data: [], 
    message: "No Orders" 
};

let token;
let webContext;

test.beforeAll(async ({ browser }) => {

    // =========================
    // Login API
    // =========================

    const apiContext = await request.newContext();

    const loginResponse = await apiContext.post(
        "https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayload
        }
    );

    expect(loginResponse.ok()).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    await apiContext.dispose();


    // =========================
    // Create context with token
    // =========================

    const context = await browser.newContext();

    const initialPage = await context.newPage();

    await initialPage.addInitScript((value) => {
        window.localStorage.setItem("token", value);
    }, token);

    await initialPage.goto(
        "https://rahulshettyacademy.com/client/"
    );

    await initialPage.locator(".card-body b").first().waitFor();

    // Save storage state
    await context.storageState({
        path: "state.json"
    });

    await context.close();


    // =========================
    // Create webContext
    // =========================

    webContext = await browser.newContext({
        storageState: "state.json"
    });
});


test("Client App", async () => {

    // Create page from webContext
    const page = await webContext.newPage();

    await page.goto(
        "https://rahulshettyacademy.com/client/"
    );

    await page.locator(".card-body b").first().waitFor();

    // expect().not.toBeVisible()
    await expect(
        page.getByText("ADIDAS ORIGINAL")
    ).toBeVisible();

    await page.close();
});


test("Check Page Title", async () => {

    // Create a NEW page from the SAME webContext
    const page = await webContext.newPage();

    await page.goto(
        "https://rahulshettyacademy.com/client/"
    );

    await expect(page).toHaveTitle(
        "Let's Shop"
    );

    await page.close();
});

//create order is success
test('Place the order', async () => {
    // Create page from webContext
    const page = await webContext.newPage();

    await page.goto(
        "https://rahulshettyacademy.com/client/"
    );

    // intercepting response - API response -> { playwright fakeresponse}-> browser -> render data on front end
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayLoadOrders);
        route.fulfill(
        {
            response,
            body, 
        });
    });

    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

    console.log(await page.locator(".mt-4").textContent());
});


test.afterAll(async () => {

    await webContext.close();

});