import express from 'express';
import { setPassword, loginWithPassword, changePassword } from '../controllers/authController';
import { firebaseAuth } from '../common/middleware/firebaseAuth';

const router = express.Router();

/**
 * @swagger
 * /api/auth/set-password:
 *   post:
 *     summary: Set password for verified user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "mypassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Invalid input or passwords don't match
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Password already set
 */
router.post('/set-password', firebaseAuth, setPassword);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     hasPassword:
 *                       type: boolean
 *                 customToken:
 *                   type: string
 *       400:
 *         description: Password not set or invalid input
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginWithPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password for authenticated user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or passwords don't match
 *       401:
 *         description: Current password incorrect or unauthorized
 */
router.post('/change-password', firebaseAuth, changePassword);

export default router;
