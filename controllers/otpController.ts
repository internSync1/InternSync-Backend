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
        firstName?: string;
        lastName?: string;
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

// Verify OTP and create new user account
export const verifySignupOTP = asyncHandler(async (req: OtpRequest, res: Response) => {
    const { email, otp, firstName, lastName } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and verification code are required',
        });
    }

    if (!firstName) {
        return res.status(400).json({
            success: false,
            message: 'First name is required for account creation',
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

        // Mark OTP as used
        await Otp.updateOne(
            { _id: otpRecord._id },
            { isUsed: true }
        );

        // Create Firebase user
        const firebaseUser = await admin.auth().createUser({
            email: email.toLowerCase(),
            emailVerified: true,
            displayName: `${firstName} ${lastName || ''}`.trim(),
        });

        // Create user in database
        const user = await User.create({
            firebaseUid: firebaseUser.uid,
            email: email.toLowerCase(),
            firstName: firstName,
            lastName: lastName || '',
            isActive: true,
        });

        // Send welcome email
        await emailService.sendWelcomeEmail(email, firstName);

        // Generate custom token for Firebase authentication
        const customToken = await admin.auth().createCustomToken(user.firebaseUid);

        // Clean up used OTPs for this email
        await Otp.deleteMany({ email: email.toLowerCase() });

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to InternSync.',
            user: {
                uid: user.firebaseUid,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isNewUser: true,
            },
            customToken,
        });
    } catch (error: any) {
        console.error('Error verifying signup OTP:', error);

        // Handle duplicate email error from Firebase
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create account. Please try again.',
        });
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
