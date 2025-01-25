import { Meeting } from "../models/meetingSchema.js";
import nodemailer from "nodemailer";
import { PDFDocument } from "pdf-lib";
import { convert } from "html-to-text";
import { User } from "../models/userSchema.js";

export const createMeeting = async (req, res) => {
  try {
    const { members, agenda, date, host, emails } = req.body;

    // Validate request data
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Members are required and should be an array." });
    }

    if (!emails || !Array.isArray(emails) || emails.length !== members.length) {
      return res
        .status(400)
        .json({
          message: "Emails are required and should match the number of members.",
        });
    }

    if (!agenda || !date) {
      return res
        .status(400)
        .json({ message: "Agenda and date are required." });
    }

    // Create a single meeting document
    const meeting = await Meeting.create({
      members, // Store all members in the meeting
      emails,  // Store all corresponding emails
      agenda,
      date,
      host,   // Store the host
    });

    res
      .status(201)
      .json({ message: "Meeting created successfully", data: meeting });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create meeting", error: error.message });
  }
};



export const getAllMeetings = async (req, res) => {
  try {
    // Get the search value from the query parameter or request body
    const { searchValue } = req.query; // Assuming it comes as a query parameter

    // Build a filter based on the search value
    const filter = searchValue
      ? {
          $or: [
            { host: { $regex: searchValue, $options: "i" } }, // Case-insensitive match for the host
            { members: { $regex: searchValue, $options: "i" } }, // Case-insensitive match for members
          ],
        }
      : {}; // No filter if no search value is provided

    // Fetch filtered meetings from the database
    const meetings = await Meeting.find(filter);

    // Respond with the retrieved meetings
    res.status(200).json({
      message: "Meetings fetched successfully",
      data: meetings,
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);

    // Respond with an error message
    res.status(500).json({
      message: "Failed to fetch meetings",
      error: error.message,
    });
  }
};




export const saveMomContent = async (req, res) => {
  try {
    const { meetingId, momContent } = req.body;

    if (!meetingId || !momContent) {
      return res.status(400).json({ message: "Meeting ID and MOM content are required." });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    meeting.momContent = momContent;

    const plainTextContent = convert(momContent, {
      wordwrap: 130,
      selectors: [
        { selector: "h2", options: { uppercase: false } },
        { selector: "p", options: { uppercase: false } },
        { selector: "ul", format: "inline" },
        { selector: "ol", format: "inline" },
      ],
    });

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const margin = 50;
    const fontSize = 12;

    const textLines = plainTextContent.split("\n");
    let yPosition = height - margin;

    for (const line of textLines) {
      if (yPosition <= margin) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = height - margin;
      }
      page.drawText(line, { x: margin, y: yPosition, size: fontSize });
      yPosition -= fontSize + 5;
    }

    const pdfBytes = await pdfDoc.save();
    meeting.pdf = Buffer.from(pdfBytes).toString("base64");

    await meeting.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "rcrusoe579@gmail.com",
        pass: "vjku indt lsrh wbja",
      },
    });

    const mailOptions = {
      from: "rcrusoe579@gmail.com",
      to: meeting.emails,
      subject: "Updated Minutes of Meeting (MOM)",
      text: "Please find the attached updated MOM.",
      attachments: [
        {
          filename: "Minutes_of_Meeting.pdf",
          content: Buffer.from(meeting.pdf, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "MOM content updated, PDF saved, and email sent successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Error in saveMomContent:", error);
    res.status(500).json({ message: "Failed to update MOM content", error: error.message });
  }
};


export const getMomContent = async (req, res) => {
  try {
    const { meetingId } = req.params;

    if (!meetingId) {
      return res.status(400).json({ message: "Meeting ID is required." });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    console.log("Meeting Retrieved:", meeting); // Debugging

    res.status(200).json({
      message: "MOM content fetched successfully",
      momContent: meeting.momContent || "",
      member: meeting.members || [],
      agenda: meeting.agenda || "",
      host: meeting.host || "",
      email: meeting.emails || "",
    });
  } catch (error) {
    console.error("Error in getMomContent:", error);
    res.status(500).json({ message: "Failed to fetch MOM content", error: error.message });
  }
};


export const getMeetingDetails = async (req, res) => {
  const { meetingId } = req.params;

  try {
    // Find the meeting by ID
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Return the meeting details
    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error fetching meeting details:", error);
    res.status(500).json({ message: "An error occurred while fetching meeting details" });
  }
};


export const sendEmail = async (req, res) => {
  try {
    const { pdf, emails, subject, body } = req.body;

    if (!pdf || !emails || !subject || !body) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "rcrusoe579@gmail.com",
        pass: "vjku indt lsrh wbja",
      },
    });

    const pdfBuffer = Buffer.from(pdf, "base64");

    const mailOptions = {
      from: "rcrusoe579@gmail.com",
      to: emails.join(", "),
      subject,
      text: body,
      attachments: [
        {
          filename: "Minutes_of_Meeting.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
