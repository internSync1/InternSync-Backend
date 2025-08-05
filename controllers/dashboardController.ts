import { Request, Response, NextFunction } from "express";
import asyncHandler from "../common/middleware/async";
import Job from "../models/jobModel";
import Application from "../models/applicationModel";
import { jobStatus } from "../constant/jobStatus";
import { ApplicationStatus } from "../constant/applicationStatus";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const internshipStats = await Job.aggregate([
        {
            $group: {
                _id: null,
                totalInternships: { $sum: 1 },
                openInternships: { $sum: { $cond: [{ $eq: ["$status", jobStatus.OPEN] }, 1, 0] } },
                closedInternships: { $sum: { $cond: [{ $eq: ["$status", jobStatus.CLOSED] }, 1, 0] } },
            }
        }
    ]);

    const applicationStats = await Application.aggregate([
        {
            $group: {
                _id: null,
                totalApplications: { $sum: 1 },
                acceptedApplications: { $sum: { $cond: [{ $eq: ["$status", ApplicationStatus.APPROVED] }, 1, 0] } },
                rejectedApplications: { $sum: { $cond: [{ $eq: ["$status", ApplicationStatus.REJECTED] }, 1, 0] } },
                pendingApplications: { $sum: { $cond: [{ $eq: ["$status", ApplicationStatus.PENDING] }, 1, 0] } },
            }
        }
    ]);

    const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'firstName lastName email')
        .populate('jobId', 'designation');

    res.status(200).json({
        success: true,
        data: {
            internshipStats: internshipStats[0] || { totalInternships: 0, openInternships: 0, closedInternships: 0 },
            applicationStats: applicationStats[0] || { totalApplications: 0, acceptedApplications: 0, rejectedApplications: 0, pendingApplications: 0 },
            recentApplications
        }
    });
});
