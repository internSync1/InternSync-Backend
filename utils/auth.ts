import { Response, NextFunction } from "express";
import { IUserDocument } from "../types/userType";
import jwt, { SignOptions } from "jsonwebtoken";

import ms from "ms";
import { statusResponse } from "../common/helpers/statusTypes";
const { OK } = statusResponse;

export const createSignedToken = (
  user: IUserDocument,
  SECRET: string | undefined,
  EXPIRE_TIME: string | undefined
): string => {
  if (SECRET && EXPIRE_TIME) {
    const options: SignOptions = {
      expiresIn: EXPIRE_TIME as ms.StringValue,
    };
    return jwt.sign(
      {
        id: user._id,
      },
      SECRET,
      options
    );
  } else {
    console.log("Initialize JWT Secrets");
    throw new Error("Initialize JWT Secrets Failed");
  }
};
