
import asyncHandler from "express-async-handler";
import Banner from "../models/Banner.js";

// GET /api/admin/banners
export const getAllBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  });
  
  // GET /api/admin/banners/:id
  export const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  });
  