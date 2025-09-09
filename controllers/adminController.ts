import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { UserRole } from '../constant/userRoles';

/**
 * Promote existing user to admin role
 */
export const promoteToAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (user.role === UserRole.ADMIN) {
            res.status(400).json({
                success: false,
                message: 'User is already an admin'
            });
            return;
        }

        user.role = UserRole.ADMIN;
        user.isActive = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User promoted to admin successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to promote user to admin',
            error
        });
    }
};

/**
 * Remove admin role from user
 */
export const demoteFromAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (user.role !== UserRole.ADMIN) {
            res.status(400).json({
                success: false,
                message: 'User is not an admin'
            });
            return;
        }

        user.role = UserRole.APPLICANT;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Admin role removed successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove admin role',
            error
        });
    }
};

/**
 * Get all admin users
 */
export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await User.find({ role: UserRole.ADMIN }).select('-__v');
        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve admin users',
            error
        });
    }
};

/**
 * Get all users (for admin to see who can be promoted)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, role } = req.query;

        const query: any = {};
        if (role && Object.values(UserRole).includes(role as UserRole)) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('_id firstName lastName email role isActive createdAt')
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error
        });
    }
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle user status',
            error
        });
    }
};
