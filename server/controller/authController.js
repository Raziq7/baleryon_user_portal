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

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  email = email.trim();

  if (isSignUp) {
    // only need email here
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const otp = String(generateOTP());
    otpStore[email] = { otp, time: Date.now() };
    try {
      await sendEmail(email, "Verify Your Email", `This is your OTP: ${otp}`);
      return res.status(200).json({ message: "OTP sent to email", email });
    } catch {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  } else {
    // LOGIN: need both email and password
    if (!password?.trim()) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    password = password.trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    user.isActive = true;
    await user.save();
    const token = generateToken(user._id);
    return res.status(200).json({
      token,
      user: { email: user.email, name: user.firstName, userId: user._id },
    });
  }
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  let { email, otp, firstName, lastName, mobile, password, gender } = req.body;

  if (!email || !otp || !password || !firstName || !mobile || !gender) {
    return res.status(400).json({
      message:
        "Email, OTP, password, firstName, mobile, and gender are required",
    });
  }

  email = String(email).trim();
  otp = String(otp).trim();
  mobile = String(mobile).trim();
  password = String(password).trim();

  const stored = otpStore[email];
  if (!stored)
    return res.status(400).json({ message: "OTP not found or expired" });

  const expired = Date.now() - stored.time > 5 * 60 * 1000;
  if (expired) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  const expected = String(stored.otp).trim();
  if (expected !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Uniqueness checks for both email & phone
  const existing = await User.findOne({ $or: [{ email }, { phone: mobile }] });
  if (existing) {
    const msg =
      existing.email === email
        ? "Email already in use"
        : "Mobile number already in use";
    return res.status(409).json({ message: msg });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    firstName,
    lastName: lastName || "",
    email,
    phone: mobile,
    password: hashedPassword,
    gender: gender || "Not Specified",
    isActive: true,
  });

  try {
    await user.save();
  } catch (err) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `${field} already in use` });
    }
    throw err;
  }

  delete otpStore[email];

  const token = generateToken(user._id);
  return res.status(200).json({
    message: "OTP verified successfully",
    token,
    user: { email: user.email, name: user.firstName, userId: user._id },
  });
});

// routes
// POST /api/user/auth/password/forgot
// POST /api/user/auth/password/reset

// controllers (pseudo matching your existing style)
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Invalid email" });

  const user = await User.findOne({ email: email.trim() });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  otpStore[`reset:${email}`] = { otp, time: Date.now() };

  await sendEmail(email, "Reset Password OTP", `Your OTP is: ${otp}`);
  return res.status(200).json({ message: "OTP sent" });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Missing fields" });

  const key = `reset:${email}`;
  const entry = otpStore[key];
  if (!entry) return res.status(400).json({ message: "OTP not found or expired" });
  if (Date.now() - entry.time > 5 * 60 * 1000)
    return res.status(400).json({ message: "OTP expired" });
  if (String(entry.otp) !== String(otp))
    return res.status(400).json({ message: "Invalid OTP" });

  const user = await User.findOne({ email: email.trim() });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await hashPassword(newPassword.trim());
  await user.save();
  delete otpStore[key];

  return res.status(200).json({ message: "Password reset successful" });
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
