import { Document, Schema } from "mongoose";
import { UserRole } from "../constant/userRoles";

export interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface IUserDocument extends Document {
  firebaseUid: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  gender?: string;
  countryCode?: string;
  country?: string;
  state?: string;
  nationality?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  role: UserRole;
  interests: string[];
  answers: [
    {
      question: string[];
      answer: string;
    }
  ];
  aboutMe: string;
  resumeUrl?: string;
  workExperience: WorkExperience[];
  education: string[];
  skills: string[];
  languages: string[];
  appreciation: string[];
}


