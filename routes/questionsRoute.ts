import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
} from "../controllers/questionsController";
import { authorize } from "../common/middleware/auth";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", firebaseAuth, (req, res, next) => getQuestions(req as any, res, next));

// Admin routes
router.post("/", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => createQuestion(req as any, res, next));
router.put("/:id", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => deleteQuestion(req as any, res, next));

export default router;
