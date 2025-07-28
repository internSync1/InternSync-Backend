import { Request, Response, NextFunction, RequestHandler } from 'express';
import admin from '../../firebase/firebaseAdmin';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const firebaseAuth: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const idToken = authHeader.split(' ')[1];
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch(() => {
      res.status(401).json({ message: 'Invalid or expired token' });
    });
}; 