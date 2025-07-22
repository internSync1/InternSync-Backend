import express from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  updateUserProfile,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController";
import { protect } from "../common/middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/otp-verify", verifyOtp);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);
router.get("/profile", protect, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
