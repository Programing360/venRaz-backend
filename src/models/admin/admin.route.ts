import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// Apply auth and admin role guard for all admin routes
router.use(authMiddleware(), roleMiddleware('admin'));

/**
 * @openapi
 * /admin/dashboard-stats:
 *   get:
 *     summary: Get overall admin dashboard statistics (Revenue, Users, Shops, Orders, Products)
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard overview statistics fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard-stats', AdminController.getDashboardStats);

/**
 * @openapi
 * /admin/shops/pending:
 *   get:
 *     summary: Get all pending shops awaiting admin approval
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending shops retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/shops/pending', AdminController.getPendingShops);

/**
 * @openapi
 * /admin/shops/{shopId}/approve:
 *   patch:
 *     summary: Approve a pending shop
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the shop to approve
 *     responses:
 *       200:
 *         description: Shop approved successfully
 *       404:
 *         description: Shop not found
 */
router.patch('/shops/:shopId/approve', AdminController.approveShop);

/**
 * @openapi
 * /admin/shops/{shopId}/reject:
 *   patch:
 *     summary: Reject or suspend a shop with reason
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the shop to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Trade license could not be verified
 *     responses:
 *       200:
 *         description: Shop rejected successfully
 *       404:
 *         description: Shop not found
 */
router.patch('/shops/:shopId/reject', AdminController.rejectShop);

/**
 * @openapi
 * /admin/products/pending:
 *   get:
 *     summary: Get all pending products awaiting admin moderation
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/products/pending', AdminController.getPendingProducts);

/**
 * @openapi
 * /admin/products/{productId}/approve:
 *   patch:
 *     summary: Approve a pending product
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the product to approve
 *     responses:
 *       200:
 *         description: Product approved successfully
 *       404:
 *         description: Product not found
 */
router.patch('/products/:productId/approve', AdminController.approveProduct);

/**
 * @openapi
 * /admin/products/{productId}/reject:
 *   patch:
 *     summary: Reject a pending product with reason
 *     tags:
 *       - Admin Dashboard & Moderation (Member 3)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the product to reject
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Product image violates platform policy
 *     responses:
 *       200:
 *         description: Product rejected successfully
 *       404:
 *         description: Product not found
 */
router.patch('/products/:productId/reject', AdminController.rejectProduct);

export const AdminRoutes = router;
