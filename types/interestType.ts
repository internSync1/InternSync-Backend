import { Document, Schema } from "mongoose";

export interface IInterestDocument extends Document {
  name: string | undefined;
  isActive: boolean | undefined;
}
