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
    await expect(page.locator("#displayed-text")).toBeVisible();

    // click the hide button ".hide-textbox"
    await page.getByRole("button", {name: "Hide"}).click();

    // assert that the text field is hidden
    await expect(page.locator("#displayed-text")).toBeHidden();

    // page.on() this methods will help to listen to events
    // for example page.on("close"): this method will be triggered when the browser is closed
    // when a dialog is triggered perform an action
    // there are no HTML tags to get the buttons
    // dialog.accept(): to confirm
    // dialog.dismiss(): to cancel
    page.on("dialog", dialog => dialog.accept());

    // click the confirm button that will show the popup
    await page.locator("#confirmbtn").click();

    // hover an item with mouse using playwright
    await page.locator("#mousehover").hover();

    // pause the process
    await page.pause();
})