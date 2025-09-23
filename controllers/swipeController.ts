import { Request, Response, NextFunction } from "express";
import Job from "../models/jobModel";
import SwipeHistory from "../models/swipeHistoryModel";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import { IJob } from "../types/jobType";
import "../types/authType";
import User from "../models/userModel";
import Interest from "../models/interestsModel";

// Get next job for swiping (personalized based on user's swipe history)
export const getNextJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.uid;
        const { type, opportunityType } = req.query as { type?: string; opportunityType?: string };

        if (!userId) {
            return next(new ErrorResponse("User authentication required", 401));
        }

        // Load user's saved preferences and interests
        const userDoc = await User.findById((req.user as any).id).lean();
        const jobPrefs = (userDoc as any)?.jobPreferences || {};
        let interestNames: string[] = [];
        if (Array.isArray(userDoc?.interests) && userDoc!.interests.length > 0) {
            try {
                const interests = await Interest.find({ _id: { $in: userDoc!.interests } }).lean();
                const fetched = (interests || []).map((i: any) => String(i?.name || '').trim()).filter(Boolean);
                // Also include any values already stored as names (not matching an existing Interest _id)
                const rawAsNames = (userDoc!.interests as any[])
                    .filter((v) => typeof v === 'string' && !fetched.includes(v))
                    .map((v) => String(v));
                interestNames = Array.from(new Set([...fetched, ...rawAsNames])) as string[];
            } catch { /* ignore */ }
        }

        // Get jobs the user has already swiped on
        const swipedJobs = await SwipeHistory.find({ userId }).select('jobId');
        const swipedJobIds = swipedJobs.map(swipe => swipe.jobId);

        // Get user's preferences based on liked jobs
        const likedJobs = await SwipeHistory.find({
            userId,
            action: { $in: ['like', 'superlike'] }
        }).populate('jobId');

        // Extract preferred tags and categories from liked jobs
        const preferredTags = new Set<string>();
        const preferredCategories = new Set<string>();

        for (const swipe of likedJobs) {
            if (swipe.jobTags) {
                swipe.jobTags.forEach(tag => preferredTags.add(tag));
            }
            if (swipe.jobCategories) {
                swipe.jobCategories.forEach(cat => preferredCategories.add(cat));
            }
        }

        // Build query for next job
        let query: any = {
            _id: { $nin: swipedJobIds },
            'visibility.displayInApp': true,
            status: 'OPEN',
        };

        // Enforce CSV-origin opportunities (support legacy docs without sourceType)
        query.$and = [...(query.$and || []), { $or: [{ sourceType: 'csv' }, { source: 'CSV Import' }] }];

        // Apply user's saved work mode and locations as hard filters when present
        const remoteRegex = /remote|virtual|anywhere/i;
        if (jobPrefs?.workMode === 'remote') {
            query.$and = [
                ...(query.$and || []),
                { $or: [{ isRemote: true }, { location: remoteRegex }] }
            ];
        } else if (jobPrefs?.workMode === 'onsite' || jobPrefs?.workMode === 'hybrid') {
            query.$and = [
                ...(query.$and || []),
                { $or: [{ isRemote: false }, { location: { $not: remoteRegex } }] }
            ];
        }

        const locs: string[] = Array.isArray(jobPrefs?.locations) ? jobPrefs!.locations.filter(Boolean) : [];
        if (locs.length) {
            const locRegexes = locs.map((l) => new RegExp(String(l).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
            query.$and = [
                ...(query.$and || []),
                {
                    $or: [
                        { location: { $in: locRegexes } },
                        { 'company.address': { $in: locRegexes } }
                    ]
                }
            ];
        }

        // Optional filtering by high-level type / tab selection
        const rawType = (type || opportunityType || '').toString().trim().toLowerCase();
        const map: Record<string, { jobType: string[]; categories: string[] }> = {
            internship: { jobType: ['internship', 'internships'], categories: ['Internship', 'Internships'] },
            scholarship: { jobType: ['scholarship', 'scholarships', 'fellowship', 'grant'], categories: ['Scholarship', 'Scholarships', 'Fellowship', 'Grant'] },
            activity: { jobType: ['activity', 'activities'], categories: ['Activity', 'Activities'] },
            // Treat extracurricular bucket as superset including activities and volunteering
            extracurricular: {
                jobType: ['extracurricular', 'extracurriculars', 'volunteer', 'volunteering', 'activity', 'activities'],
                categories: ['Extracurricular', 'Extracurriculars', 'Volunteer', 'Volunteering', 'Activity', 'Activities']
            },
        };

        let typeJobTypes: string[] = [];
        let typeCategories: string[] = [];

        if (rawType) {
            if (map.internship.jobType.includes(rawType) || map.internship.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.internship.jobType;
                typeCategories = map.internship.categories;
            } else if (map.scholarship.jobType.includes(rawType) || map.scholarship.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.scholarship.jobType;
                typeCategories = map.scholarship.categories;
            } else if (map.activity.jobType.includes(rawType) || map.activity.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.activity.jobType;
                typeCategories = map.activity.categories;
            } else if (map.extracurricular.jobType.includes(rawType) || map.extracurricular.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.extracurricular.jobType;
                typeCategories = map.extracurricular.categories;
            }
        } else {
            // Default: allow all primary buckets
            typeJobTypes = Array.from(new Set([
                ...map.internship.jobType,
                ...map.scholarship.jobType,
                ...map.activity.jobType,
                ...map.extracurricular.jobType,
            ]));
            typeCategories = Array.from(new Set([
                ...map.internship.categories,
                ...map.scholarship.categories,
                ...map.activity.categories,
                ...map.extracurricular.categories,
            ]));
        }

        if (typeJobTypes.length || typeCategories.length) {
            const orClause: any[] = [];
            if (typeJobTypes.length) orClause.push({ jobType: { $in: typeJobTypes } });
            if (typeCategories.length) orClause.push({ categories: { $in: typeCategories } });
            if (orClause.length) {
                query.$and = [...(query.$and || []), { $or: orClause }];
            }
        }

        // If user has preferences, prioritize jobs with matching tags/categories
        let sortQuery: any = { relevancyScore: -1, createdAt: -1 };

        if (preferredTags.size > 0 || preferredCategories.size > 0 || interestNames.length > 0) {
            // First try to find jobs matching user preferences
            const preferenceQuery: any = {
                ...query,
                $and: [
                    ...((query as any).$and || []),
                    {
                        $or: [
                            { tags: { $in: Array.from(preferredTags) } },
                            { categories: { $in: Array.from(preferredCategories) } },
                            { categories: { $in: interestNames } },
                        ]
                    }
                ]
            };

            let job = await Job.findOne(preferenceQuery).sort(sortQuery);

            if (job) {
                return res.status(200).json({
                    success: true,
                    data: job,
                    isPersonalized: true
                });
            }
        }

        // If no personalized job found, get any available job
        const job = await Job.findOne(query).sort(sortQuery);

        if (!job) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "No more jobs available"
            });
        }

        res.status(200).json({
            success: true,
            data: job,
            isPersonalized: false
        });
    }
);

// Handle swipe action (like, dislike, superlike, skip)
export const handleSwipe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.uid;
        const { jobId, action } = req.body;

        if (!userId) {
            return next(new ErrorResponse("User authentication required", 401));
        }

        if (!jobId || !action) {
            return next(new ErrorResponse("Job ID and action are required", 400));
        }

        if (!['like', 'dislike', 'superlike', 'skip'].includes(action)) {
            return next(new ErrorResponse("Invalid action. Must be: like, dislike, superlike, or skip", 400));
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }

        // Check if user already swiped on this job
        const existingSwipe = await SwipeHistory.findOne({ userId, jobId });
        if (existingSwipe) {
            // Update existing swipe
            existingSwipe.action = action;
            existingSwipe.swipedAt = new Date();
            await existingSwipe.save();
        } else {
            // Create new swipe record
            const swipeRecord = new SwipeHistory({
                userId,
                jobId,
                action,
                jobTitle: job.title,
                jobTags: job.tags,
                jobCategories: job.categories,
            });
            await swipeRecord.save();
        }

        // If it's a like or superlike, we might want to trigger additional actions
        // (e.g., notifications, application suggestions, etc.)
        let additionalData: any = {};

        if (action === 'like' || action === 'superlike') {
            additionalData.message = "Job added to your liked list!";
            additionalData.canApply = true;
        }

        res.status(200).json({
            success: true,
            message: `Job ${action}d successfully`,
            data: {
                jobId,
                action,
                ...additionalData
            }
        });
    }
);

// Get user's swipe history
export const getSwipeHistory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.uid;
        const { action, page = 1, limit = 20 } = req.query;

        if (!userId) {
            return next(new ErrorResponse("User authentication required", 401));
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        let query: any = { userId };
        if (action) {
            query.action = action;
        }

        const swipes = await SwipeHistory.find(query)
            .sort({ swipedAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('jobId');

        const total = await SwipeHistory.countDocuments(query);

        res.status(200).json({
            success: true,
            count: swipes.length,
            total,
            pages: Math.ceil(total / limitNum),
            data: swipes
        });
    }
);

// Get liked jobs (for easy access to jobs user is interested in)
export const getLikedJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.uid;
        const { page = 1, limit = 20 } = req.query;

        if (!userId) {
            return next(new ErrorResponse("User authentication required", 401));
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const likedSwipes = await SwipeHistory.find({
            userId,
            action: { $in: ['like', 'superlike'] }
        })
            .sort({ swipedAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('jobId');

        const total = await SwipeHistory.countDocuments({
            userId,
            action: { $in: ['like', 'superlike'] }
        });

        // Extract job data from populated swipes
        const likedJobs = likedSwipes.map(swipe => ({
            swipeId: swipe._id,
            swipedAt: swipe.swipedAt,
            action: swipe.action,
            job: swipe.jobId
        }));

        res.status(200).json({
            success: true,
            count: likedJobs.length,
            total,
            pages: Math.ceil(total / limitNum),
            data: likedJobs
        });
    }
);

// Get swipe statistics for user
export const getSwipeStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.uid;

        if (!userId) {
            return next(new ErrorResponse("User authentication required", 401));
        }

        const stats = await SwipeHistory.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalSwipes = await SwipeHistory.countDocuments({ userId });

        const formattedStats: { [key: string]: number } = {
            totalSwipes,
            likes: 0,
            dislikes: 0,
            superlikes: 0,
            skips: 0
        };

        stats.forEach(stat => {
            const key = stat._id + 's';
            if (key in formattedStats) {
                formattedStats[key] = stat.count;
            }
        });

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    }
);
