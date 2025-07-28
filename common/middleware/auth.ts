import { NextFunction, Response } from "express";
import { ProtectedRequest } from "../../types/authType";
import ErrorResponse from "../utils/errorResponse";
import { UserRole } from "../../constant/userRoles";


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
