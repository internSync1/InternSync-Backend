import express from 'express';
import { sendSignupOTP, verifySignupOTP, resendSignupOTP } from '../controllers/otpController';
import { validateOtpRequest, validateOtpVerification } from '../common/middleware/validation';

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup/send-otp:
 *   post:
 *     summary: Send verification OTP for signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       409:
 *         description: Account already exists
 *       400:
 *         description: Invalid email format
 *       500:
 *         description: Failed to send verification email
 */
router.post('/signup/send-otp', validateOtpRequest, sendSignupOTP);

/**
 * @swagger
 * /api/auth/signup/verify-otp:
 *   post:
 *     summary: Verify OTP and create user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - firstName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid or expired OTP
 *       409:
 *         description: Account already exists
 *       429:
 *         description: Too many failed attempts
 */
router.post('/signup/verify-otp', validateOtpVerification, verifySignupOTP);

/**
 * @swagger
 * /api/auth/signup/resend-otp:
 *   post:
 *     summary: Resend verification OTP for signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: New verification code sent successfully
 *       409:
 *         description: Account already exists
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/signup/resend-otp', validateOtpRequest, resendSignupOTP);

// Legacy routes for backward compatibility
router.post('/send-otp', validateOtpRequest, sendSignupOTP);
router.post('/verify-otp', validateOtpVerification, verifySignupOTP);
router.post('/resend-otp', validateOtpRequest, resendSignupOTP);

export default router;
