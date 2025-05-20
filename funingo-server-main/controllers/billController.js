import BillPaymentModel from "../models/bill.js";
import ExcelJS from "exceljs"

export const BillPayment= async(req,res)=>{

    try {
        const BillPaymentData = new BillPaymentModel(req.body);
        await BillPaymentData.save();
        res.status(201).json({success:true});
      } catch (error) {
        res.status(400).json({ error: error.message });
      }

}

export const BillExcel = async (req, res) => {
  try {
    const data = await BillPaymentModel.find({}).lean();

    if (!data.length) {
      return res.status(404).send('No data found to export');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Export');

    const columns = Object.keys(data[0]).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20
    }));

    const headingText = 'My Personalized Data Export';
    worksheet.addRow([]);
    worksheet.mergeCells(1, 1, 1, columns.length);
    const headingCell = worksheet.getCell('A1');
    headingCell.value = headingText;
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' };
    headingCell.font = { size: 16, bold: true };

    worksheet.columns = columns;

    data.forEach(item => {
      worksheet.addRow(item);
    });

    // Set headers for the response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');

    // Write the workbook to the response stream
    await workbook.xlsx.write(res);
    
    // End the response
    res.end();
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send('Error exporting data to Excel');
  }
};
