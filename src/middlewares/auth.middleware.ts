import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { UserRole } from '../modules/user/user.interface';

export interface JwtUserPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export const authMiddleware = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let token = req.headers.authorization;

      if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'You are not authorized! Token is missing.',
        });
        return;
      }

      const jwtSecret = process.env.JWT_ACCESS_SECRET || 'secret';
      const decoded = jwt.verify(token, jwtSecret) as JwtUserPayload;

      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
        return;
      }

      if (user.status === 'blocked') {
        res.status(403).json({
          success: false,
          message: 'Your account has been blocked!',
        });
        return;
      }

      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token!',
      });
    }
  };
};
