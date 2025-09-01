import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
    attempts: number;
    createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
otpSchema.index({ email: 1 });

const Otp = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
