import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IContent extends Document {
    _id: string;
    slug: string; // e.g., 'house-rules'
    title: string;
    body: string; // markdown or html
    metadata?: Record<string, any>;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
    _id: { type: String, default: uuidv4, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    published: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });

const Content = mongoose.model<IContent>('Content', ContentSchema);
export default Content;
