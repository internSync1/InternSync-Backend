import express from 'express';
import {
    createApplication,
    getApplicationsByJob,
    updateApplicationStatus,
    getUserApplications,
    getApplicationSummary
} from '../controllers/applicationController';
import { authorize, protect } from '../common/middleware/auth';
import { UserRole } from '../constant/userRoles';

const router = express.Router();

// Applicant routes
router.post('/job/:jobId', protect, createApplication);
router.get('/user/applications', protect, getUserApplications);

// Admin routes
router.get('/summary', protect, authorize([UserRole.ADMIN]), getApplicationSummary);
router.get('/job/:jobId',  protect, authorize([UserRole.ADMIN]), getApplicationsByJob);
router.patch('/:applicationId/status/:status',  protect, authorize([UserRole.ADMIN]), updateApplicationStatus); // status is now a route param

export default router;
