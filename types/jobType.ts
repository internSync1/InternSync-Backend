import { Document } from "mongoose";
import { jobStatus } from "../constant/jobStatus";

export interface IJobCompany {
    name: string;
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
    stipend?: string;
    skillsRequired: string[];
    startDate?: Date;
    endDate?: Date;
    applicationDeadline?: Date;
    status: jobStatus;
}