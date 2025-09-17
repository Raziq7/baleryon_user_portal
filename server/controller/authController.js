import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/otpSend.js";

// In-memory OTP store
const otpStore = {};

// Function for checking email pattern
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function for generating OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function for hashing passwords
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Function for comparing passwords
const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// @desc    Authenticate and register user
// @route   POST /api/user/auth
// @access  Public
export const authController = asyncHandler(async (req, res) => {
    let { email, password, isSignUp } = req.body;

    console.log(req.body, "req.body");

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    email = email.trim();
    password = password.trim();

    if (isSignUp) {
        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Generate OTP and send to email
        const otp = generateOTP();
        otpStore[email] = { otp, time: Date.now() }; // Store OTP with a timestamp

        console.log(otp, "otp");
        // Send OTP to email
        try {
            await sendEmail(email, 'Verify Your Email', `This is your OTP: ${otp}`);
            res.status(200).json({ message: "OTP sent to email" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }

    } else {
        // For Login
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePasswords(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        user.isActive = true;
        await user.save();
        const token = generateToken(user._id);

        res.status(200).json({ token, user: { email: user.email, name: user.firstName, userId: user._id } });
    }
});


export const verifyOtpController = asyncHandler(async (req, res) => {
    const { email, otp, firstName, lastName, mobile, password, gender } = req.body;



    if (!email || !otp || !password || !firstName || !mobile || !gender) {
        return res.status(400).json({ message: "Email, OTP, password, firstName, mobile, and gender are required" });
    }



    // Check if OTP exists for the given email
    const storedOtp = otpStore[email];

    if (!storedOtp) {
        return res.status(400).json({ message: "OTP not found or expired" });
    }


    // Check if OTP matches and is within the time limit (5 minutes)
    const isOtpExpired = Date.now() - storedOtp.time > 5 * 60 * 1000; // 5 minutes expiry

    if (isOtpExpired) {
        delete otpStore[email]; // Remove expired OTP from store
        return res.status(400).json({ message: "OTP expired" });
    }

    console.log(typeof storedOtp.otp, "__________", typeof otp, "storedOtp.otp, otp");

    if (storedOtp.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = new User({
        firstName,
        lastName: lastName || "",
        email,
        phone: mobile,
        password: hashedPassword,
        gender: gender || "Not Specified",
        isActive: true
    });


    // Save user to the database
    await user.save();

    // Clear OTP from in-memory store
    delete otpStore[email];

    // Generate token after registration
    const token = generateToken(user._id);

    console.log("tokentokentokentokentokentoken:", token);

    res.status(200).json({ message: "OTP verified successfully", token, user: { email: user.email, name: user.firstName, userId: user._id } });
});


export const userLogoutController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
  
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
  
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    // If you actually use express-session:
    if (req.session?.destroy) {
      return req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error logging out" });
        return res.status(200).json({ message: "Successfully logged out" });
      });
    }
  
    // Pure JWT (no server session)
    return res.status(200).json({ message: "Successfully logged out" });
  });


