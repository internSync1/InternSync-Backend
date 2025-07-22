import { Request, Response, NextFunction } from "express";
import asyncHandler from "../common/middleware/async";
import ErrorResponse from "../common/utils/errorResponse";
import Application from "../models/applicationModel";
import Job from "../models/jobModel";
import { ProtectedRequest } from "../types/authType";
import { ApplicationStatus } from "../constant/applicationStatus";
import { validateApplicationStatus } from "../utils/common";
import { IPaginationRequest, IPaginationResponse, IPaginateOptions } from "../types/paginationType";
import { paginate } from "../utils/pagination";
import { IApplication } from "../types/applicationType";

export const createApplication = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'OPEN') {
        return next(new ErrorResponse(`Job not found or not open for applications`, 404));
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
        return next(new ErrorResponse(`You have already applied for this job`, 400));
    }

    if (job.status !== 'OPEN') {
        return next(new ErrorResponse(`This job is no longer accepting applications.`, 400));
    }

    const { ApplicantName, resumeUrl, portfolioLink, text } = req.body;

    const application = await Application.create({
        jobId,
        userId,
        applicantName: ApplicantName ? ApplicantName : (req.user.firstName + ' ' + req.user.lastName) ? req.user.firstName + ' ' + req.user.lastName : '',
        resumeUrl,
        portfolioLink,
        text,
        status: ApplicationStatus.PENDING,
    });

    res.status(201).json({ success: true, data: application });
});

export const getUserApplications = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const {
        pageNo = 1,
        offset: limit = 10,
        freeText
    }: IPaginationRequest = req.query;

    const filterQuery: any = {
        userId: req.user.id
    };

    if (freeText && String(freeText).trim() !== "") {
        const regex = new RegExp(freeText.trim(), "i");
        filterQuery.status = regex;
    }

    const paginationOptions: IPaginateOptions<IApplication> = {
        page: pageNo,
        limit: limit,
        query: filterQuery,
        populate: [
            {
                path: 'jobId',
                select: 'designation description company location labels status'
            },
            {
                path: 'userId',
                select: 'firstName lastName email'
            }
        ],
        sort: { createdAt: -1 }
    };

    const result: IPaginationResponse = await paginate<IApplication>(Application, paginationOptions);

    res.status(200).json(result);
});

export const getApplicationSummary = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({ status: ApplicationStatus.APPROVED });
    const rejectedApplications = await Application.countDocuments({ status: ApplicationStatus.REJECTED });
    const pendingApplications = await Application.countDocuments({ status: ApplicationStatus.PENDING });

    res.status(200).json({
        success: true,
        data: {
            total: totalApplications,
            accepted: acceptedApplications,
            rejected: rejectedApplications,
            pending: pendingApplications,
        },
    });
});

export const getApplicationsByJob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorResponse(`Job not found`, 404));
    }

    const applications = await Application.find({ jobId }).populate('userId', 'firstName lastName email profilePicture');

    res.status(200).json({ success: true, count: applications.length, data: applications });
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { applicationId, status } = req.params;

    if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
        return next(new ErrorResponse(`Invalid status provided`, 400));
    }

    let application = await Application.findById(applicationId);

    if (!application) {
        return next(new ErrorResponse(`Application not found`, 404));
    }

    if (application.status === status) {
        return next(new ErrorResponse(`Application status is already ${status}.`, 400));
    }

    if (!validateApplicationStatus(application.status, status as ApplicationStatus)) {
        return next(new ErrorResponse(`Cannot change application status from ${application.status} to ${status}`, 400));
    }

    application.status = status as ApplicationStatus;
    await application.save({ validateBeforeSave: true });

    res.status(200).json({ success: true, message: "Application status updated successfully.", data: application });
});
