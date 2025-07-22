import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
} from "../controllers/questionsController";
import { protect, authorize } from "../common/middleware/auth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", protect, getQuestions);

// Admin routes
router.post("/", protect, authorize([UserRole.ADMIN]), createQuestion);
router.put("/:id", protect, authorize([UserRole.ADMIN]), deleteQuestion);

export default router;
