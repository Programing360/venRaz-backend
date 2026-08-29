import { Request, Response } from "express";
import { createProductIntoDB } from "./product.service";

export const createProducts = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const result = await createProductIntoDB(productData);
    return res.status(201).json({
      success: true,
      message: "Product and Collection created successfully!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create shop",
      error,
    });
  }
};
