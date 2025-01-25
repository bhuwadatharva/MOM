import express from "express"
import { registerUser, loginUser, logoutUser, searchUser, getUserDetails, getAllUsers } from "../controller/userController.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",isAuthenticated,logoutUser);
router.get("/search", searchUser);
router.get("/me", isAuthenticated,getUserDetails);
router.get("/getuser",getAllUsers);

export default router;