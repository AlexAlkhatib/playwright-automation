import { test } from '@playwright/test';

test.only("Browser Context-Validating Error Login", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");

    await page.locator("[value='Login']").click();

    // 1# Wait until the products page is loaded
    // await page.waitForLoadState("networkidle");

    // 2# Another alternative way to wait for :)
    await page.locator(".card-body b").first().waitFor();

    // Get product titles
    const titles = await page.locator(".card-body b").allTextContents();

    console.log(titles);
});