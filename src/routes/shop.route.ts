import express from "express";
import { createShop } from "../controllers/shop.controller";

const router = express.Router();

router.post("/create-shop", createShop);

export const ShopRoutes = router;
