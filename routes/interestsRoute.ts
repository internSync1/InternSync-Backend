import express from "express";
import {
  createInterest,
  deleteInterest,
  getInterest,
} from "../controllers/interestsController";
import { authorize, protect } from "../common/middleware/auth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", protect, getInterest);

// Admin routes
router.post("/", protect, authorize([UserRole.ADMIN]), createInterest);
router.delete("/:id", protect, authorize([UserRole.ADMIN]), deleteInterest);

export default router;
