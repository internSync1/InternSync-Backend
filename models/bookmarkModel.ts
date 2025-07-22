import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from "uuid";
import { IBookmark } from '../types/bookmarkType';

const BookmarkSchema = new Schema<IBookmark>(
    {
        _id: { type: String, default: uuidv4, required: true },
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        jobId: {
            type: String,
            ref: 'Job',
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

BookmarkSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark;
