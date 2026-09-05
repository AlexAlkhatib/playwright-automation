const ExcelJS = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcel(searchText, replaceText, inputFilePath, outputFilePath) {
    // Create a workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file
    await workbook.xlsx.readFile(inputFilePath);

    // Get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // Find the cell containing searchText
    const output = await readExcel(worksheet, searchText);

    // Check whether the text was found
    if (output.row === -1) {
        throw new Error(`"${searchText}" was not found in Sheet1`);
    }

    // Get the cell and replace its value
    const cell = worksheet.getCell(output.row, output.column);
    cell.value = replaceText;

    // Save the modified workbook
    await workbook.xlsx.writeFile(outputFilePath);
}

// This does no async work, so don't mark it async.
function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 };

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });

    return output;
}

writeExcel(
    "Apple",
    "Ananas",
    "./exceldownload.xlsx",
    "./newexcel.xlsx"
);

/**
 * To overwrite an existing Excel file instead of creating a new one, your code already supports that.
    Just pass the same path for inputFilePath and outputFilePath:
        writeExcel(
        "Apple",
        "Ananas",
        "./exceldownload.xlsx",
        "./exceldownload.xlsx"
    );
 */

    //update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/rahulshetty/downloads/excelTest.xlsx");

test('Upload download excel validation', async ({ page }) => {
    const textSearch = 'Mango';
    const updateValue = '350';

    await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const dl = await download;
    const filePath = '/Users/alex/downloads/download.xlsx'; // or await dl.path()

    // Ensure the edit finishes before upload
    await writeExcelTest(textSearch, updateValue, filePath, filePath);

    await page.locator('#fileinput').setInputFiles(filePath);

    const desiredRow = await page.getByRole('row').filter({ has: page.getByText(textSearch) });
    
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});