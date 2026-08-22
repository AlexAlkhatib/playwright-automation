import { expect, test } from '@playwright/test';

test("Playwright Special Locators Test", async ({ page }) => {
    // go to the website
    await page.goto("https://rahulshettyacademy.com/angularpractice/");

    // Get By Label: to get the html tag of a text written inside a label tag
    // Check the checkbox
    await page.getByLabel("Check me out if you Love IceCreams!").check();

    // Check the radio button ( check() or click() )
    await page.getByLabel("Employed").check();

    // getByLabel: also works for dropdown menus
    // selectOption: only valid if we select an option in <select>
    await page.getByLabel("Gender").selectOption("Female");

    // Pause the page
    await page.pause();
});