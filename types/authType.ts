import { Request } from 'express'
import { IUserDocument } from './userType'


export interface ProtectedRequest extends Request {
  user: IUserDocument
}
