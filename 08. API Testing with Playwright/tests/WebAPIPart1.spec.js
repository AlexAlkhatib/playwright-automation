import { expect, test, request } from '@playwright/test';
const loginPayLoad = 
{
    userEmail: "anshika@gmail.com",
    userPassword: "Iamking@000"
};
let token;

test.beforeAll(async () => {
    // create a request context
    const apiContext = await request.newContext();

    // make a POST call for login
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: loginPayLoad
        }
    );

    // expect login response to be ok
    expect(loginResponse.ok()).toBeTruthy();

    // if the login response is ok, then grab the token variable
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    // print the token
    console.log(token);
});

test.beforeEach(() => {
    
});

test("Client App Other Way", async ({ page }) => {
    //Insert the token into the page
    page.addInitScript(value => {
        window.localStorage.setItem("token", value);
    }, token);

    // Go the web page
    await page.goto("https://rahulshettyacademy.com/client/");

    // Wait until the card body is loaded
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