// import @playwright/test annotation from playwright module
const {test} = require('@playwright/test');

// run a new test case
// test(): takes two arguments (the title of the test and the test function)
test("First Playwright Test", async () =>
{
    // playwright code 
    // testing in js is not sequential that's why we need to use the "async" and "await" keywords to wait until the previous set is completed
    // step 1 - open browser
    // step 2 - enter username and password
    // step 3 - click submit button
});