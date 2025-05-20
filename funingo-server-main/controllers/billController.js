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

    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Payment Type', key: 'paymentType', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'CGST', key: 'cgst', width: 10 },
      { header: 'SGST', key: 'sgst', width: 10 },
      { header: 'Total', key: 'total', width: 15 }
    ];

 
    const headingText = 'FUNINGO BILLS';
    worksheet.addRow([]); 
    worksheet.mergeCells(1, 1, 1, worksheet.columns.length); 
    const headingCell = worksheet.getCell('A1');
    headingCell.value = headingText; 
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' }; 
    headingCell.font = { size: 16, bold: true }; 

    
    worksheet.addRow(worksheet.columns.map(col => col.header)); 

   
    data.forEach((item, index) => {
      worksheet.addRow({
        sno: item.sno,                   
        date: item.Date || '',    
        paymentType: item.paymentType || '',
        amount: item.amount || 0,
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        total: item.total || 0
      });
    });

  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');

 
    await workbook.xlsx.write(res);
    
    res.end();
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send('Error exporting data to Excel');
  }
};

