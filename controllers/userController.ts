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
    return res.status(403).json({
      success: false,
      message: "User not found. Please complete OTP verification first.",
      requiresVerification: true,
      authStatus: 'unverified'
    });
  }
  res.status(200).json({
    success: true,
    user,
    authStatus: req.authStatus || 'valid'
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
      headline,
      gender,
      dateOfBirth,
      interests,
      answers,
      aboutMe,
      // Accept both legacy 'resume' and current 'resumeUrl'
      resume: resumeRaw,
      resumeUrl: resumeUrlRaw,
      education,
      skills,
      languages,
      appreciation,
      workExperience,
    } = req.body;

    const resolvedResumeUrl = resumeUrlRaw || resumeRaw;

    const fieldsToUpdate = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber && { phoneNumber }),
      ...(profilePicture && { profilePicture }),
      ...(headline && { headline }),
      ...(gender && { gender }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(interests && { interests }),
      ...(answers && { answers }),
      ...(aboutMe && { aboutMe }),
      ...(resolvedResumeUrl && { resumeUrl: resolvedResumeUrl }),
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


export const updateAboutMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { aboutMe } = req.body as { aboutMe?: string };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { aboutMe: aboutMe || '' } }, { new: true });
  res.status(200).json({ success: true, message: 'About me updated' });
});

export const addWorkExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { jobTitle, company, startDate, endDate, current, description } = req.body as any;
  const exp: any = {
    ...(jobTitle && { jobTitle }),
    ...(company && { company }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
    ...(typeof current !== 'undefined' && { current: !!current }),
    ...(description && { description }),
  };
  const user = await User.findOneAndUpdate(
    { firebaseUid: uid },
    { $push: { workExperience: exp } },
    { new: true }
  );
  const created = user?.workExperience[user.workExperience.length - 1];
  res.status(201).json({ success: true, message: 'Work experience added', data: created });
});

export const updateWorkExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { id } = req.params;
  const { jobTitle, company, startDate, endDate, current, description } = req.body as any;

  const setObj: any = {};
  if (jobTitle) setObj['workExperience.$.jobTitle'] = jobTitle;
  if (company) setObj['workExperience.$.company'] = company;
  if (startDate) setObj['workExperience.$.startDate'] = new Date(startDate);
  if (endDate) setObj['workExperience.$.endDate'] = new Date(endDate);
  if (typeof current !== 'undefined') setObj['workExperience.$.current'] = !!current;
  if (description) setObj['workExperience.$.description'] = description;

  await User.updateOne({ firebaseUid: uid, 'workExperience._id': id }, { $set: setObj }, { upsert: false });
  const user = await User.findOne({ firebaseUid: uid });
  const updated = user?.workExperience.find((e: any) => String(e._id) === String(id));
  res.status(200).json({ success: true, message: 'Work experience updated', data: updated });
});

export const deleteWorkExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { id } = req.params;
  await User.updateOne({ firebaseUid: uid }, { $pull: { workExperience: { _id: id } } });
  res.status(200).json({ success: true, message: 'Work experience deleted' });
});

export const updateSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { skills } = req.body as { skills?: string[] };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { skills: Array.isArray(skills) ? skills : [] } }, { new: true });
  res.status(200).json({ success: true, message: 'Skills updated' });
});

export const updateLanguages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { languages } = req.body as { languages?: string[] };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { languages: Array.isArray(languages) ? languages : [] } }, { new: true });
  res.status(200).json({ success: true, message: 'Languages updated' });
});

export const updateEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { education } = req.body as { education?: string[] };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { education: Array.isArray(education) ? education : [] } }, { new: true });
  res.status(200).json({ success: true, message: 'Education updated' });
});

export const updateAppreciation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { appreciation } = req.body as { appreciation?: string[] };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { appreciation: Array.isArray(appreciation) ? appreciation : [] } }, { new: true });
  res.status(200).json({ success: true, message: 'Appreciation updated' });
});

export const updateProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { profilePicture, url } = req.body as { profilePicture?: string; url?: string };
  const finalUrl = profilePicture || url || '';
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { profilePicture: finalUrl } }, { new: true });
  res.status(200).json({ success: true, message: 'Profile picture updated' });
});

export const updateResumeUrl = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { resumeUrl, url } = req.body as { resumeUrl?: string; url?: string };
  const finalUrl = resumeUrl || url || '';
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { resumeUrl: finalUrl } }, { new: true });
  res.status(200).json({ success: true, message: 'Resume URL updated' });
});

export const updateHeadline = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { uid } = req.user;
  const { headline } = req.body as { headline?: string };
  await User.findOneAndUpdate({ firebaseUid: uid }, { $set: { headline: headline || '' } }, { new: true });
  res.status(200).json({ success: true, message: 'Headline updated' });
});

// Direct upload handlers (multipart/form-data) for profile picture and resume
export const uploadProfilePicture = asyncHandler(async (req: AuthRequest & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  const { uid } = req.user;
  const publicUrl = `/uploads/${req.file.filename}`;
  const downloadUrl = `/v1/file/download/${req.file.filename}`;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  await User.findOneAndUpdate(
    { firebaseUid: uid },
    { $set: { profilePicture: publicUrl } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: 'Profile picture uploaded',
    data: {
      url: publicUrl,
      absoluteUrl: `${baseUrl}${publicUrl}`,
      downloadUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

export const uploadResume = asyncHandler(async (req: AuthRequest & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  const { uid } = req.user;
  const publicUrl = `/uploads/${req.file.filename}`;
  const downloadUrl = `/v1/file/download/${req.file.filename}`;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  await User.findOneAndUpdate(
    { firebaseUid: uid },
    { $set: { resumeUrl: publicUrl } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: 'Resume uploaded',
    data: {
      url: publicUrl,
      absoluteUrl: `${baseUrl}${publicUrl}`,
      downloadUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});
