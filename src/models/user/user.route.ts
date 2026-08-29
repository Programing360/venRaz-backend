import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { UserValidations } from './user.validation';

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - User & Profile Management (Member 3)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 */
router.get(
  '/profile',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  UserController.getProfile
);

/**
 * @openapi
 * /users/profile:
 *   patch:
 *     summary: Update current user profile info and avatar image
 *     tags:
 *       - User & Profile Management (Member 3)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "01712345678"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file to upload to Cloudinary
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/profile',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  upload.single('avatar'),
  validateRequest(UserValidations.updateProfileSchema),
  UserController.updateProfile
);

/**
 * @openapi
 * /users/change-password:
 *   patch:
 *     summary: Change password for current user
 *     tags:
 *       - User & Profile Management (Member 3)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password does not match or validation failed
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/change-password',
  authMiddleware(),
  roleMiddleware('user', 'moderator', 'admin'),
  validateRequest(UserValidations.changePasswordSchema),
  UserController.changePassword
);

export const UserRoutes = router;
