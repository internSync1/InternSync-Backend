import express from 'express';
import {
    promoteToAdmin,
    demoteFromAdmin,
    getAdminUsers,
    getAllUsers,
    toggleUserStatus
} from '../controllers/adminController';
import { firebaseAuth } from '../common/middleware/firebaseAuth';
import { authorize } from '../common/middleware/auth';
import { UserRole } from '../constant/userRoles';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: Admin user management endpoints
 */

/**
 * @swagger
 * /v1/admin/users:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, applicant]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', firebaseAuth, authorize([UserRole.ADMIN]), getAllUsers);

/**
 * @swagger
 * /v1/admin/admins:
 *   get:
 *     summary: Get all admin users
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin users retrieved successfully
 */
router.get('/admins', firebaseAuth, authorize([UserRole.ADMIN]), getAdminUsers);

/**
 * @swagger
 * /v1/admin/promote/{userId}:
 *   patch:
 *     summary: Promote existing user to admin
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted to admin successfully
 *       400:
 *         description: User is already an admin
 *       404:
 *         description: User not found
 */
router.patch('/promote/:userId', firebaseAuth, authorize([UserRole.ADMIN]), promoteToAdmin);

/**
 * @swagger
 * /v1/admin/demote/{userId}:
 *   patch:
 *     summary: Remove admin role from user
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin role removed successfully
 *       400:
 *         description: User is not an admin
 *       404:
 *         description: User not found
 */
router.patch('/demote/:userId', firebaseAuth, authorize([UserRole.ADMIN]), demoteFromAdmin);

/**
 * @swagger
 * /v1/admin/toggle-status/{userId}:
 *   patch:
 *     summary: Toggle user active/inactive status
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       404:
 *         description: User not found
 */
router.patch('/toggle-status/:userId', firebaseAuth, authorize([UserRole.ADMIN]), toggleUserStatus);

/**
 * @swagger
 * /v1/admin/test/users:
 *   get:
 *     summary: Test endpoint - Get all users (bypasses auth for testing)
 *     tags: [Admin Management]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/test/users', getAllUsers);

/**
 * @swagger
 * /v1/admin/test/promote/{userId}:
 *   patch:
 *     summary: Test endpoint - Promote user to admin (bypasses auth for testing)
 *     tags: [Admin Management]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted successfully
 */
router.patch('/test/promote/:userId', promoteToAdmin);

/**
 * @swagger
 * /v1/admin/test/admins:
 *   get:
 *     summary: Test endpoint - Get all admin users (bypasses auth for testing)
 *     tags: [Admin Management]
 *     responses:
 *       200:
 *         description: Admin users retrieved successfully
 */
router.get('/test/admins', getAdminUsers);

export default router;
