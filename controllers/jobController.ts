import { Request, Response, NextFunction } from "express";
import Job from "../models/jobModel";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import { jobStatus } from "../constant/jobStatus";
import { IJob } from "../types/jobType";
import { IPaginationResponse, IPaginationRequest, IPaginateOptions } from "../types/paginationType";
import { paginate } from "../utils/pagination";
import Application from "../models/applicationModel";

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
            featured
        }: IPaginationRequest & {
            status?: string;
            startDate?: string;
            endDate?: string;
            sortBy?: string;
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
