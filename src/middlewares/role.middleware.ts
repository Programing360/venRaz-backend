import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../modules/user/user.interface';

export const roleMiddleware = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'You are not authenticated!',
        });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: `Access denied! Require one of roles: [${allowedRoles.join(', ')}]. You have role: '${user.role}'`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
