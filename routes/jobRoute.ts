import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
} from "../controllers/jobController";
import { authorize, protect } from "../common/middleware/auth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", protect, getAllJobs);
router.get("/:id", protect, getJobById);

// Admin routes
router.post("/", protect, authorize([UserRole.ADMIN]), createJob);
router.put("/:id", protect, authorize([UserRole.ADMIN]), updateJob);
router.delete("/:id", protect, authorize([UserRole.ADMIN]), deleteJob);
router.patch("/:id/close", protect, authorize([UserRole.ADMIN]), closeJob);

export default router;
