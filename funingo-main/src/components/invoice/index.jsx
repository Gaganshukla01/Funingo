import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@mui/base";
import "./style.scss"
import Logo from "../../assets/logo.png";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "353",
    invoiceDate: "2025-01-17",
    gstNumber: "23AAJFF2527Q1Z5",
    hsnCode: "999699",
    paymentMethod: "CASH",
    items: [
      { item: "Coin Based / All in One", amount: 13050, cgst: 9, sgst: 9 },
    ],
  });

  const calculateTaxes = (amount, rate) => (amount * rate) / 100;
  const totalAmount = invoiceData.items.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const totalCGST = calculateTaxes(totalAmount, 9);
  const totalSGST = calculateTaxes(totalAmount, 9);
  const totalTax = totalCGST + totalSGST;
  const grandTotal = totalAmount + totalTax;

  const downloadInvoice = () => {
    const invoiceContent = document.getElementById("invoice-template");
    html2pdf()
      .from(invoiceContent)
      .save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <>
      <div id="invoice-template" >
        <div id="invoice-main">
            <div id="upperDiv">
                <h3>S.NO.: {invoiceData.invoiceNumber}</h3>
                <h3>TAX INVOICE</h3>
                <img src={Logo} alt="err"/>
                
                
            </div>

            <div id="lowerDiv">
                <h3>Date. 1</h3>
                <h3>GST No.:{invoiceData.gstNumber}</h3>
                <h3>HSN CODE.:{invoiceData.hsnCode}</h3>
                
            </div>

            <div id="mode">
               <h5>PAYMENT: {invoiceData.paymentMethod}</h5>
            </div>

            <div id="table">
                <table>
                    <th>
                        
                    </th>
                </table>
            </div>

        </div>
        
      </div>

      <Button onClick={downloadInvoice}>Click me</Button>
    </>
  );
};

export default Invoice;
