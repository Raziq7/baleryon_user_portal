import express from "express";
import { listPublicCategories } from "../controller/categoryPublicController.js";

const router = express.Router();

// Public categories (no auth)
router.get("/", listPublicCategories); // /api/user/category

export default router;
