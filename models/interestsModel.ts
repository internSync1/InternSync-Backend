import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IInterestDocument } from "../types/interestType";

const interestSchema = new mongoose.Schema<IInterestDocument>({
    _id: { type: String, default: uuidv4, required: true },
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, {versionKey: false });


const Interest = mongoose.model<IInterestDocument>("Interest", interestSchema);
export default Interest;
