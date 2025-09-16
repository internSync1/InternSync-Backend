import mongoose, { Schema } from "mongoose";
import { IJobCompany, IJobDescription, IJob } from "../types/jobType";
import { jobStatus } from "../constant/jobStatus";
import { v4 as uuidv4 } from "uuid";

const JobCompanySchema = new Schema<IJobCompany>({
    name: { type: String, required: [true, "Company name is required"] },
    logoUrl: String,
    industry: String,
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

const VisibilitySchema = new Schema({
    displayInApp: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
}, { _id: false });

const jobSchema = new Schema<IJob>({
    _id: { type: String, default: uuidv4, required: true },
    title: { type: String, required: [true, "Job title is required"] },
    company: { type: JobCompanySchema, required: true },
    description: { type: JobDescriptionSchema, required: true },
    duration: String,
    location: String,
    skillsRequired: [{ type: String }],
    labels: [{ type: String }],
    startDate: Date,
    endDate: Date,
    applicationDeadline: Date,
    status: {
        type: String,
        enum: Object.values(jobStatus),
        default: jobStatus.OPEN,
    },
    jobType: String,
    weeklyHours: Number,
    isRemote: Boolean,
    visibility: { type: VisibilitySchema, required: true },
    // New fields for swipe functionality
    relevancyScore: { type: Number, default: 0 },
    tags: [{ type: String }],
    categories: [{ type: String }],
    sourceUrl: String,
    source: String,
    prize: String,
    // New fields for card variant and media
    sourceType: { type: String, enum: ['csv', 'web'], default: 'web' },
    bannerImageUrl: String,
    applyMode: { type: String, enum: ['external', 'native'], default: 'external' },
}, { timestamps: true, autoIndex: true, minimize: false, versionKey: false });

// Helpful indexes for search/filtering
jobSchema.index({ tags: 1 });
jobSchema.index({ categories: 1 });
jobSchema.index({ sourceType: 1 });
jobSchema.index({ jobType: 1 });

jobSchema.pre('findOneAndUpdate', function (): void {
    this.set({
        updatedAt: new Date(),
    });
});

const job = mongoose.model<IJob>("Job", jobSchema);

export default job;