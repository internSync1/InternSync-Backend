import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IOtpDocument } from "../types/otpType";

const OtpSchema = new Schema<IOtpDocument>(
  {
    _id: { type: String, default: uuidv4, required: true },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
    },
    ttl: {
      type: Number,
      default: Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true, versionKey: false  }
);

const Otp = mongoose.model<IOtpDocument>("Otp", OtpSchema);
export default Otp;
