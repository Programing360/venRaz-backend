import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ShopRoutes } from "./routes/shop.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/shops", ShopRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to the VenRaz api ",
  });
});

export default app;
