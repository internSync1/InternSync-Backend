import express from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authorize } from "../common/middleware/auth";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { UserRole } from "../constant/userRoles";

const router = express.Router();

router.get("/summary", firebaseAuth, authorize([UserRole.ADMIN]), getDashboardStats);

export default router;
