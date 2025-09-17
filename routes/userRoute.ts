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
  updateHeadline,
  uploadProfilePicture,
  uploadResume,
} from "../controllers/userController";
import { firebaseAuth } from "../common/middleware/firebaseAuth";
import multer from "multer";
import path from "path";
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

// Headline (user-visible role)
router.put('/headline', firebaseAuth, (req: Request, res, next) => updateHeadline(req as any, res, next));

// Multer setup for direct user uploads (images, pdf, doc/x)
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype.toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Allowed types are images (jpg,jpeg,png,gif,webp) and pdf/doc/docx'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

// Direct upload endpoints (multipart/form-data)
router.post('/upload/profile-picture', firebaseAuth, upload.single('file'), (req: Request, res, next) => uploadProfilePicture(req as any, res, next));
router.post('/upload/resume', firebaseAuth, upload.single('file'), (req: Request, res, next) => uploadResume(req as any, res, next));

export default router;
