import { Document, Schema } from "mongoose";

export interface IOtpDocument extends Document {
  userId: {
    type: String;
    ref: "User";
    required: true;
  };
  otp: string | undefined;
  ttl: number | undefined;
}
