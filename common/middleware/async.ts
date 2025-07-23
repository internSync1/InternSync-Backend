import { Request, Response, NextFunction } from 'express'
import { ProtectedRequest } from '../../types/authType'


const asyncHandler =
  (fn: Function) =>
    (req: Request | ProtectedRequest, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res, next)).catch(next)

export default asyncHandler