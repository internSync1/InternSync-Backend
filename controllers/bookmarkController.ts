import { Response, NextFunction } from "express";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import Bookmark from "../models/bookmarkModel";
import Job from "../models/jobModel";
import { ProtectedRequest } from "../types/authType";

export const addBookmark = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
        return next(new ErrorResponse(`Job not found`, 404));
    }

    const existingBookmark = await Bookmark.findOne({ userId, jobId });
    if (existingBookmark) {
        return res.status(200).json({ success: true, message: "Job already bookmarked" });
    }

    const bookmark = await Bookmark.create({ userId, jobId });
    res.status(201).json({ success: true, data: bookmark });
});

export const removeBookmark = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOneAndDelete({ userId, jobId });
    if (!bookmark) {
        return next(new ErrorResponse(`Bookmark not found`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

export const getUserBookmarks = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const bookmarks = await Bookmark.find({ userId: req.user.id }).populate('jobId', 'title company location status');
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
});
