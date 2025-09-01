import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// OTP validation middleware
export const validateOtpRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({
            success: false,
            message: 'Email is required',
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
        return;
    }

    next();
};

export const validateOtpVerification = (req: Request, res: Response, next: NextFunction): void => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400).json({
            success: false,
            message: 'Email and OTP are required',
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
        return;
    }

    if (!/^\d{6}$/.test(otp)) {
        res.status(400).json({
            success: false,
            message: 'OTP must be a 6-digit number',
        });
        return;
    }

    next();
};
