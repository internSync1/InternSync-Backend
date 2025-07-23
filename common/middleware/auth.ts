import { NextFunction, RequestHandler, Response } from "express"; // Added Response and RequestHandler
import { ProtectedRequest } from "../../types/authType"; // Corrected import path if needed
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import { ITokenDecode } from "../../types/userType";
import User from "../../models/userModel";
import jwt from "jsonwebtoken";
import { UserRole } from "../../constant/userRoles";

export const protect = asyncHandler(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token)
      return next(new ErrorResponse("Missing or Invalid Token", 401));
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!); // eslint-disable-line
      // Currently Loged in User
      const user = await User.findById((<ITokenDecode>decoded).id).select(
        "+password"
      );

      if (!user) return next(new ErrorResponse("User Not found", 404));
      if (!user.isActive)
        return next(
          new ErrorResponse(
            "This user is disabled please, connect admin for more details",
            404
          )
        );

      delete user.password;
      req.user = user;

      next();
    } catch (err:any) {
      return next(
        new ErrorResponse(`${err.message}`, 401)
      );
    }
  }
);

export const authorize = (roles: UserRole[]): any => {
  return (req: ProtectedRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      if (
        !roles.includes(req.user.role) ||
        (req.user.role === UserRole.ADMIN && !req.user.isActive)
      ) {
        return next(
          new ErrorResponse(
            `User role: ${req.user.role} is not authorized to access this route`,
            403
          )
        );
      }
      next();
    } else {
      return next(
        new ErrorResponse(
          "This API is only applicable only Protected routes",
          401
        )
      );
    }
  };
};
