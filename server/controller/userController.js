import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { Address } from "../models/Address.js";

// @desc Get user profile
// @route GET /api/user/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const address = await Address.findOne({ userId });

  res.json({
    user,
    address,
  });
});

// @desc Update user profile
// @route PUT /api/user/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { name, phone, gender } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.firstName = name || user.name;
  user.phone = phone || user.phone;
  user.gender = gender || user.gender;

  const updatedUser = await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
    },
  });
});