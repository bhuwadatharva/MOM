import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Replace with your secret key
    req.user = await User.findById(decoded.id).select("username email"); // Populate req.user with user details
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};
