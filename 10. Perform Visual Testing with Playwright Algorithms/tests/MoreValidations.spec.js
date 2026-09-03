import { expect, test } from '@playwright/test';

test("Screenshot & Visual Comparision", async ({page}) => {
    // go to the webiste
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // assert that the text field is visible
    await expect(page.locator("#displayed-text")).toBeVisible();

    // take a screenshot of the element
    await page.locator("#displayed-text").screenshot({ path: "partialScreenshot.png" });

    // click the hide button ".hide-textbox"
    await page.getByRole("button", {name: "Hide"}).click();

    // Take a screenshot of the whole page
    await page.screenshot({ path: "screenshot.png" });

    // assert that the text field is hidden
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test("Visual Testing", async ({page}) => {
    // go to the webiste
    await page.goto("https://www.rediff.com/");

    // expect the current screenshot to match the existing screenshot
    expect(await page.screenshot()).toMatchSnapshot("landing.png");
});