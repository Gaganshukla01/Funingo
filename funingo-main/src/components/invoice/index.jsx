import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@mui/base";
import "./style.scss"
import Logo from "../../assets/logo.png";

const currentDate=()=>{

  const today = new Date();
  const yyyy = today.getFullYear();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mm = months[today.getMonth()];
  const dd = today.getDate();
  const formattedToday = `${dd} ${mm} ${yyyy}`; 
  
  return formattedToday;

}

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "353",
    invoiceDate: currentDate(),
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
                <h3>Date. {invoiceData.invoiceDate}</h3>
                <h3>GST No.:{invoiceData.gstNumber}</h3>
                <h3>HSN CODE.:{invoiceData.hsnCode}</h3>
                
            </div>

            <div id="mode">
               <h5>PAYMENT: {invoiceData.paymentMethod}</h5>
            </div>

            <div id="table">
                <table>
                    <tr id="head">
                      <th className="invoicehead" style={{borderRight:"3px solid black"}}>S.No</th>
                      <th className="invoicehead" style={{borderRight:"3px solid black"}}>Package</th>
                      <th className="invoicehead" style={{borderRight:"3px solid black"}}>Amount</th>
                      <th className="invoicehead">Net Amount</th>
                    </tr>
                    <tr id="datail">
                      <td className="invoicedatatable " style={{borderLeft:"3px solid black",borderBottom:"3px solid black"}}>1</td>
                      <td className="invoicedatatable " style={{borderLeft:"3px solid black",borderBottom:"3px solid black",borderRight:"3px solid black"}}>Coin Based/All in One</td>
                      <td className="invoicedatatable" style={{borderBottom:"3px solid black"}}>
                        <ul>
                          <li className="listInvoiceAmount" style={{borderBottom:"2px solid black"}}>Amount:{totalAmount}</li>
                          <li className="listInvoiceAmount" style={{borderBottom:"2px solid black"}}>CGST 9% :{totalCGST}</li>
                          <li className="listInvoiceAmount" style={{borderBottom:"2px solid black"}}>SGST 9% :{totalSGST}</li>
                          <li style={{padding:"10px"}}>Total Tax:{totalTax}</li>
                        </ul>
                      </td>
                      <td className="invoicedatatable" style={{borderLeft:"3px solid black",borderBottom:"3px solid black",borderRight:"3px solid black"}}>{grandTotal}</td>
                
                    </tr>
                </table>

                <div id="accountDetails">
                  
                </div>
            </div>

        </div>
        
      </div>

      <Button onClick={downloadInvoice}>Click me</Button>
    </>
  );
};

export default Invoice;
