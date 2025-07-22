import mongoose, { Schema } from "mongoose";
import { IJobCompany, IJobDescription, IJob } from "../types/jobType";
import { jobStatus } from "../constant/jobStatus";
import { v4 as uuidv4 } from "uuid";

const JobCompanySchema = new Schema<IJobCompany>({
    name: { type: String, required: [true, "Company name is required"] },
    aboutUs: String,
    gallery: [{ type: String }],
    address: String,
    hours: String,
    phone: String,
    website: String,
}, { _id: false });


const JobDescriptionSchema = new Schema<IJobDescription>({
    details: { type: String, required: [true, "Job details is required"] },
    requirements: String,
    stipend: {
        currency: { type: String, default: "INR" },
        amount: { type: Number, default: 0 },
    },
}, { _id: false });

const jobSchemaModel = {
    _id: { type: String, default: uuidv4, required: true },
    designation: { type: String, required: [true, "Job designation is required"] },
    company: { type: JobCompanySchema, required: true },
    description: { type: JobDescriptionSchema, required: true },
    duration: String,
    location: String,
    labels: [{ type: String }],
    startDate: Date,
    endDate: Date,
    applicationDeadline: Date,
    status: {
        type: String,
        enum: Object.values(jobStatus),
        default: jobStatus.OPEN,
    },
}

const jobSchema = new Schema<IJob>(jobSchemaModel, { timestamps: true, autoIndex: true, minimize: false, versionKey: false });

jobSchema.pre('findOneAndUpdate', function (): void {
    this.set({
        updatedAt: new Date(),
    });
});

const job = mongoose.model<IJob>("Job", jobSchema);

export default job;