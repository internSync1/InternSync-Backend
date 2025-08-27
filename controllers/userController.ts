import { Request, Response, NextFunction } from "express";
import asyncHandler from "../common/middleware/async";
import User from "../models/userModel";

// Extend Request to include user property and auth status
interface AuthRequest extends Request {
  user: any;
  authStatus?: 'valid' | 'expired' | 'missing';
}

// Sync user with Firebase UID and email
export const syncUserWithFirebase = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log("SYNC ROUTE HIT", req.method, req.originalUrl);

  // Handle different auth states
  if (req.authStatus === 'missing') {
    return res.status(401).json({
      success: false,
      message: "No authentication token provided",
      authStatus: 'missing'
    });
  }

  if (req.authStatus === 'expired') {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired. Please refresh your token.",
      authStatus: 'expired',
      requiresReauth: true
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
      authStatus: 'invalid'
    });
  }

  const { uid, email, name, picture } = req.user;
  let user = await User.findOne({ firebaseUid: uid });
  if (!user) {
    user = await User.create({
      firebaseUid: uid,
      email,
      firstName: name || '',
      profilePicture: picture || '',
      isActive: true,
    });
  }
  res.status(200).json({
    success: true,
    user,
    authStatus: 'valid'
  });
});

export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { uid } = req.user;
    const {
      firstName,
      lastName,
      profilePicture,
      phoneNumber,
      gender,
      dateOfBirth,
      interests,
      answers,
      aboutMe,
      resume,
      education,
      skills,
      languages,
      appreciation,
      workExperience,
    } = req.body;
    const fieldsToUpdate = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber && { phoneNumber }),
      ...(profilePicture && { profilePicture }),
      ...(gender && { gender }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(interests && { interests }),
      ...(answers && { answers }),
      ...(aboutMe && { aboutMe }),
      ...(resume && { resume }),
      ...(education && { education }),
      ...(skills && { skills }),
      ...(languages && { languages }),
      ...(appreciation && { appreciation }),
      ...(workExperience && { workExperience }),
    };
    await User.findOneAndUpdate({ firebaseUid: uid }, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated",
    });
  }
);

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { uid } = req.user;
    const user = await User.findOne({ firebaseUid: uid });
    return res.status(200).json({
      success: true,
      user,
    });
  }
);
