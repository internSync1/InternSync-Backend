import express from "express";
import {
  updateUserProfile,
  getUserProfile,
  syncUserWithFirebase,
  updateAboutMe,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  updateSkills,
  updateLanguages,
  updateEducation,
  updateAppreciation,
  updateProfilePicture,
  updateResumeUrl,
} from "../controllers/userController";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import { Request } from "express";

const router = express.Router();

// Sync user with Firebase after login
router.post("/sync", firebaseAuth, (req: Request, res, next) => syncUserWithFirebase(req as any, res, next));

router.put("/profile", firebaseAuth, (req: Request, res, next) => updateUserProfile(req as any, res, next));
router.get("/profile", firebaseAuth, (req: Request, res, next) => getUserProfile(req as any, res, next));

// Focused profile endpoints
router.put('/about', firebaseAuth, (req: Request, res, next) => updateAboutMe(req as any, res, next));

// Work experience CRUD
router.post('/work-experience', firebaseAuth, (req: Request, res, next) => addWorkExperience(req as any, res, next));
router.put('/work-experience/:id', firebaseAuth, (req: Request, res, next) => updateWorkExperience(req as any, res, next));
router.delete('/work-experience/:id', firebaseAuth, (req: Request, res, next) => deleteWorkExperience(req as any, res, next));

// Array updates
router.put('/skills', firebaseAuth, (req: Request, res, next) => updateSkills(req as any, res, next));
router.put('/languages', firebaseAuth, (req: Request, res, next) => updateLanguages(req as any, res, next));
router.put('/education', firebaseAuth, (req: Request, res, next) => updateEducation(req as any, res, next));
router.put('/appreciation', firebaseAuth, (req: Request, res, next) => updateAppreciation(req as any, res, next));

// Media URLs (after /v1/file/upload)
router.put('/profile-picture', firebaseAuth, (req: Request, res, next) => updateProfilePicture(req as any, res, next));
router.put('/resume', firebaseAuth, (req: Request, res, next) => updateResumeUrl(req as any, res, next));

export default router;
