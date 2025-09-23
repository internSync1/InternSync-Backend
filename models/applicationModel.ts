import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IApplication } from "../types/applicationType";
import { ApplicationStatus } from "../constant/applicationStatus";

const ApplicationSchema = new Schema<IApplication>(
    {
        _id: { type: String, default: uuidv4, required: true },
        jobId: {
            type: String,
            ref: "Job",
            required: true,
        },
        userId: {
            type: String,
            ref: "User",
            required: true,
        },
        applicantName: { type: String, required: true },
        resumeUrl: { type: String, required: true },
        portfolioUrl: { type: String },
        text: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(ApplicationStatus),
            default: ApplicationStatus.PENDING,
        }
    },
    { timestamps: true, versionKey: false }
);

const application = mongoose.model<IApplication>("Application", ApplicationSchema);

export default application;