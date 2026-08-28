import { Request, Response } from "express";
import { createShopIntoDB } from "../../services/sop/shop.service";
import { Shop } from "../../models/sop/sop.model";

export const getAllShop = async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find();
    return res.status(200).json({
      success: true,
      message: "Shops fetched successfully!",
      data: shops,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
      error: error.message,
    });
  }
};

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
