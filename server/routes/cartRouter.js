import express from "express";
import {
  getCartController,
  addToCartController,
  removeFromCartController,
  clearCartController,
  updateCartController,
} from "../controller/cartController.js";  // Assuming cart controller is in 'controller/cartController.js'
import { verifyToken } from "../middlewares/tokenVerification.js"; // Verify token middleware

var router = express.Router();

// Get Cart (Authenticated User)
router.route("/")
  .get(verifyToken, getCartController)  // Fetch cart for authenticated user

// Add item to cart (Authenticated User)
router.route("/")
  .post(verifyToken, addToCartController)  // Add product to cart

// Remove item from cart (Authenticated User)
router.route("/")
  .delete(verifyToken, removeFromCartController)  // Remove product from cart

// Update item in cart (Authenticated User)
router.route("/:userId")
  .put(verifyToken, updateCartController)  // Update quantity of product in cart

// Clear cart (Authenticated User)
router.route("/clear")
  .delete(verifyToken, clearCartController);  // Clear the entire cart

export default router;
