import asyncHandler from "express-async-handler";
import { Wishlist } from "../models/Wishlist.js";
import User from "../models/User.js";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlistController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const wishlist = await Wishlist.findOne({ userId: user._id }).populate('items.productId');
  console.log(wishlist,"wishlistwishlistwishlistwishlist");
  

  res.status(200).json(wishlist || { items: [] });
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlistController = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  console.log(req.body,"asdjfhaksjdhfkdjhf");
  

  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  let wishlist = await Wishlist.findOne({ userId: user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ userId: user._id, items: [] });
  }

  const alreadyExists = wishlist.items.some(item =>
    item.productId.toString() === productId 
    // item.size === size &&
    // item.color === color
  );

  if (alreadyExists) {
    return res.status(400).json({ message: "Item already in wishlist" });
  }

  wishlist.items.push({ productId });
  await wishlist.save();

  res.status(200).json(wishlist);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlistController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const wishlist = await Wishlist.findOne({ userId: user._id });
  if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

  wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
  await wishlist.save();

  res.status(200).json(wishlist);
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlistController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await Wishlist.findOneAndDelete({ userId: user._id });

  res.status(200).json({ message: "Wishlist cleared successfully" });
});
