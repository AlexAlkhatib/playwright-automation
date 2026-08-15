const {test} = require('@playwright/test');

test("Browser Context Playwright Test", async ({browser}) =>
{
    // chrome - options can be proxies, plugins or cookies anything you want to send
    // open a new browser (define the brwoser type in playwright.config.js)
    const context = await browser.newContext();
    
    // open a new page within the brwoser
    // create actual page where you enter the url to start automation
    const page = await context.newPage();

    // go to a url (if we inject page in function's parameter then the creation of context and page will be done explicitly)
    await page.goto("https://www.google.com/");
});

test("Page Context Playwright Test", async ({page}) =>
{
    await page.goto("https://www.google.com/");
});