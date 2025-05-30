import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import html2pdf from "html2pdf.js";
import Logo from "../../assets/logo.png";
import axios from "axios";
import { apiUrl } from "../../constants";

const Invoice = ({ invoiceData }) => 
  {
  const invoiceRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateTaxes = (amount, rate) => (amount * rate) / 100;
  const totalAmount = invoiceData.totalAmount;
  const totalCGST = calculateTaxes(totalAmount, 9);
  const totalSGST = calculateTaxes(totalAmount, 9);
  const totalTax = totalCGST + totalSGST;
  const grandTotal = totalAmount + totalTax;

  const downloadPDF = async (pdfBlob) => {
    try {
      setIsProcessing(false);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceData.invoiceNumber}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setErrorMessage("Error downloading invoice: " + error.message);
    }
  };

  const postBillPayment = async () => {
    try {

      const salesId= await axios.get(`${apiUrl}/insights/salesId`)
      let Id=salesId.data.nextId
        const [month, day, year] = invoiceData.invoiceDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const responseSales= await axios.post(`${apiUrl}/insights/salesadd`,{
        _id: Id,
        date: formattedDate,
        amount: totalAmount,
        section: "Ticket Counter",
        split: "Activities"
      })
      
      const response = await axios.post(`${apiUrl}/bill/billpayment`, {
        sno: invoiceData.invoiceNumber,
        Date: invoiceData.invoiceDate,
        CashAmount: invoiceData.cashAmount,
        OnlineAmount: invoiceData.onlineAmount,
        paymentType: invoiceData.paymentMethod,
        amount: totalAmount,
        cgst: totalCGST,
        sgst: totalSGST,
        total: grandTotal,
      });
      if (response.data.success) {
        console.log("Data is added");
      } else {
        console.error("Failed to add data");
      }
    } catch (error) {
      console.error("Error posting bill payment:", error);
    }
  };

  const generateAndDownloadPDF = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage("");
      
      // Show invoice for rendering
      setShowInvoice(true);
      
      // Wait a moment for rendering
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const invoiceContent = invoiceRef.current;
      
      if (!invoiceContent) {
        console.error("Invoice content not available");
        setErrorMessage("Invoice content not available");
        return;
      }
      
      const options = {
        margin: 10,
        filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generate PDF as blob
      const pdfBlob = await html2pdf()
        .set(options)
        .from(invoiceContent)
        .output('blob');
      
      console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");
      
      // Hide invoice after PDF generation
      setShowInvoice(false);
      
      // Download the PDF
      await downloadPDF(pdfBlob);
      
    } catch (error) {
      console.error("Error in PDF generation or download:", error);
      setErrorMessage("Error processing invoice: " + error.message);
      setShowInvoice(false);
    }
  };

  useEffect(() => {
    if (invoiceData) {
      const timer = setTimeout(() => {
        generateAndDownloadPDF();
        postBillPayment(); // This will always execute
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [invoiceData]);

  return (
    <div>
      {isProcessing && <div className="upload-status">Generating PDF...</div>}
      {errorMessage && (
        <div className="upload-status error">
          {errorMessage}
        </div>
      )}
      
      {showInvoice && (
        <div ref={invoiceRef}>
          <div id="invoice-main">
          <div id="upperDiv">
            <h3>S.NO.: {invoiceData.invoiceNumber}</h3>
            <h3>TAX INVOICE</h3>
            <img src={Logo} alt="Company Logo" />
          </div>

          <div id="lowerDiv">
            <h3>Date: {invoiceData.invoiceDate}</h3>
            <h3>GST No.: {invoiceData.gstNumber}</h3>
            <h3>HSN CODE.: {invoiceData.hsnCode}</h3>
          </div>

          <div id="mode">
            <h5>PAYMENT: {invoiceData.paymentMethod}</h5>
          </div>

          <div id="table">
            <table>
              <thead>
                <tr id="head">
                  <th className="invoicehead" style={{ borderRight: "3px solid black" }}>S.No</th>
                  <th className="invoicehead" style={{ borderRight: "3px solid black" }}>Package</th>
                  <th className="invoicehead" style={{ borderRight: "3px solid black" }}>Amount</th>
                  <th className="invoicehead">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr id="datail">
                  <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black" }}>1</td>
                  <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black", borderRight: "3px solid black" }}>Coin Based/All in One</td>
                  <td className="invoicedatatable" style={{ borderBottom: "3px solid black" }}>
                    <ul>
                      <li className="listInvoiceAmount" style={{ borderBottom : "2px solid black" }}>Amount: {totalAmount}</li>
                      <li className="listInvoiceAmount" style={{ borderBottom: "2px solid black" }}>CGST 9%: {totalCGST}</li>
                      <li className="listInvoiceAmount" style={{ borderBottom: "2px solid black" }}>SGST 9%: {totalSGST}</li>
                      <li style={{ padding: "10px" }}>Total Tax: {totalTax}</li>
                    </ul>
                  </td>
                  <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black", borderRight: "3px solid black" }}>{grandTotal}</td>
                </tr>
              </tbody>
            </table>

            <div id="accountDetails" style={{ border: "3px solid black", marginTop: "1rem", height: "8rem", padding: "20px" }}>
              <h3 style={{ marginBottom: "8px" }}>Bank Name: YES BANK</h3>
              <h3 style={{ marginBottom: "8px" }}>A/C No.: 044463700000949</h3>
              <h3 style={{ marginBottom: "8px" }}>IFSC CODE: YESB0000444</h3>
            </div>

            <h4 style={{ marginTop: "14px" }}>
              This is a system-generated invoice and does not require signature or Stamp.
            </h4>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;





















// import React, { useEffect, useRef, useState } from "react";
// import "./style.scss";
// import html2pdf from "html2pdf.js";
// import Logo from "../../assets/logo.png";
// import axios from "axios";
// import { apiUrl } from "../../constants";

// const Invoice = ({ invoiceData }) => {
//   const invoiceRef = useRef(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const calculateTaxes = (amount, rate) => (amount * rate) / 100;
//   const totalAmount = invoiceData.totalAmount;
//   const totalCGST = calculateTaxes(totalAmount, 9);
//   const totalSGST = calculateTaxes(totalAmount, 9);
//   const totalTax = totalCGST + totalSGST;
//   const grandTotal = totalAmount + totalTax;

//   const uploadInvoice = async (pdfBlob) => {

//     try {
//       setIsUploading(true);
//       setErrorMessage("");
      
   
//       console.log("Getting pre-signed URL...");
//       const response = await axios.post(`${apiUrl}/s3upload/uploadfile`, {
//         fileName: `Invoice_${invoiceData.invoiceNumber}.pdf`,
//       });
      
//       if (!response.data.success) {
//         throw new Error("Failed to get pre-signed URL");
//       }
      
//       const { url } = response.data;
//       console.log("Pre-signed URL received:", url);
      
     
//       console.log("Uploading PDF to S3...");
//       const uploadResponse = await axios.put(url, pdfBlob, {
//         headers: {
//           'Content-Type': 'application/pdf',
//         },
      
//         timeout: 30000,
      
//         transformRequest: [(data) => data],
//       });
      
//       console.log("Upload successful! Status:", uploadResponse.status);
//       setUploadStatus("success");
      
   
//       const publicUrl = url.split('?')[0];
//       console.log("Public URL:", publicUrl);
      
//       alert("Invoice uploaded successfully!");
//       return publicUrl;
//     } catch (error) {
//       console.error("Error uploading invoice:", error);
      
 
//       let message = "Failed to upload invoice.";
//       if (error.message === "Network Error" || error.message.includes("Failed to fetch")) {
//         message = "Network error. Please check your internet connection.";
//       } else if (error.response) {
//         message = `Server error: ${error.response.status} ${error.response.statusText}`;
//       } else if (error.request) {
//         message = "No response from server. Please try again later.";
//       }
      
//       setErrorMessage(message);
//       setUploadStatus("error");
//       throw error;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const postBillPayment = async () => {
//     try {
//       const response = await axios.post(`${apiUrl}/bill/billpayment`, {
//         sno: invoiceData.invoiceNumber,
//         Date: invoiceData.invoiceDate,
//         CashAmount:invoiceData.cashAmount,
//         OnlineAmount:invoiceData.onlineAmount,
//         paymentType: invoiceData.paymentMethod,
//         amount: totalAmount,
//         cgst: totalCGST,
//         sgst: totalSGST,
//         total: grandTotal,
//       });
//       if (response.data.success) {
//         console.log("Data is added");
//       } else {
//         console.error("Failed to add data");
//       }
//     } catch (error) {
//       console.error("Error posting bill payment:", error);
//     }
//   };

//   const generateAndUploadPDF = async () => {
//     try {
      
//       const invoiceContent = invoiceRef.current;
      
//       if (!invoiceContent) {
//         console.error("Invoice content not available");
//         setErrorMessage("Invoice content not available");
//         return;
//       }
      
    
//       const options = {
//         margin: 10,
//         filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//       };
      
//       // Generate PDF as blob
//       const pdfBlob = await html2pdf()
//         .set(options)
//         .from(invoiceContent)
//         .output('blob');
      
//       console.log("PDF generated successfully, size:", pdfBlob.size, "bytes");
      
//       // Upload the PDF
//       const pdfUrl = await uploadInvoice(pdfBlob);
      
//       if (pdfUrl) {
//         console.log("Invoice process completed successfully");
//         return pdfUrl;
//       }
//     } catch (error) {
//       console.error("Error in PDF generation or upload:", error);
//       alert("Error uploading invoice: " + (errorMessage || error.message));
//     }
//   };

//   useEffect(() => {

    
     
//     if (invoiceData) {
   
//       const timer = setTimeout(() => {
//         generateAndUploadPDF();
//         postBillPayment()
//       }, 2000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [invoiceData]);

//   return (
//     <div>
//       {isUploading && <div className="upload-status">Uploading invoice...</div>}
//       {uploadStatus === "error" && (
//         <div className="upload-status error">
//           {errorMessage || "Failed to upload invoice. Please try again."}
//         </div>
//       )}
      
//       <div ref={invoiceRef}>
//         <div id="invoice-main">
//           <div id="upperDiv">
//             <h3>S.NO.: {invoiceData.invoiceNumber}</h3>
//             <h3>TAX INVOICE</h3>
//             <img src={Logo} alt="Company Logo" />
//           </div>

//           <div id="lowerDiv">
//             <h3>Date: {invoiceData.invoiceDate}</h3>
//             <h3>GST No.: {invoiceData.gstNumber}</h3>
//             <h3>HSN CODE.: {invoiceData.hsnCode}</h3>
//           </div>

//           <div id="mode">
//             <h5>PAYMENT: {invoiceData.paymentMethod}</h5>
//           </div>

//           <div id="table">
//             <table>
//               <thead>
//                 <tr id="head">
//                   <th className="invoicehead" style={{ borderRight: "3px solid black" }}>S.No</th>
//                   <th className="invoicehead" style={{ borderRight: "3px solid black" }}>Package</th>
//                   <th className="invoicehead" style={{ borderRight: "3px solid black" }}>Amount</th>
//                   <th className="invoicehead">Net Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr id="datail">
//                   <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black" }}>1</td>
//                   <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black", borderRight: "3px solid black" }}>Coin Based/All in One</td>
//                   <td className="invoicedatatable" style={{ borderBottom: "3px solid black" }}>
//                     <ul>
//                       <li className="listInvoiceAmount" style={{ borderBottom : "2px solid black" }}>Amount: {totalAmount}</li>
//                       <li className="listInvoiceAmount" style={{ borderBottom: "2px solid black" }}>CGST 9%: {totalCGST}</li>
//                       <li className="listInvoiceAmount" style={{ borderBottom: "2px solid black" }}>SGST 9%: {totalSGST}</li>
//                       <li style={{ padding: "10px" }}>Total Tax: {totalTax}</li>
//                     </ul>
//                   </td>
//                   <td className="invoicedatatable" style={{ borderLeft: "3px solid black", borderBottom: "3px solid black", borderRight: "3px solid black" }}>{grandTotal}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <div id="accountDetails" style={{ border: "3px solid black", marginTop: "1rem", height: "8rem", padding: "20px" }}>
//               <h3 style={{ marginBottom: "8px" }}>Bank Name: YES BANK</h3>
//               <h3 style={{ marginBottom: "8px" }}>A/C No.: 044463700000949</h3>
//               <h3 style={{ marginBottom: "8px" }}>IFSC CODE: YESB0000444</h3>
//             </div>

//             <h4 style={{ marginTop: "14px" }}>
//               This is a system-generated invoice and does not require signature or Stamp.
//             </h4>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;