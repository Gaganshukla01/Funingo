import { s3_client } from "../index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const pdfUploadS3 = async (req, res) => {
  try {
    const fileName = `Payment-Bill-${Date.now()}.pdf`; 
    const bucketName = "funingo-user-data-csv-1"; 

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: "application/pdf", 
    });

    const url = await getSignedUrl(s3_client, command, { expiresIn: 3600 }); 

    res.status(200).send({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).send({
      success: false,
      message: "Error generating presigned URL.",
      error: error.message,
    });
  }
};