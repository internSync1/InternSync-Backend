import express from "express";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from "../controllers/bookmarkController";
import { firebaseAuth } from "../common/middleware/firebaseAuth";

const router = express.Router();

// Applicant routes
router.get("/user", firebaseAuth, (req, res, next) => getUserBookmarks(req as any, res, next));
router.post("/job/:jobId", firebaseAuth, (req, res, next) => addBookmark(req as any, res, next));
router.delete("/job/:jobId", firebaseAuth, (req, res, next) => removeBookmark(req as any, res, next));

export default router;
