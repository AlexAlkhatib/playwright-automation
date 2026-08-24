import { expect, test } from '@playwright/test';

test("Calendar validations", async ({ page }) => {
    const day = "7";
    const month = "7";
    const year = "2026";

    // go the web page
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    // locate the date field
    await page.locator(".react-date-picker__inputGroup").click();

    // two clicks to choose the year
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    // select the year
    await page.getByText(year).click();

    // map all months and get 7 -> July -> nth(6)
    await page.locator(".react-calendar__year-view__months__month").nth(month - 1).click();

    // select the day
    // await page.locator(".react-calendar__tile react-calendar__month-view__days__day").filter({hasText: day}).click(); (NOT WORKING)
    await page.locator("//abbr[text()='" + day + "']").click();

    // pause the process
    await page.pause();
});