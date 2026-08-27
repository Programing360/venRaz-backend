import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserValidations } from './user.validation';

const router = Router();

// Get Current Logged-in User Profile
router.get(
  '/profile',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  UserController.getProfile
);

// Update User Profile (supports image avatar upload via multer)
router.patch(
  '/profile',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  upload.single('avatar'),
  validateRequest(UserValidations.updateProfileSchema),
  UserController.updateProfile
);

// Change Password
router.patch(
  '/change-password',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  validateRequest(UserValidations.changePasswordSchema),
  UserController.changePassword
);

export const UserRoutes = router;
