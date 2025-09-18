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

export interface Education {
  institution: string; // e.g., University of Oxford
  degree?: string; // e.g., BSc, MSc
  fieldOfStudy?: string; // e.g., Information Technology
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
  grade?: string; // GPA or grade
  location?: string;
  description?: string;
}

export interface Appreciation {
  title: string; // e.g., Wireless Symposium (WS)
  issuer?: string; // e.g., Young Scientists
  date?: Date; // award/certification date
  description?: string;
  url?: string; // reference link or certificate URL
}

export interface IUserDocument extends Document {
  firebaseUid: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  headline?: string;
  // Notifications
  deviceTokens?: string[];
  notificationPreferences?: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    jobRecommendations: boolean;
    applicationUpdates: boolean;
  };
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
  education: Education[];
  skills: string[];
  languages: string[];
  appreciation: Appreciation[];
}
