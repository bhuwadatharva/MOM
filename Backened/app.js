import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import { dbConnection } from "./database/dbConnection.js";
// import messageRouter from "./router/messageRouter.js";
import { errormiddleWare } from "./middlewares/errorMiddeware.js";
import userRouter from "./router/userRouter.js";
import meetingRouter from "./router/meetingRouter.js"
// import appointmentRouter from "./router/appointmentRouter.js";
// import casepaperRouter from "./router/casepaperRouter.js";
import multer from 'multer';
// import { sendMessage } from './controller/messController.js';
// import PdfDetails from "./models/pdfDetails.js";
// import twilio from "twilio";

const app = express();

// Serve static files from the "files" directory
// app.use("/files", express.static("files"));

// Configure environment variables
config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  dest: "files/",
  limits: { fileSize: 12 * 1024 * 1024 }, // 5MB file size limit
});

app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  try {
    const db = client.db("PdfSchema"); // Replace with your database name
    const collection = db.collection("Pdf"); // Replace with your collection name

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded file from the temporary path
    const pdfBuffer = fs.readFileSync(file.path);

    // Insert the PDF as a binary field in MongoDB
    const result = await collection.insertOne({
      fileName: file.originalname,
      fileData: new Binary(pdfBuffer), // Binary wrapper for buffer
      uploadedAt: new Date(),
    });

    // Delete the temporary file after uploading
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Failed to delete temporary file:", err);
      }
    });

    res.status(200).json({ id: result.insertedId });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

// API to view or download a PDF by its ID
app.get("/view-pdf/:id", async (req, res) => {
  try {
    const db = client.db("PdfSchema"); // Replace with your database name
    const collection = db.collection("Pdf"); // Replace with your collection name

    const { id } = req.params;
    const { download } = req.query; // Check if the 'download' query parameter is present
    const { ObjectId } = require("mongodb");

    // Find the PDF by ID
    const pdf = await collection.findOne({ _id: new ObjectId(id) });

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Set content type for PDF
    res.setHeader("Content-Type", "application/pdf");

    // Set content disposition based on the 'download' query parameter
    if (download === "true") {
      res.setHeader("Content-Disposition", `attachment; filename="${pdf.fileName}"`);
    } else {
      res.setHeader("Content-Disposition", `inline; filename="${pdf.fileName}"`);
    }

    // Send the PDF data as a response
    res.send(pdf.fileData.buffer);
  } catch (error) {
    console.error("Error retrieving PDF:", error);
    res.status(500).json({ error: "Failed to retrieve PDF" });
  }
});


// // Set up routes
// app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/meeting", meetingRouter);
// app.use("/api/v1/casepaper", casepaperRouter);

// // Handle message sending
// app.post('/send-message', sendMessage);

// Connect to the database
dbConnection();

// Error handling middleware
app.use(errormiddleWare);

// Route for uploading files
// app.post("/upload-files", upload.single("file"), async (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ status: "error", message: "No file uploaded" });
//     }
  
//    const title = req.body.title;
//     const fileName = req.file.filename;
//    // const fileUrl = `https://example.com/files/${fileName}`; // Replace with your public URL
//     //const to = req.body.phone; // Get the recipient phone number from the request body
  
//     try {
//       {/* await client.messages.create({
//         body: 'Here is the PDF you requested.',
//         from: 'whatsapp:+14155238886', // Twilio sandbox number or your Twilio number
//         to: `whatsapp:+91${to}`, // Recipient's WhatsApp number
//         mediaUrl: fileUrl
//       });
//       */}
//       await PdfDetails.create({ title: title, pdf: fileName });
//       res.send({ status: "ok" });
//     } catch (error) {
//       console.error('Error occurred:', error);
//       res.status(500).json({ status: "error", message: error.message });
//     }
//   });
  
  

export default app;
