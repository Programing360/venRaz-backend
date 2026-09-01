// order.route.ts
import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  trackOrder,
} from "../../models/order/order.controller";

const router = Router();
/**
 * @swagger
 * /api/v1/products/orders/track/:trackingId:
 *   get:
 *     summary: Track order by tracking ID
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: products data retrieved successfully
 */

router.get("/track/:trackingId", trackOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - description
 *               - images
 *               - price
 *               - stock
 *               - category
 *               - shop
 *               - seller
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Headphones
 *               slug:
 *                 type: string
 *                 example: wireless-headphones
 *               description:
 *                 type: string
 *                 example: Premium noise-canceling headphones
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image.jpg"]
 *               price:
 *                 type: number
 *                 example: 150
 *               discount:
 *                 type: number
 *                 example: 10
 *               stock:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: 64f123456789a1b2c3d4e5f6
 *               shop:
 *                 type: string
 *                 example: 64f123456789a1b2c3d4e5f7
 *               seller:
 *                 type: string
 *                 example: 64f123456789a1b2c3d4e5f8
 *               brand:
 *                 type: string
 *                 example: Sony
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               isFlashSale:
 *                 type: boolean
 *                 example: true
 *               flashSalePrice:
 *                 type: number
 *                 example: 120
 *               flashSaleEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 */

router.post("/", createOrder);
/**
 * @swagger
 * /api/v1/products/orders/my-orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: products data retrieved successfully
 */
router.get("/my-orders", getMyOrders);
/**
 * @swagger
 * /api/v1/products/orders/:orderId:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: products data retrieved successfully
 */
router.get("/:orderId", getSingleOrder);
/**
 * @swagger
 * /api/v1/products/orders/:orderId/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: products data retrieved successfully
 */
router.patch("/:orderId/cancel", cancelOrder);

export const OrderRoutes = router;
