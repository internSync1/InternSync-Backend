import { Request, Response, NextFunction, RequestHandler } from 'express';
import admin from '../../firebase/firebaseAdmin';
import User from '../../models/userModel';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: any;
  authStatus?: 'valid' | 'expired' | 'missing' | 'unverified';
}

export const firebaseAuth: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const idToken = authHeader.split(' ')[1];
  admin.auth().verifyIdToken(idToken)
    .then(async (decodedToken) => {
      try {
        const { uid } = decodedToken as any;
        // Only find existing user, don't create new ones
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
          return res.status(403).json({
            message: 'User not found. Please complete OTP verification first.',
            requiresVerification: true
          });
        }
        // Attach both Firebase token and DB user context
        req.user = {
          ...decodedToken,
          id: user._id,
          role: (user as any).role,
          email: decodedToken.email ?? (user as any).email,
        };
      } catch (e) {
        return res.status(500).json({ message: 'Failed to verify user', error: e instanceof Error ? e.message : e });
      }
      next();
    })
    .catch(() => {
      res.status(401).json({ message: 'Invalid or expired token' });
    });
};

// Lazy authentication - allows expired tokens but marks them
export const lazyFirebaseAuth: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.authStatus = 'missing';
    return next();
  }

  const idToken = authHeader.split(' ')[1];

  admin.auth().verifyIdToken(idToken)
    .then(async (decodedToken) => {
      req.user = decodedToken;
      req.authStatus = 'valid';

      try {
        const { uid } = decodedToken as any;
        // Only find existing user, don't create new ones
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
          req.authStatus = 'unverified';
        } else {
          // Attach DB user id for convenience when present
          (req.user as any).id = user._id;
          (req.user as any).role = (user as any).role;
        }
      } catch (e) {
        console.error('Failed to check user in lazy auth:', e);
      }

      next();
    })
    .catch((error) => {
      console.log('Token verification failed in lazy auth:', error.code);
      req.authStatus = 'expired';
      req.user = null;
      next();
    });
};

// Optional auth - for endpoints that work with or without auth
export const optionalFirebaseAuth: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const idToken = authHeader.split(' ')[1];

  admin.auth().verifyIdToken(idToken)
    .then(async (decodedToken) => {
      req.user = decodedToken;
      try {
        const { uid } = decodedToken as any;
        const user = await User.findOne({ firebaseUid: uid });
        if (user) {
          (req.user as any).id = user._id;
          (req.user as any).role = (user as any).role;
        }
      } catch { }
      next();
    })
    .catch(() => {
      // Silently continue without user context
      next();
    });
};