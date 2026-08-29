import { Request, Response } from "express";
import { createShopIntoDB } from "../../services/sop/shop.service";

export const createShop = async (req: Request, res: Response) => {
  try {
    const shopData = req.body;
    const result = await createShopIntoDB(shopData);

    res.status(201).json({
      success: true,
      message: "Shop and Collection created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create shop",
      error,
    });
  }
};
