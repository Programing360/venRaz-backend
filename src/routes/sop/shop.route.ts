import express from "express";
import { createShop } from "../../controllers/sop/shop.controller";
import { getAllShop } from "../../controllers/sop/shop.get.controller";
import { getMyShops } from "../../controllers/sop/shop.my.get.controller";

const router = express.Router();

/**
 * @swagger
 * /api/v1/shops/create-shop:
 *   post:
 *     summary: Create a new shop
 *     tags:
 *       - Shop
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
 *                 example: My Fashion Shop
 *               owner:
 *                 type: string
 *                 example: 64f123456789
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Bad request
 */

router.post("/create-shop", createShop, );
router.get("/", getAllShop);
router.get("/my-shop/:ownerId", getMyShops);
export const ShopRoutes = router;
