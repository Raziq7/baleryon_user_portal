import express from "express";
import {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
  clearWishlistController,
} from "../controller/wishlistController.js";
import { verifyToken } from "../middlewares/tokenVerification.js"; // assuming you're using JWT

const router = express.Router();

router
  .route("/")
  .get(verifyToken, getWishlistController)
  .post(verifyToken, addToWishlistController)
  .delete(verifyToken, clearWishlistController);

router.route("/:productId").delete(verifyToken, removeFromWishlistController);

export default router;
