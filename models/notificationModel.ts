import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface INotification extends Document {
    _id: string;
    userId: string; // references User _id (string)
    title: string;
    body: string;
    type?: string;
    data?: Record<string, any>;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    _id: { type: String, default: uuidv4, required: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
