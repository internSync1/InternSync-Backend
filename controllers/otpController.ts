import { Request, Response } from 'express';
import asyncHandler from '../common/middleware/async';
import Otp from '../models/otpModel';
import User from '../models/userModel';
import emailService from '../services/emailService';
import admin from '../firebase/firebaseAdmin';
import crypto from 'crypto';

interface OtpRequest extends Request {
    body: {
        email: string;
        otp?: string;
    };
}

// Generate 6-digit OTP
const generateOTP = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP for signup verification
export const sendSignupOTP = asyncHandler(async (req: OtpRequest, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists. Please login instead.',
            });
        }

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email: email.toLowerCase() });

        // Generate new OTP
        const otp = generateOTP();

        // Save OTP to database
        await Otp.create({
            email: email.toLowerCase(),
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send OTP via email
        const emailSent = await emailService.sendOTP(email, otp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Verification code sent to your email. Please check your inbox.',
            email: email.toLowerCase(),
        });
    } catch (error: any) {
        console.error('Error sending signup OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Verify OTP and prepare for account creation
export const verifySignupOTP = asyncHandler(async (req: OtpRequest, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and verification code are required',
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Find the OTP record
        const otpRecord = await Otp.findOne({
            email: email.toLowerCase(),
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            // Check if OTP exists but is expired or used
            const expiredOtp = await Otp.findOne({
                email: email.toLowerCase(),
                otp,
            });

            if (expiredOtp) {
                if (expiredOtp.isUsed) {
                    return res.status(400).json({
                        success: false,
                        message: 'Verification code has already been used',
                    });
                }
                if (expiredOtp.expiresAt < new Date()) {
                    return res.status(400).json({
                        success: false,
                        message: 'Verification code has expired. Please request a new one.',
                    });
                }
            }

            // Increment attempts for rate limiting
            await Otp.updateOne(
                { email: email.toLowerCase() },
                { $inc: { attempts: 1 } }
            );

            return res.status(400).json({
                success: false,
                message: 'Invalid verification code',
            });
        }

        // Check attempt limit
        if (otpRecord.attempts >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Too many failed attempts. Please request a new verification code.',
            });
        }

        // Mark OTP as used and extend expiry slightly to allow finalize step
        await Otp.updateOne(
            { _id: otpRecord._id },
            { $set: { isUsed: true, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } }
        );

        // Do NOT create Firebase user or DB user here.
        // Frontend will now call Firebase createUserWithEmailAndPassword(email, password),
        // then call our finalize endpoint with the Firebase ID token to create the DB user.

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now create your account with Firebase.',
            email: email.toLowerCase(),
        });
    } catch (error: any) {
        console.error('Error verifying signup OTP:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create account. Please try again.',
        });
    }
});

// Finalize signup: expects Firebase ID token (Authorization: Bearer <idToken>) and uid/email in body
export const finalizeSignup = asyncHandler(async (req: Request, res: Response) => {
    const { uid, email } = req.body as { uid?: string; email?: string };

    if (!uid || !email) {
        return res.status(400).json({ success: false, message: 'uid and email are required' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token is required' });
    }

    const idToken = authHeader.split(' ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);

        // Validate that the token matches the provided uid/email
        if (decoded.uid !== uid) {
            return res.status(403).json({ success: false, message: 'UID does not match token' });
        }

        if (decoded.email && decoded.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(403).json({ success: false, message: 'Email does not match token' });
        }

        // Ensure user doesn't already exist
        const existingUser = await User.findOne({ $or: [{ firebaseUid: uid }, { email: email.toLowerCase() }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Ensure OTP was verified recently for this email
        const verifiedOtp = await Otp.findOne({ email: email.toLowerCase(), isUsed: true, expiresAt: { $gt: new Date() } });
        if (!verifiedOtp) {
            return res.status(400).json({ success: false, message: 'Please verify your email with OTP first or OTP has expired' });
        }

        // Create user record in DB
        const user = await User.create({
            firebaseUid: uid,
            email: email.toLowerCase(),
            isActive: true,
        });

        // Optional: send welcome email
        try { await emailService.sendWelcomeEmail(email); } catch (_) { }

        // Clean up OTPs for this email
        await Otp.deleteMany({ email: email.toLowerCase() });

        return res.status(201).json({
            success: true,
            message: 'Account finalized successfully',
            user: {
                uid: user.firebaseUid,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error finalizing signup:', err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

// Resend signup verification OTP
export const resendSignupOTP = asyncHandler(async (req: OtpRequest, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists. Please login instead.',
            });
        }

        // Check if there's a recent OTP request (rate limiting)
        const recentOtp = await Otp.findOne({
            email: email.toLowerCase(),
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) }, // Within last minute
        });

        if (recentOtp) {
            return res.status(429).json({
                success: false,
                message: 'Please wait at least 1 minute before requesting a new verification code',
            });
        }

        // Delete existing OTPs
        await Otp.deleteMany({ email: email.toLowerCase() });

        // Generate and send new OTP
        const otp = generateOTP();

        await Otp.create({
            email: email.toLowerCase(),
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        const emailSent = await emailService.sendOTP(email, otp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'New verification code sent to your email',
        });
    } catch (error: any) {
        console.error('Error resending signup OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Legacy endpoints for backward compatibility (if needed)
export const sendOTP = sendSignupOTP;
export const verifyOTP = verifySignupOTP;
export const resendOTP = resendSignupOTP;
