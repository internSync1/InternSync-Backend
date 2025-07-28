import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
} from "../controllers/jobController";
import { authorize } from "../common/middleware/auth";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

// Applicant routes
router.get("/", firebaseAuth, (req, res, next) => getAllJobs(req as any, res, next));
router.get("/:id", firebaseAuth, (req, res, next) => getJobById(req as any, res, next));

// Admin routes
router.post("/", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => createJob(req as any, res, next));
router.put("/:id", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => updateJob(req as any, res, next));
router.delete("/:id", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => deleteJob(req as any, res, next));
router.patch("/:id/close", firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => closeJob(req as any, res, next));

export default router;
