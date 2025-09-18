import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUserDocument, WorkExperience, Education, Appreciation } from "../types/userType";
import { UserRole } from "../constant/userRoles";

const WorkExperienceSchema = new Schema<WorkExperience>({
  jobTitle: String,
  company: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: String,
});

const EducationSchema = new Schema<Education>({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  current: Boolean,
  grade: { type: String, trim: true },
  location: { type: String, trim: true },
  description: { type: String, trim: true },
});

const AppreciationSchema = new Schema<Appreciation>({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, trim: true },
  date: Date,
  description: { type: String, trim: true },
  url: { type: String, trim: true },
});

const UserSchema = new Schema<IUserDocument>(
  {
    _id: { type: String, default: uuidv4, required: true },
    firebaseUid: { type: String, required: true, unique: true },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
    },
    headline: { type: String, default: "" },
    // Push notification support
    deviceTokens: [{ type: String }],
    notificationPreferences: {
      pushEnabled: { type: Boolean, default: true },
      emailEnabled: { type: Boolean, default: true },
      jobRecommendations: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.APPLICANT,
    },
    interests: [{ type: String, ref: "Interest" }],
    answers: [
      {
        question: { type: String, ref: "Question" },
        answer: String,
      },
    ],
    aboutMe: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    workExperience: [WorkExperienceSchema],
    education: [EducationSchema],
    skills: [{ type: String }],
    languages: [{ type: String }],
    appreciation: [AppreciationSchema],
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model<IUserDocument>("User", UserSchema);
export default User;
