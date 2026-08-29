
import express from "express";
import { createProducts, ProductControllers } from "../../models/products/product.controller";

const router = express.Router();

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
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
router.post("/", createProducts);

/**
 * @swagger
 * /api/v1/products/home-sections:
 *   get:
 *     summary: Get all home page sections (Featured, Flash Sale, Top Rated, Most Selling, New Arrivals)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Home page sections data retrieved successfully
 */
router.get("/home-sections", ProductControllers.getHomeSections);

/**
 * @swagger
 * /api/v1/products/flash-sale:
 *   get:
 *     summary: Get flash sale products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to retrieve
 *     responses:
 *       200:
 *         description: Flash sale products retrieved successfully
 */
router.get("/flash-sale", ProductControllers.getFlashSaleProducts);

/**
 * @swagger
 * /api/v1/products/top-rated:
 *   get:
 *     summary: Get top rated products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top rated products retrieved successfully
 */
router.get("/top-rated", ProductControllers.getTopRatedProducts);

/**
 * @swagger
 * /api/v1/products/new-arrivals:
 *   get:
 *     summary: Get new arrival products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: New arrival products retrieved successfully
 */
router.get("/new-arrivals", ProductControllers.getNewArrivalProducts);

export const productsRoutes = router;
