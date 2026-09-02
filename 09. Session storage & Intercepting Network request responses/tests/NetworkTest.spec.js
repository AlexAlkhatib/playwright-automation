import { expect, test, request } from '@playwright/test';

test('@QW Security test request intercept', async ({ page }) => {

    // login and reach orders page
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    // Go to "My orders"
    await page.locator("button[routerlink*='myorders']").click();

    // Stop the call of CSS from reaching the browser
    page.route("**/*.css", route => route.abort());

    // Change the route of the first order with this given new id
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6' })
    );
    // Click the view button
    await page.locator("button:has-text('View')").first().click();
    // Expect to see this message
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});