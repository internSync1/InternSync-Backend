import { Request, Response, NextFunction } from "express";
import Job from "../models/jobModel";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import { jobStatus } from "../constant/jobStatus";
import { IJob } from "../types/jobType";
import { IPaginationResponse, IPaginationRequest, IPaginateOptions } from "../types/paginationType";
import { paginate } from "../utils/pagination";
import Application from "../models/applicationModel";
import User from "../models/userModel";
import Interest from "../models/interestsModel";

export const getAllJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            pageNo = 1,
            offset: limit = 10,
            freeText,
            status,
            startDate,
            endDate,
            sortBy,
            categories,
            tags,
            sourceType,
            isRemote,
            jobType,
            stipendMin,
            stipendMax,
            deadlineBefore,
            deadlineAfter,
            featured,
            type,
            opportunityType,
            useUserPrefs
        }: IPaginationRequest & {
            status?: string;
            startDate?: string;
            endDate?: string;
            sortBy?: string;
            type?: string;
            opportunityType?: string;
            categories?: string;
            tags?: string;
            sourceType?: 'csv' | 'web' | string;
            isRemote?: string;
            jobType?: string;
            stipendMin?: string | number;
            stipendMax?: string | number;
            deadlineBefore?: string;
            deadlineAfter?: string;
            featured?: string;
            useUserPrefs?: string;
        } = req.query;

        const page = Number(pageNo);
        const skip = (page - 1) * Number(limit);

        const filterQuery: any = {};
        if (freeText && String(freeText).trim() !== "") {
            const normalizedKeyword = freeText
                .replace(/[-\s]/g, "")
                .toLowerCase();

            const labelsPattern =
                normalizedKeyword
                    .split("")
                    .map((char) => `[\\s-]*${char}`)
                    .join("");

            const regex = new RegExp(normalizedKeyword, "i");
            const labelRegex = new RegExp(labelsPattern, "i");

            filterQuery.$or = [
                { title: regex },
                { "company.name": regex },
                { "description.details": regex },
                { location: regex },
                { labels: labelRegex },
            ];
        }

        if (status) {
            filterQuery.status = status;
        }

        if (startDate && endDate) {
            filterQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // High-level type filter (alias: opportunityType). Maps to jobType/categories.
        const rawType = String((req.query as any).type || (req.query as any).opportunityType || '').trim().toLowerCase();
        if (rawType) {
            const map: Record<string, { jobType: string[]; categories: string[] }> = {
                internship: { jobType: ['internship', 'internships'], categories: ['Internship', 'Internships'] },
                scholarship: { jobType: ['scholarship', 'scholarships', 'fellowship', 'grant'], categories: ['Scholarship', 'Scholarships', 'Fellowship', 'Grant'] },
                extracurricular: {
                    jobType: ['extracurricular', 'extracurriculars', 'volunteer', 'volunteering', 'activity', 'activities'],
                    categories: ['Extracurricular', 'Extracurriculars', 'Volunteer', 'Volunteering', 'Activity', 'Activities']
                },
                activity: { jobType: ['activity', 'activities'], categories: ['Activity', 'Activities'] },
            };

            let typeJobTypes: string[] = [];
            let typeCategories: string[] = [];

            if (map.internship.jobType.includes(rawType) || map.internship.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.internship.jobType;
                typeCategories = map.internship.categories;
            } else if (map.scholarship.jobType.includes(rawType) || map.scholarship.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.scholarship.jobType;
                typeCategories = map.scholarship.categories;
            } else if (map.extracurricular.jobType.includes(rawType) || map.extracurricular.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.extracurricular.jobType;
                typeCategories = map.extracurricular.categories;
            } else if (map.activity.jobType.includes(rawType) || map.activity.categories.map(s => s.toLowerCase()).includes(rawType)) {
                typeJobTypes = map.activity.jobType;
                typeCategories = map.activity.categories;
            }

            if (typeJobTypes.length || typeCategories.length) {
                const orClause: any[] = [];
                if (typeJobTypes.length) orClause.push({ jobType: { $in: typeJobTypes } });
                if (typeCategories.length) orClause.push({ categories: { $in: typeCategories } });
                if (orClause.length) filterQuery.$and = [...(filterQuery.$and || []), { $or: orClause }];
            }
        }

        // Advanced filters
        if (categories) {
            const arr = String(categories).split(',').map((s) => s.trim()).filter(Boolean);
            if (arr.length) filterQuery.categories = { $in: arr };
        }

        if (tags) {
            const arr = String(tags).split(',').map((s) => s.trim()).filter(Boolean);
            if (arr.length) filterQuery.tags = { $in: arr };
        }

        if (sourceType) {
            filterQuery.sourceType = String(sourceType).toLowerCase();
        }

        if (typeof isRemote !== 'undefined') {
            const val = String(isRemote).toLowerCase();
            if (['true', 'false'].includes(val)) filterQuery.isRemote = val === 'true';
        }

        if (jobType) {
            filterQuery.jobType = jobType;
        }

        if (deadlineBefore || deadlineAfter) {
            filterQuery.applicationDeadline = {} as any;
            if (deadlineAfter) (filterQuery.applicationDeadline as any).$gte = new Date(String(deadlineAfter));
            if (deadlineBefore) (filterQuery.applicationDeadline as any).$lte = new Date(String(deadlineBefore));
        }

        if (typeof featured !== 'undefined') {
            const val = String(featured).toLowerCase();
            if (['true', 'false'].includes(val)) filterQuery['visibility.featured'] = val === 'true';
        }

        if (stipendMin || stipendMax) {
            filterQuery['description.stipend.amount'] = {} as any;
            if (stipendMin) (filterQuery['description.stipend.amount'] as any).$gte = Number(stipendMin);
            if (stipendMax) (filterQuery['description.stipend.amount'] as any).$lte = Number(stipendMax);
        }

        // Apply user preferences and interests when requested and available
        const useUserPrefsFlag = String(useUserPrefs || '').toLowerCase() === 'true';
        if (useUserPrefsFlag && (req as any).user) {
            try {
                const userCtx: any = (req as any).user;
                const userDoc = userCtx?.id ? await User.findById(userCtx.id).lean() : null;
                const prefs: any = (userDoc as any)?.jobPreferences || {};

                // Work mode
                const remoteRegex = /remote|virtual|anywhere/i;
                if (prefs?.workMode === 'remote') {
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { $or: [{ isRemote: true }, { location: remoteRegex }] }
                    ];
                } else if (prefs?.workMode === 'onsite' || prefs?.workMode === 'hybrid') {
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { $or: [{ isRemote: false }, { location: { $not: remoteRegex } }] }
                    ];
                }

                // Employment type (heuristic using weeklyHours/tags/categories)
                if (prefs?.employmentType === 'full_time') {
                    const ftRegex = /full[-\s]?time/i;
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        {
                            $or: [
                                { weeklyHours: { $gte: 35 } },
                                { tags: { $in: [ftRegex, 'Full Time', 'Full-Time'] } },
                                { categories: { $in: [ftRegex, 'Full Time', 'Full-Time'] } },
                                { labels: { $in: [ftRegex, 'Full Time', 'Full-Time'] } }
                            ]
                        }
                    ];
                }

                // Locations
                const locs: string[] = Array.isArray(prefs?.locations) ? prefs.locations.filter(Boolean) : [];
                if (locs.length) {
                    const locRegexes = locs.map((l) => new RegExp(String(l).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { $or: [{ location: { $in: locRegexes } }, { 'company.address': { $in: locRegexes } }] }
                    ];
                }

                // Interests -> categories/tags
                let interestNames: string[] = [];
                if (Array.isArray(userDoc?.interests) && userDoc!.interests.length > 0) {
                    const fetched = await Interest.find({ _id: { $in: userDoc!.interests } }, { name: 1 }).lean();
                    const fetchedNames = (fetched || []).map((i: any) => String(i?.name || '').trim()).filter(Boolean);
                    const rawAsNames = (userDoc!.interests as any[])
                        .filter((v) => typeof v === 'string' && !fetchedNames.includes(v as string))
                        .map((v) => String(v));
                    interestNames = Array.from(new Set([...(fetchedNames as string[]), ...rawAsNames]));
                }
                if (interestNames.length) {
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { $or: [{ categories: { $in: interestNames } }, { tags: { $in: interestNames } }] }
                    ];
                }
            } catch (e) {
                // Non-fatal; continue without user prefs
            }
        }

        const sortQuery: any = {};
        switch (sortBy) {
            case 'appsReceived_asc':
                sortQuery.appsReceived = 1; break;
            case 'appsReceived_desc':
                sortQuery.appsReceived = -1; break;
            case 'relevance_desc':
                sortQuery.relevancyScore = -1; sortQuery.createdAt = -1; break;
            case 'deadline_asc':
                sortQuery.applicationDeadline = 1; break;
            case 'deadline_desc':
                sortQuery.applicationDeadline = -1; break;
            default:
                sortQuery.createdAt = -1;
        }

        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    appsReceived: { $size: "$applications" }
                }
            },
            {
                $match: filterQuery
            },
            {
                $sort: sortQuery
            },
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    applications: 0 // Exclude the applications array from the final output
                }
            }
        ]);

        const totalJobs = await Job.countDocuments(filterQuery);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total: totalJobs,
            pages: Math.ceil(totalJobs / Number(limit)),
            data: jobs
        });
    }
);

function wrapListByType(forcedType: 'internship' | 'scholarship' | 'extracurricular') {
    return (req: Request, res: Response, next: NextFunction) => {
        (req.query as any).type = forcedType;
        return (getAllJobs as any)(req, res, next);
    };
}

export const listInternships = wrapListByType('internship');
export const listScholarships = wrapListByType('scholarship');
export const listExtracurriculars = wrapListByType('extracurricular');

export const getJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = req.params.id;
        if (!jobId) {
            return next(new ErrorResponse("Job ID is required", 400));
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }
        res.status(200).json({
            success: true,
            data: job,
        });
    }
);

export const createJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobRequest = req.body;
        // Ensure defaults for origin and application mode
        if (!jobRequest.sourceType) jobRequest.sourceType = 'web';
        if (!jobRequest.applyMode) jobRequest.applyMode = 'native';
        const job = new Job(jobRequest);
        await job.save();
        res.status(201).json({
            success: true,
            data: job,
        });
    }
);

export const updateJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(
            jobId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }
        res.status(200).json({
            success: true,
            data: job,
        });
    }
);

export const deleteJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }
        res.status(200).json({
            success: true,
            message: `Job with ID: ${jobId} deleted successfully`,
        });
    }
);

export const closeJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(
            jobId,
            { status: jobStatus.CLOSED },
            { new: true, runValidators: true }
        );
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }
        res.status(200).json({
            success: true,
            data: job,
        });
    }
);

export const getJobDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobId = req.params.id;
        if (!jobId) {
            return next(new ErrorResponse("Job ID is required", 400));
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ErrorResponse(`Job not found with ID: ${jobId}`, 404));
        }

        const applications = await Application.find({ jobId }).populate('userId', 'firstName lastName email profilePicture');

        res.status(200).json({
            success: true,
            data: {
                job,
                applications
            }
        });
    }
);
