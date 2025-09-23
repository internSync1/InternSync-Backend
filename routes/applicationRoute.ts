import express from 'express';
import {
    createApplication,
    getApplicationsByJob,
    updateApplicationStatus,
    getUserApplications,
    getApplicationSummary
} from '../controllers/applicationController';
import { authorize } from '../common/middleware/auth';
import { firebaseAuth } from '../common/middleware/firebaseAuth';
import { UserRole } from '../constant/userRoles';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup for resume uploads (pdf/doc/docx)
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

function checkResumeFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test((file.mimetype || '').toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Allowed resume types are pdf, doc, docx'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => checkResumeFileType(file, cb)
});

// Applicant routes
router.post('/job/:jobId', firebaseAuth, upload.single('resume'), (req, res, next) => createApplication(req as any, res, next));
router.get('/user/applications', firebaseAuth, (req, res, next) => getUserApplications(req as any, res, next));

// Admin routes
router.get('/summary', firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => getApplicationSummary(req as any, res, next));
router.get('/job/:jobId', firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => getApplicationsByJob(req as any, res, next));
router.patch('/:applicationId/status/:status', firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => updateApplicationStatus(req as any, res, next)); // status is now a route param

export default router;
