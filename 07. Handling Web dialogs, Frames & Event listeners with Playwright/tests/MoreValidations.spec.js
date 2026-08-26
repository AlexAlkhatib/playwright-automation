import { expect, test } from '@playwright/test';

test("Popup validations", async ({page}) => {
    // go to the webiste
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // go to another website for example google.com
    // await page.goto("https://google.com");

    // go back to the first website
    // await page.goBack();

    // go to the second website
    // await page.goForward();

    // locate the hide and show input
    // assert that the text field is visible
    await expect(page.locator(".displayed-class")).toBeVisible();

    // click the hide button ".hide-textbox"
    await page.getByRole("button", {name: "Hide"}).click();

    // assert that the text field is hidden
    await expect(page.locator(".displayed-class")).toBeHidden();
})