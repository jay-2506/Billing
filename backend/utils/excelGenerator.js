const ExcelJS = require('exceljs');

const generateInvoiceExcel = async (invoice, customer, company, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tax Invoice', {
        pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true }
    });

    // Column widths to match screenshot layout
    sheet.columns = [
        { width: 6 },   // A: Sr No
        { width: 32 },  // B: Description
        { width: 14 },  // C: HSN Code
        { width: 18 },  // D: Amount
    ];

    // ─── Helper: border styles ───
    const thinBorder = { style: 'thin', color: { argb: 'FF000000' } };
    const mediumBorder = { style: 'medium', color: { argb: 'FF000000' } };

    const allThin = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    const allMedium = { top: mediumBorder, left: mediumBorder, bottom: mediumBorder, right: mediumBorder };
    const topMedBot = { top: mediumBorder, left: mediumBorder, bottom: mediumBorder, right: mediumBorder };

    const applyBorder = (cell, border) => { cell.border = border; };

    const currency = (val) => Number(val || 0).toFixed(2);

    // ─── ROW 1: Company Name ───
    sheet.mergeCells('A1:D1');
    const nameCell = sheet.getCell('A1');
    nameCell.value = company.companyName || 'KRISHNA DEVELOPERS';
    nameCell.font = { bold: true, size: 16, name: 'Arial' };
    nameCell.alignment = { horizontal: 'center', vertical: 'middle' };
    nameCell.border = { top: mediumBorder, left: mediumBorder, right: mediumBorder };
    sheet.getRow(1).height = 28;

    // ─── ROW 2: Address ───
    sheet.mergeCells('A2:D2');
    const addrCell = sheet.getCell('A2');
    addrCell.value = company.address || '';
    addrCell.font = { size: 9, name: 'Arial' };
    addrCell.alignment = { horizontal: 'center', vertical: 'middle' };
    addrCell.border = { left: mediumBorder, right: mediumBorder };
    sheet.getRow(2).height = 16;

    // ─── ROW 3: "Tax Invoice" title ───
    sheet.mergeCells('A3:D3');
    const titleCell = sheet.getCell('A3');
    titleCell.value = 'Tax Invoice';
    titleCell.font = { bold: true, size: 12, name: 'Arial', underline: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = { left: mediumBorder, right: mediumBorder, bottom: thinBorder };
    sheet.getRow(3).height = 18;

    // ─── ROW 4: "Bill To" label | "Bill No." label + value ───
    sheet.getRow(4).height = 14;
    const r4A = sheet.getCell('A4');
    r4A.value = 'Bill To.';
    r4A.font = { bold: true, size: 9, name: 'Arial' };
    r4A.border = { left: mediumBorder, top: thinBorder };
    sheet.mergeCells('A4:B4');

    const r4C = sheet.getCell('C4');
    r4C.value = 'Bill No.';
    r4C.font = { bold: true, size: 9, name: 'Arial' };
    r4C.border = { left: thinBorder, top: thinBorder };
    r4C.alignment = { horizontal: 'right' };

    const r4D = sheet.getCell('D4');
    r4D.value = invoice.invoiceNumber || '';
    r4D.font = { bold: true, size: 9, name: 'Arial' };
    r4D.border = { right: mediumBorder, top: thinBorder };

    // ─── ROW 5: Customer Name | blank | Date label + value ───
    sheet.getRow(5).height = 14;
    const r5A = sheet.getCell('A5');
    r5A.value = customer.name || '';
    r5A.font = { bold: true, size: 9, name: 'Arial' };
    r5A.border = { left: mediumBorder };
    sheet.mergeCells('A5:B5');

    const r5C = sheet.getCell('C5');
    r5C.value = 'Date:-';
    r5C.font = { bold: true, size: 9, name: 'Arial' };
    r5C.border = { left: thinBorder };
    r5C.alignment = { horizontal: 'right' };

    const r5D = sheet.getCell('D5');
    r5D.value = new Date(invoice.date).toLocaleDateString('en-GB').replace(/\//g, '-');
    r5D.font = { size: 9, name: 'Arial' };
    r5D.border = { right: mediumBorder };

    // ─── ROW 6: Customer Address ───
    sheet.getRow(6).height = 14;
    const r6A = sheet.getCell('A6');
    r6A.value = customer.address || '';
    r6A.font = { size: 9, name: 'Arial' };
    r6A.border = { left: mediumBorder };
    sheet.mergeCells('A6:B6');

    const r6C = sheet.getCell('C6');
    r6C.border = { left: thinBorder, bottom: thinBorder };
    const r6D = sheet.getCell('D6');
    r6D.border = { right: mediumBorder, bottom: thinBorder };

    // ─── ROW 7: GST No ───
    sheet.getRow(7).height = 14;
    const r7A = sheet.getCell('A7');
    r7A.value = `GST No. ${customer.gstNumber || 'N/A'}`;
    r7A.font = { bold: true, size: 9, name: 'Arial' };
    r7A.border = { left: mediumBorder, bottom: thinBorder };
    sheet.mergeCells('A7:B7');

    const r7C = sheet.getCell('C7');
    r7C.border = { left: thinBorder };
    const r7D = sheet.getCell('D7');
    r7D.border = { right: mediumBorder };

    // ─── ROW 8: Table Header ───
    sheet.getRow(8).height = 18;
    const headers = [
        { cell: 'A8', val: 'Sr. No.', bold: true },
        { cell: 'B8', val: 'Description', bold: true },
        { cell: 'C8', val: 'HSM Code', bold: true },
        { cell: 'D8', val: 'Amount', bold: true },
    ];
    headers.forEach(({ cell, val, bold }) => {
        const c = sheet.getCell(cell);
        c.value = val;
        c.font = { bold, size: 9, name: 'Arial' };
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        c.border = allThin;
    });

    // ─── ITEM ROWS (min 8 rows) ───
    const minRows = 8;
    const items = invoice.items || [];
    const totalItemRows = Math.max(items.length, minRows);
    let rowIdx = 9;

    for (let i = 0; i < totalItemRows; i++) {
        const item = items[i];
        const row = sheet.getRow(rowIdx);
        row.height = 16;

        const srCell = sheet.getCell(`A${rowIdx}`);
        const descCell = sheet.getCell(`B${rowIdx}`);
        const hsnCell = sheet.getCell(`C${rowIdx}`);
        const amtCell = sheet.getCell(`D${rowIdx}`);

        if (item) {
            srCell.value = i + 1;
            descCell.value = item.name || '';
            hsnCell.value = item.hsnCode || '';
            amtCell.value = parseFloat(currency(item.total));
            amtCell.numFmt = '#,##0.00';
        }

        srCell.font = { size: 9, name: 'Arial' };
        descCell.font = { size: 9, name: 'Arial' };
        hsnCell.font = { size: 9, name: 'Arial' };
        amtCell.font = { size: 9, name: 'Arial' };

        srCell.alignment = { horizontal: 'center' };
        hsnCell.alignment = { horizontal: 'center' };
        amtCell.alignment = { horizontal: 'right' };

        srCell.border = allThin;
        descCell.border = allThin;
        hsnCell.border = allThin;
        amtCell.border = allThin;

        rowIdx++;
    }

    // ─── TOTAL row ───
    const r = rowIdx;
    sheet.getRow(r).height = 16;
    sheet.mergeCells(`A${r}:C${r}`);
    const totLabelCell = sheet.getCell(`A${r}`);
    totLabelCell.value = 'TOTAL';
    totLabelCell.font = { bold: true, size: 9, name: 'Arial' };
    totLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    totLabelCell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

    const totValCell = sheet.getCell(`D${r}`);
    totValCell.value = parseFloat(currency(invoice.subtotal));
    totValCell.numFmt = '#,##0.00';
    totValCell.font = { bold: true, size: 9, name: 'Arial' };
    totValCell.alignment = { horizontal: 'right' };
    totValCell.border = allThin;
    totValCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE599' } };

    // ─── SGST row ───
    const sgstPct = company.sgstPercentage || 9;
    const rowSgst = r + 1;
    sheet.getRow(rowSgst).height = 14;
    sheet.mergeCells(`A${rowSgst}:C${rowSgst}`);
    const sgstLabel = sheet.getCell(`A${rowSgst}`);
    sgstLabel.value = `SGST   ${sgstPct}%`;
    sgstLabel.font = { size: 9, name: 'Arial' };
    sgstLabel.alignment = { horizontal: 'right', vertical: 'middle' };
    sgstLabel.border = allThin;

    const sgstVal = sheet.getCell(`D${rowSgst}`);
    sgstVal.value = parseFloat(currency(invoice.sgstAmount));
    sgstVal.numFmt = '#,##0.00';
    sgstVal.font = { size: 9, name: 'Arial' };
    sgstVal.alignment = { horizontal: 'right' };
    sgstVal.border = allThin;

    // ─── CGST row ───
    const cgstPct = company.cgstPercentage || 9;
    const rowCgst = r + 2;
    sheet.getRow(rowCgst).height = 14;
    sheet.mergeCells(`A${rowCgst}:C${rowCgst}`);
    const cgstLabel = sheet.getCell(`A${rowCgst}`);
    cgstLabel.value = `CGST   ${cgstPct}%`;
    cgstLabel.font = { size: 9, name: 'Arial' };
    cgstLabel.alignment = { horizontal: 'right', vertical: 'middle' };
    cgstLabel.border = allThin;

    const cgstVal = sheet.getCell(`D${rowCgst}`);
    cgstVal.value = parseFloat(currency(invoice.cgstAmount));
    cgstVal.numFmt = '#,##0.00';
    cgstVal.font = { size: 9, name: 'Arial' };
    cgstVal.alignment = { horizontal: 'right' };
    cgstVal.border = allThin;

    // ─── GRAND TOTAL row ───
    const rowGrand = r + 3;
    sheet.getRow(rowGrand).height = 16;
    sheet.mergeCells(`A${rowGrand}:C${rowGrand}`);
    const grandLabel = sheet.getCell(`A${rowGrand}`);
    grandLabel.value = 'TOTAL';
    grandLabel.font = { bold: true, size: 10, name: 'Arial' };
    grandLabel.alignment = { horizontal: 'right', vertical: 'middle' };
    grandLabel.border = allThin;
    grandLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    const grandVal = sheet.getCell(`D${rowGrand}`);
    grandVal.value = parseFloat(currency(invoice.totalAmount));
    grandVal.numFmt = '#,##0.00';
    grandVal.font = { bold: true, size: 10, name: 'Arial' };
    grandVal.alignment = { horizontal: 'right' };
    grandVal.border = allThin;
    grandVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    // ─── Blank separator row ───
    const rowBlank = rowGrand + 1;
    sheet.getRow(rowBlank).height = 8;

    // ─── Bottom: GST No + Bank Details (left) | For Company (right) ───
    const rowBank = rowBlank + 1;
    sheet.getRow(rowBank).height = 14;
    sheet.mergeCells(`A${rowBank}:B${rowBank}`);
    const gstCell = sheet.getCell(`A${rowBank}`);
    gstCell.value = `GST NO :- ${company.gstNumber || ''}`;
    gstCell.font = { bold: true, size: 9, name: 'Arial' };
    gstCell.border = { top: mediumBorder, left: mediumBorder, right: thinBorder };

    sheet.mergeCells(`C${rowBank}:D${rowBank}`);
    const forCell = sheet.getCell(`C${rowBank}`);
    forCell.value = `For, ${company.companyName || 'Krishna Developers'}`;
    forCell.font = { bold: true, size: 9, name: 'Arial' };
    forCell.alignment = { horizontal: 'center' };
    forCell.border = { top: mediumBorder, left: thinBorder, right: mediumBorder };

    // Bank header row
    const rowBH = rowBank + 1;
    sheet.getRow(rowBH).height = 14;
    sheet.mergeCells(`A${rowBH}:B${rowBH}`);
    const bhCell = sheet.getCell(`A${rowBH}`);
    bhCell.value = 'Bank Details';
    bhCell.font = { bold: true, size: 9, name: 'Arial' };
    bhCell.border = { left: mediumBorder, right: thinBorder };

    sheet.mergeCells(`C${rowBH}:D${rowBH}`);
    const rightBH = sheet.getCell(`C${rowBH}`);
    rightBH.border = { left: thinBorder, right: mediumBorder };

    // Bank Name
    const rowBN = rowBH + 1;
    sheet.getRow(rowBN).height = 14;
    sheet.mergeCells(`A${rowBN}:B${rowBN}`);
    const bnCell = sheet.getCell(`A${rowBN}`);
    bnCell.value = `Bank Name:- ${company.bankName || ''}`;
    bnCell.font = { bold: true, size: 9, name: 'Arial' };
    bnCell.border = { left: mediumBorder, right: thinBorder };

    sheet.mergeCells(`C${rowBN}:D${rowBN}`);
    const rightBN = sheet.getCell(`C${rowBN}`);
    rightBN.border = { left: thinBorder, right: mediumBorder };

    // Account No
    const rowAC = rowBN + 1;
    sheet.getRow(rowAC).height = 14;
    sheet.mergeCells(`A${rowAC}:B${rowAC}`);
    const acCell = sheet.getCell(`A${rowAC}`);
    acCell.value = `A/c No.:-  ${company.accountNumber || ''}`;
    acCell.font = { size: 9, name: 'Arial' };
    acCell.border = { left: mediumBorder, right: thinBorder };

    sheet.mergeCells(`C${rowAC}:D${rowAC}`);
    const rightAC = sheet.getCell(`C${rowAC}`);
    rightAC.border = { left: thinBorder, right: mediumBorder };

    // IFSC
    const rowIF = rowAC + 1;
    sheet.getRow(rowIF).height = 14;
    sheet.mergeCells(`A${rowIF}:B${rowIF}`);
    const ifCell = sheet.getCell(`A${rowIF}`);
    ifCell.value = `IFSC Code:-  ${company.ifscCode || ''}`;
    ifCell.font = { size: 9, name: 'Arial' };
    ifCell.border = { left: mediumBorder, right: thinBorder };

    sheet.mergeCells(`C${rowIF}:D${rowIF}`);
    const rightIF = sheet.getCell(`C${rowIF}`);
    rightIF.border = { left: thinBorder, right: mediumBorder };

    // Branch + Authorized Signatory (side by side)
    const rowBR = rowIF + 1;
    sheet.getRow(rowBR).height = 22;
    sheet.mergeCells(`A${rowBR}:B${rowBR}`);
    const brCell = sheet.getCell(`A${rowBR}`);
    brCell.value = `Bank Branch:  ${company.branch || ''}`;
    brCell.font = { size: 9, name: 'Arial' };
    brCell.border = { left: mediumBorder, right: thinBorder, bottom: mediumBorder };

    sheet.mergeCells(`C${rowBR}:D${rowBR}`);
    const authCell = sheet.getCell(`C${rowBR}`);
    authCell.value = 'Authorized Signatory';
    authCell.font = { size: 9, name: 'Arial' };
    authCell.alignment = { horizontal: 'center', vertical: 'bottom' };
    authCell.border = { left: thinBorder, right: mediumBorder, bottom: mediumBorder };

    // ─── Stream the Excel file ───
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
};

module.exports = { generateInvoiceExcel };
