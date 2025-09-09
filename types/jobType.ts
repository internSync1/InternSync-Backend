import { Document } from "mongoose";
import { jobStatus } from "../constant/jobStatus";

export interface IJobCompany {
    name: string;
    logoUrl?: string;
    industry?: string;
    aboutUs?: string;
    gallery?: string[];
    address?: string;
    hours?: string;
    phone?: string;
    website?: string;
}

export interface IJobDescription {
    details: string;
    requirements?: string;
    stipend: {
        currency: string;
        amount: number;
    };
}


export interface IJob extends Document {
    _id: string;
    id: string;
    title: string;
    company: IJobCompany;
    description: IJobDescription;
    duration?: string;
    location?: string;
    skillsRequired: string[];
    labels?: string[];
    startDate?: Date;
    endDate?: Date;
    applicationDeadline?: Date;
    status: jobStatus;
    jobType?: string;
    weeklyHours?: number;
    isRemote?: boolean;
    visibility: {
        displayInApp: boolean;
        featured: boolean;
    };
    // New fields for swipe functionality
    relevancyScore?: number;
    tags?: string[];
    categories?: string[];
    sourceUrl?: string;
    source?: string;
    prize?: string;
    // Card variant and media
    sourceType?: 'csv' | 'web';
    bannerImageUrl?: string;
    applyMode?: 'external' | 'native';
}