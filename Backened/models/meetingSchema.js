import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  members: [String], // Array of usernames
  emails: [String],  // Array of emails
  agenda: { type: String, required: true },
  date: { type: Date, required: true },
  host: { type: String, required: true },
  momContent: { type: String },
  pdf: {
    type:String,
  },
  
});


export const Meeting = mongoose.model("Meeting", MeetingSchema);
