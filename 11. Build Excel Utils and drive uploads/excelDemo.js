// import ExcelJS library
const ExcelJS = require('exceljs');

async function excelTest() {
    // create a workbook (object of the class)
    const workbook = new ExcelJS.Workbook();

    // read the Excel file
    await workbook.xlsx.readFile("./exceldownload.xlsx");

    // get the worksheet
    const worksheet = workbook.getWorksheet("Sheet1");

    // print all rows of the worksheet
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            console.log(cell.value);
        })
    });
}

excelTest();