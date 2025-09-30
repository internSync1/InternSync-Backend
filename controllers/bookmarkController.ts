import { Response, NextFunction } from "express";
import asyncHandler from "../common/middleware/async";
import Bookmark from "../models/bookmarkModel";
import { ProtectedRequest } from "../types/authType";



export const getUserBookmarks = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const format = String((req.query as any)?.format || 'jobs');
    const bookmarks = await Bookmark.find({ userId: req.user.id }).populate('jobId');

    if (format === 'jobs') {
        const jobs = (bookmarks as any[])
            .map((b: any) => b?.jobId)
            .filter((j: any) => !!j);
        return res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }

    // Legacy/explicit format=bookmarks: return bookmarks with populated jobId
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
});
