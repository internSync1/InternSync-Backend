import { Document, Schema } from "mongoose";

export interface IQuestionsDocument extends Document {
  text: string | undefined;
  isActive: boolean | undefined;
}
