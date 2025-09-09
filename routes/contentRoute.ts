import express from 'express';
import { getHouseRules, updateHouseRules } from '../controllers/contentController';
import { firebaseAuth } from '../common/middleware/firebaseAuth';
import { authorize } from '../common/middleware/auth';
import { UserRole } from '../constant/userRoles';

const router = express.Router();

// Public - fetch House Rules
router.get('/house-rules', (req, res, next) => getHouseRules(req as any, res, next));

// Admin - update House Rules
router.put('/house-rules', firebaseAuth, authorize([UserRole.ADMIN]), (req, res, next) => updateHouseRules(req as any, res, next));

export default router;
