// import ExcelJS library
const ExcelJS = require('exceljs');

async function excelTest() {
    let output = {row: -1, column: -1};

    // create a workbook (object of the class)
    const workbook = new ExcelJS.Workbook();

    // read the Excel file
    await workbook.xlsx.readFile("./exceldownload.xlsx");

    // get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // print all rows of the worksheet
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === "Apple") {
                output.row = rowNumber; // 3
                output.column = colNumber; // 2
            }
        })
    });
    // get the cell (row number, column number)
    const cell = worksheet.getCell(output.row, output.column);
    cell.value = "Ananas";

    // save changes in the workbook (we can also override the current Excel file)
    await workbook.xlsx.writeFile("./newexcel.xlsx");
}

excelTest();