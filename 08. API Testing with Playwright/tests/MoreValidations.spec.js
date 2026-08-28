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

    // locate frames
    // it will switch from the normal page frame to the select iframe
    // it will give you a new page object
    const framePage = page.frameLocator("#courses-iframe");

    // click on "All Access Plan" from the iframe page
    // select only the element in visible mode
    await framePage.locator("li a[href*='lifetime-access']:visible").click();

    // extract the number of subscribers
    // get the parent element -> child element -> gab the text content
    const text = await framePage.locator(".text h2 span").textContent();
    console.log(text + " subscribers"); // 13,522 subscribers

    // pause the process
    await page.pause();
})