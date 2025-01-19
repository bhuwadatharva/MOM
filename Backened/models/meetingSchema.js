import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  member: {
    type: [String], // Array of strings
    
  },
  agenda: {
    type: String,
   
  },
  date: {
    type: Date,
    
  },
  momContent: {
    type: String, // The MOM content in HTML or plain text
    
  },
  host: { 
    type: String,

  },
  email: {
    type: [String],
    unique: true,
},
pdf: {
  type:String,
},

});

export const Meeting = mongoose.model("Meeting", meetingSchema);
