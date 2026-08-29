import express from "express";
import { createProducts } from "../../models/products/product.controller";

const router = express.Router();

/**
 * @swagger
 * /api/v1/shops/create-product:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *                 example: Products
 *               owner:
 *                 type: string
 *                 example: 64f123456789
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Bad request
 */

router.post("/create-product", createProducts);

export const productsRoutes = router;
