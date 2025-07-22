import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { createSignedToken } from "../utils/auth";
import bcrypt from "bcryptjs";
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
    gender: {
      type: String,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
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

// Encrypt password using bcrypt
UserSchema.pre<IUserDocument>(
  "save",
  async function (this: IUserDocument, next) {
    if (!this.isModified("password")) next();

    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
);

// Methods to generate JWT tokens
UserSchema.methods.getSignedJwtToken = function (this: IUserDocument) {
  return createSignedToken(
    this,
    process.env.JWT_SECRET_KEY,
    process.env.JWT_EXPIRE_TIME
  );
};

// UserSchema.index({ email: 1 });

const User = mongoose.model<IUserDocument>("User", UserSchema);
export default User;
