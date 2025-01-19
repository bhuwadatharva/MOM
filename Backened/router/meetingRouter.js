import express from "express"
import { createMeeting, getAllMeetings,saveMomContent, getMomContent,getMeetingDetails, sendEmail} from "../controller/meetingController.js"
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/create",createMeeting);
router.post("/save-mom",saveMomContent);
router.get("/get-mom/:meetingId", getMomContent);
router.get("/meetings", getAllMeetings);
router.get("/details/:meetingId", getMeetingDetails);
router.post("/send-email",sendEmail)

export default router;
