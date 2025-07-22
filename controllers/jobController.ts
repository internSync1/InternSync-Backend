import { Request, Response, NextFunction } from "express";
import Job from "../models/jobModel";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import { jobStatus } from "../constant/jobStatus";
import { IJob } from "../types/jobType";
import { IPaginationResponse, IPaginationRequest, IPaginateOptions } from "../types/paginationType";
import { paginate } from "../utils/pagination";
export const getAllJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            pageNo = 1,
            offset: limit = 10,
            freeText
        }: IPaginationRequest = req.query;

        const filterQuery: any = {};
        if (freeText && String(freeText).trim() !== "") {
            const normalizedKeyword = freeText
                .replace(/[-\s]/g, "")
                .toLowerCase();

            const labelsPattern =
                normalizedKeyword
                    .split("")
                    .map((char) => `[\\s-]*${char}`)
                    .join("") + "[\\s-]*";

            const regex = new RegExp(normalizedKeyword, "i");
            const labelRegex = new RegExp(labelsPattern, "i");

            filterQuery.$or = [
                { designation: regex },
                { "company.name": regex },
                { "description.details": regex },
                { location: regex },
                { labels: labelRegex },
            ];
        }

        const paginationOptions: IPaginateOptions<IJob> = {
            page: pageNo,
            limit: limit,
            query: filterQuery,
            sort: { createdAt: -1 },
        };

        const resp: IPaginationResponse = await paginate<IJob>(Job, paginationOptions);

        res.status(200).json(resp);
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
