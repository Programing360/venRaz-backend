import { Router } from "express";
import { getSellerOrders, updateOrderStatus } from "./sellerOrder.controller";

const router = Router();

router.get("/orders", getSellerOrders);

router.patch("/orders/:orderId/status", updateOrderStatus);

export const SellerOrderRoutes = router;
