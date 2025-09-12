import express from 'express';
import { sendSignupOTP, verifySignupOTP, resendSignupOTP, finalizeSignup } from '../controllers/otpController';
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
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

/**
 * @swagger
 * /api/auth/signup/finalize:
 *   post:
 *     summary: Finalize signup by creating backend user after Firebase account is created
 *     description: Requires Firebase ID token in Authorization header. Verifies token and creates user record linked to provided uid and email.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - email
 *             properties:
 *               uid:
 *                 type: string
 *                 example: firebase-uid-123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Account finalized successfully
 *       400:
 *         description: Missing/invalid input or OTP not verified
 *       401:
 *         description: Invalid or missing token
 *       409:
 *         description: User already exists
 */
router.post('/signup/finalize', finalizeSignup);

// Legacy routes for backward compatibility
router.post('/send-otp', validateOtpRequest, sendSignupOTP);
router.post('/verify-otp', validateOtpVerification, verifySignupOTP);
router.post('/resend-otp', validateOtpRequest, resendSignupOTP);

export default router;
