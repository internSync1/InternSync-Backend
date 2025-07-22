import { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {

    userId: String;
    jobId: String;
    createdAt: Date;
}
