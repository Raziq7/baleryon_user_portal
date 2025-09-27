import express from "express";
import {
  authController,
  forgotPasswordController,
  resetPasswordController,
  userLogoutController,
  verifyOtpController,
} from "../controller/authController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

var router = express.Router();

// login | register
router.route("/").post(authController);

// verify-otp
router.route("/verify-otp").post(verifyOtpController);

router.route("/password/forgot").post(forgotPasswordController);

router.route("/password/reset").post(resetPasswordController);

// logout
router.route("/logout").post(verifyToken, userLogoutController);

export default router;
