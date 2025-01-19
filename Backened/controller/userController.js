import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js"; // Fixed typo
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password, designation } = req.body;

    if (!username || !email || !password || !designation) {
        return next(new ErrorHandler("Please provide all required fields!", 400));
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return next(new ErrorHandler("Username is already taken!", 400));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return next(new ErrorHandler("Email is already registered!", 400));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        designation,
    });

    generateToken(user, "Registration successful!", 201, res);
});

// Login user
export const loginUser = async (req, res, next) => {
  try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
          return next(new ErrorHandler("Username and password are required.", 400));
      }

      // Find user and include password explicitly
      const user = await User.findOne({ username }).select("+password");

      if (!user) {
          return next(new ErrorHandler("Invalid username or password.", 401));
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
          return next(new ErrorHandler("Invalid username or password.", 401));
      }

      res.status(200).json({
          success: true,
          message: "Login successful!",
          user: { id: user._id, username: user.username, email: user.email, designation: user.designation},
      });
  } catch (error) {
      console.error("Login error:", error);
      next(new ErrorHandler("Login failed.", 500));
  }
};

  

// Logout user
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Logged out successfully!",
    });
});

// Search user by username
 // Assuming you have a catchAsyncErrors middleware

export const searchUser = catchAsyncErrors(async (req, res, next) => {
    const { username } = req.query;

    if (!username) {
        return next(new ErrorHandler("Please provide a username to search!", 400));
    }

    // Use regular expression to search usernames starting with the provided 'username' letter(s)
    const users = await User.find({
        username: { $regex: `^${username}`, $options: 'i' },  // Case-insensitive search for usernames starting with 'username'
    });

    if (users.length === 0) {
        return next(new ErrorHandler("No users found with that initial letter.", 404));
    }

    res.status(200).json({
        success: true,
        message: "Users found!",
        data: users.map(user => ({
            username: user.username,
            email: user.email,
            designation: user.designation,
        })),
    });
});

// Get user details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find(); // Fetch all users
  
    if (users.length === 0) {
      return next(new ErrorHandler("No users found.", 404));
    }
  
    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: users.map(user => ({
        username: user.username,
        email: user.email,
        designation: user.designation,
      })),
    });
  });
  
