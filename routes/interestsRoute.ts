import express from "express";
import {
  createInterest,
  deleteInterest,
  getInterest,
} from "../controllers/interestsController";
import { authorize } from "../common/middleware/auth";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", firebaseAuth, (req, res, next) => getInterest(req as any, res, next));

// Admin routes
router.post("/", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => createInterest(req as any, res, next));
router.delete("/:id", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => deleteInterest(req as any, res, next));

export default router;
