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

    // get the password by placeholder: getByPlaceholder()
    await page.getByPlaceholder("Password").fill("abc123");

    // get the submit button by role: getByRole() and click the button
    // filter where the name is "Submit"
    await page.getByRole("button", {name: "Submit"}).click();

    // get the success message by text: getByText()
    // expect to be truthy
    expect(await page.getByText("Success! The Form has been submitted successfully!.").isVisible()).toBeTruthy();

    // go to the shopping page | Shop
    await page.getByRole("link", {name: "Shop"}).click();

    // locator with tag name and filter attribute
    // this locator will return 4 cards without filter
    // get the "Add" button and click it
    // getbyRole() ne need to use a second argument: {name: "Add "}
    await page.locator("app-card").filter({hasText: "iphone X"}).getByRole("button").click();

    // Pause the page
    await page.pause();
});