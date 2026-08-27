"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const shop_route_1 = require("./routes/shop.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/shops", shop_route_1.ShopRoutes);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the API",
    });
});
exports.default = app;
