import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IQuestionsDocument } from "../types/questionType";

const questionSchema = new Schema<IQuestionsDocument>({
  _id: { type: String, default: uuidv4, required: true },
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { versionKey: false });

const Question = mongoose.model<IQuestionsDocument>("Question", questionSchema);
export default Question;