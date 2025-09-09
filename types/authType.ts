import { Request } from 'express'
import { IUserDocument } from './userType'

// Extend Express Request interface to include Firebase user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

export interface ProtectedRequest extends Request {
  user: IUserDocument & {
    uid: string;
    email?: string;
    [key: string]: any;
  }
}
