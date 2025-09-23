import { Router } from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    closeJob,
    getJobDetails,
    listInternships,
    listScholarships,
    listExtracurriculars
} from "../controllers/jobController";
import { firebaseAuth, optionalFirebaseAuth } from "../common/middleware/firebaseAuth";
import { authorize } from "../common/middleware/auth";
import { UserRole } from "../constant/userRoles";
import { validateCreateJob } from "../common/validators/jobValidator";
import { handleValidationErrors } from "../common/middleware/validation";

const router = Router();

// Public routes
// Optional auth allows personalizing with useUserPrefs=true without requiring a token
router.get("/", optionalFirebaseAuth, getAllJobs);
router.get("/internships", optionalFirebaseAuth, listInternships);
router.get("/scholarships", optionalFirebaseAuth, listScholarships);
router.get("/extracurriculars", optionalFirebaseAuth, listExtracurriculars);
router.get("/:id", getJobById);

// Admin routes
router.use(firebaseAuth, authorize([UserRole.ADMIN]));

router.get("/:id/details", getJobDetails);
router.post("/", ...validateCreateJob, handleValidationErrors, createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.patch("/:id/close", closeJob);

export default router;
