import { Document, Schema } from "mongoose";
import { ApplicationStatus } from "../constant/applicationStatus";

export interface IApplication extends Document {
    jobId: String;
    userId: String;
    applicantName: string;
    portfolioUrl?: string;
    resumeUrl: string;
    status: ApplicationStatus;
    text: string;
}

