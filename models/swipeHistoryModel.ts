import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISwipeHistory extends Document {
    _id: string;
    userId: string;
    jobId: string;
    action: 'like' | 'dislike' | 'superlike' | 'skip';
    swipedAt: Date;
    jobTitle?: string;
    jobTags?: string[];
    jobCategories?: string[];
}

const swipeHistorySchema = new Schema<ISwipeHistory>({
    _id: { type: String, default: uuidv4, required: true },
    userId: { type: String, required: [true, "User ID is required"] },
    jobId: { type: String, required: [true, "Job ID is required"] },
    action: {
        type: String,
        enum: ['like', 'dislike', 'superlike', 'skip'],
        required: [true, "Swipe action is required"]
    },
    swipedAt: { type: Date, default: Date.now },
    jobTitle: String,
    jobTags: [{ type: String }],
    jobCategories: [{ type: String }],
}, { timestamps: true, autoIndex: true, minimize: false, versionKey: false });

// Create compound index for efficient querying
swipeHistorySchema.index({ userId: 1, jobId: 1 }, { unique: true });
swipeHistorySchema.index({ userId: 1, swipedAt: -1 });
swipeHistorySchema.index({ userId: 1, action: 1 });

const SwipeHistory = mongoose.model<ISwipeHistory>("SwipeHistory", swipeHistorySchema);

export default SwipeHistory;
