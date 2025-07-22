import Otp from "../models/otpModel";

// otpStore.ts - create a separate module for managing OTPs in memory
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function setOtp(email: string, otp: string, ttlMillis = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMillis;
    otpStore.set(email, { otp, expiresAt });
}

export function getOtp(email: string): string | null {
    const record = otpStore.get(email);
    if (!record || record.expiresAt < Date.now()) {
        otpStore.delete(email);
        return null;
    }
    return record.otp;
}

export function clearOtp(email: string) {
    otpStore.delete(email);
}