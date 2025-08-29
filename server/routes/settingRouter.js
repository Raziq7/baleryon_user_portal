import express from "express";
import { getAllBanners } from "../controller/settingsController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/banner", getAllBanners);

export default router;
