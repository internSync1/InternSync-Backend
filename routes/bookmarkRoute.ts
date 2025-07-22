import express from "express";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmarkController";
import { protect } from "../common/middleware/auth";

const router = express.Router();

// Applicant routes
router.get("/user", protect, getUserBookmarks);
router.post("/job/:jobId", protect, addBookmark);
router.delete("/job/:jobId", protect, removeBookmark);

export default router;
