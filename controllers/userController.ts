import otpGenerator from "otp-generator";
import { Request, Response, NextFunction } from "express";
import { statusResponse } from "../common/helpers/statusTypes";
import ErrorResponse from "../common/utils/errorResponse";
import asyncHandler from "../common/middleware/async";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { createSignedToken } from "../utils/auth";
import { ProtectedRequest } from "../types/authType";
import { ITokenDecode, IUserDocument } from "../types/userType";
import { clearOtp, getOtp, setOtp } from "../utils/otp";
import { responseMessages } from "../common/helpers/responseMessages";
import jwt from "jsonwebtoken";

const {
  PROFILE_UPDATED,
  USER_ALREADY_EXISTS,
  OTP_SENT,
  ACCOUNT_CREATED,
  MISSING_EMAIL_OR_OTP,
  USER_NOT_FOUND,
  OTP_NOT_FOUND_OR_USED,
} = responseMessages;
const { BAD_REQUEST, OK, NOT_FOUND, UNAUTHORIZED } = statusResponse;

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new ErrorResponse(responseMessages.MISSING_EMAIL, BAD_REQUEST)
      );
    }

    const user: IUserDocument | null = await User.findOne({
      ...(email && { email }),
    });

    if (user?.isActive && user.password) {
      return next(new ErrorResponse(USER_ALREADY_EXISTS, BAD_REQUEST));
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
    setOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: OTP_SENT,
      otp: otp,
    });
  }
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ErrorResponse(MISSING_EMAIL_OR_OTP, BAD_REQUEST));
    }

    const storedOtp = getOtp(email);
    if (otp !== storedOtp || storedOtp == null) {
      return next(new ErrorResponse(OTP_NOT_FOUND_OR_USED, BAD_REQUEST));
    }

    clearOtp(email);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    user.isActive = true;
    await user.save();

    const token = createSignedToken(
      user,
      process.env.JWT_SECRET_KEY,
      process.env.JWT_EXPIRE_TIME
    );

    return res.status(OK).json({
      success: true,
      message: responseMessages.OTP_VERIFIED,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!password) {
      return next(
        new ErrorResponse(responseMessages.PASSWORD_REQUIRED, BAD_REQUEST)
      );
    }

    if (!email) {
      return next(
        new ErrorResponse(responseMessages.MISSING_EMAIL, BAD_REQUEST)
      );
    }

    const fieldToSearch = {
      ...(email && { email }),
    };

    const user: IUserDocument | null = await User.findOne(fieldToSearch).select(
      "+password"
    );

    if (!user) {
      return next(
        new ErrorResponse(responseMessages.USER_NOT_FOUND, BAD_REQUEST)
      );
    }

    if (!user.isActive) {
      return next(
        new ErrorResponse(responseMessages.INACTIVE_USER, BAD_REQUEST)
      );
    }
    if (!user.password) {
      return next(
        new ErrorResponse(
          "This user does not have a password set.",
          BAD_REQUEST
        )
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        new ErrorResponse(responseMessages.INVALID_CREDENTIALS, BAD_REQUEST)
      );
    }

    const token = createSignedToken(
      user,
      process.env.JWT_SECRET_KEY,
      process.env.JWT_EXPIRE_TIME
    );
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(OK).json({
      user: userObj,
      statusCode: OK,
      accessToken: token,
    });
  }
);

export const updateUserProfile = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { id } = req.user;

    const {
      firstName,
      lastName,
      profilePicture,
      phoneNumber,
      gender,
      dateOfBirth,
      password,
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
      ...(password && { password }),
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
    await User.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return res.status(OK).json({
      success: true,
      message: PROFILE_UPDATED,
    });
  }
);

export const getUserProfile = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { id } = req.user;

    const user = await User.findById(id).select("-password");

    return res.status(OK).json({
      success: true,
      message: responseMessages.PROFILE_FETCHED,
      user,
    });
  }
);

export const forgotPassword = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setOtp(user.email as string, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 15 minutes.`,
    };
    console.log("otp for reset:", otp);

    // await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
  }
);

export const resetPassword = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    const storedOtp = getOtp(email);
    if (!user || otp !== storedOtp || storedOtp == null) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    clearOtp(email);

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset" });
  }
);
