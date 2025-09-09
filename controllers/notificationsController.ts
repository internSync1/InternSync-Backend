import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../common/middleware/async';
import User from '../models/userModel';
import Notification from '../models/notificationModel';
import pushService from '../services/pushService';

interface AuthRequest extends Request {
    user?: { uid: string; email?: string };
}

export const registerDevice = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.body as { token?: string };
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, message: 'token (string) is required' });
    }

    const firebaseUid = req.user?.uid!;
    const user = await User.findOneAndUpdate(
        { firebaseUid },
        { $addToSet: { deviceTokens: token } },
        { new: true, upsert: false }
    );

    return res.status(200).json({ success: true, tokens: user?.deviceTokens || [] });
});

export const unregisterDevice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { token } = req.body as { token?: string };
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, message: 'token (string) is required' });
    }

    const firebaseUid = req.user?.uid!;
    const user = await User.findOneAndUpdate(
        { firebaseUid },
        { $pull: { deviceTokens: token } },
        { new: true }
    );

    return res.status(200).json({ success: true, tokens: user?.deviceTokens || [] });
});

export const listNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { pageNo = 1, offset = 20, unreadOnly } = req.query as any;
    const page = Number(pageNo);
    const limit = Number(offset);
    const skip = (page - 1) * limit;

    const user = await User.findOne({ firebaseUid: req.user?.uid! });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const query: any = { userId: user._id };
    if (String(unreadOnly).toLowerCase() === 'true') query.read = false;

    const [items, total, unread] = await Promise.all([
        Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(query),
        Notification.countDocuments({ userId: user._id, read: false }),
    ]);

    return res.status(200).json({ success: true, count: items.length, total, pages: Math.ceil(total / limit), unread, data: items });
});

export const markRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const user = await User.findOne({ firebaseUid: req.user?.uid! });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const n = await Notification.findOneAndUpdate({ _id: id, userId: user._id }, { read: true }, { new: true });
    if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.status(200).json({ success: true, data: n });
});

export const markAllRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findOne({ firebaseUid: req.user?.uid! });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const result = await Notification.updateMany({ userId: user._id, read: false }, { $set: { read: true } });
    return res.status(200).json({ success: true, updated: result.modifiedCount });
});

export const sendTest = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findOne({ firebaseUid: req.user?.uid! });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const tokens = user.deviceTokens || [];
    const { invalidTokens } = await pushService.sendToTokens(tokens, {
        title: 'Test Notification',
        body: 'This is a test notification from InternSync backend',
        data: { type: 'test' }
    });

    if (invalidTokens.length) {
        await User.updateOne({ _id: user._id }, { $pull: { deviceTokens: { $in: invalidTokens } } });
    }

    return res.status(200).json({ success: true, sentTo: tokens.length, invalidTokens });
});
