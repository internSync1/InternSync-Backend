import { Request, Response } from 'express';
import asyncHandler from '../common/middleware/async';
import User from '../models/userModel';
import admin from '../firebase/firebaseAdmin';

interface AuthRequest extends Request {
    body: {
        email: string;
        password: string;
        confirmPassword?: string;
        newPassword?: string;
    };
    user?: any;
}

// Set password for verified user
export const setPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { password, confirmPassword } = req.body;
    const { uid } = req.user;

    if (!password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and confirm password are required',
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match',
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long',
        });
    }

    try {
        // Find user by Firebase UID
        const user = await User.findOne({ firebaseUid: uid }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.hasPassword) {
            return res.status(409).json({
                success: false,
                message: 'Password already set. Use change password instead.',
            });
        }

        // Set password in Firebase
        await admin.auth().updateUser(uid, {
            password: password,
        });

        // Set password in database
        user.password = password;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password set successfully',
        });
    } catch (error: any) {
        console.error('Error setting password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to set password. Please try again.',
        });
    }
});

// Login with email and password
export const loginWithPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
        });
    }

    try {
        // Find user and include password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (!user.hasPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password not set. Please set up your password first.',
                requiresPasswordSetup: true,
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate Firebase custom token
        const customToken = await admin.auth().createCustomToken(user.firebaseUid);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                uid: user.firebaseUid,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                hasPassword: user.hasPassword,
            },
            customToken,
        });
    } catch (error: any) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
        });
    }
});

// Change password for existing user
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { password: currentPassword, newPassword, confirmPassword } = req.body;
    const { uid } = req.user;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Current password, new password, and confirm password are required',
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'New passwords do not match',
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'New password must be at least 6 characters long',
        });
    }

    try {
        const user = await User.findOne({ firebaseUid: uid }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (!user.hasPassword) {
            return res.status(400).json({
                success: false,
                message: 'No password set. Use set password instead.',
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Update password in Firebase
        await admin.auth().updateUser(uid, {
            password: newPassword,
        });

        // Update password in database
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error: any) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password. Please try again.',
        });
    }
});
