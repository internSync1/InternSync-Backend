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

const router = express.Router();

// Applicant routes
router.post('/job/:jobId', firebaseAuth, (req, res, next) => createApplication(req as any, res, next));
router.get('/user/applications', firebaseAuth, (req, res, next) => getUserApplications(req as any, res, next));

// Admin routes
router.get('/summary', firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => getApplicationSummary(req as any, res, next));
router.get('/job/:jobId',  firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => getApplicationsByJob(req as any, res, next));
router.patch('/:applicationId/status/:status',  firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => updateApplicationStatus(req as any, res, next)); // status is now a route param

export default router;
