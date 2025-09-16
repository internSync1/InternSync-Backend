import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUserDocument, WorkExperience } from "../types/userType";
import { UserRole } from "../constant/userRoles";

const WorkExperienceSchema = new Schema<WorkExperience>({
  jobTitle: String,
  company: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: String,
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
    education: [{ type: String }],
    skills: [{ type: String }],
    languages: [{ type: String }],
    appreciation: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model<IUserDocument>("User", UserSchema);
export default User;
