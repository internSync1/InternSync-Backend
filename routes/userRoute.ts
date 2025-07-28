import express from "express";
import {
  updateUserProfile,
  getUserProfile,
  syncUserWithFirebase,
} from "../controllers/userController";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { Request } from "express";

const router = express.Router();

// Sync user with Firebase after login
router.post("/sync", firebaseAuth, (req: Request, res, next) => syncUserWithFirebase(req as any, res, next));

router.put("/profile", firebaseAuth, (req: Request, res, next) => updateUserProfile(req as any, res, next));
router.get("/profile", firebaseAuth, (req: Request, res, next) => getUserProfile(req as any, res, next));

export default router;
