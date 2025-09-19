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
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { authorize } from "../common/middleware/auth";
import { UserRole } from "../constant/userRoles";
import { validateCreateJob } from "../common/validators/jobValidator";
import { handleValidationErrors } from "../common/middleware/validation";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/internships", listInternships);
router.get("/scholarships", listScholarships);
router.get("/extracurriculars", listExtracurriculars);
router.get("/:id", getJobById);

// Admin routes
router.use(firebaseAuth, authorize([UserRole.ADMIN]));

router.get("/:id/details", getJobDetails);
router.post("/", ...validateCreateJob, handleValidationErrors, createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.patch("/:id/close", closeJob);

export default router;
