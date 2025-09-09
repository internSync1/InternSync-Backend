import { Router } from "express";
import {
    getNextJob,
    handleSwipe,
    getSwipeHistory,
    getLikedJobs,
    getSwipeStats
} from "../controllers/swipeController";
import { firebaseAuth } from "../common/middleware/firebaseAuth";

const router = Router();

// All swipe routes require authentication
router.use(firebaseAuth);

// Get next job for swiping
router.get("/next", getNextJob);

// Handle swipe action
router.post("/action", handleSwipe);

// Get user's swipe history
router.get("/history", getSwipeHistory);

// Get liked jobs
router.get("/liked", getLikedJobs);

// Get swipe statistics
router.get("/stats", getSwipeStats);

export default router;
