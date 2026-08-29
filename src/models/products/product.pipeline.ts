// src/app/modules/product/product.pipeline.ts
import { PipelineStage } from "mongoose";

export const getBaseProductPipeline = (
  matchCondition: Record<string, unknown> = {},
  sortCondition: Record<string, 1 | -1> = { createdAt: -1 },
  limitCount: number = 10,
): PipelineStage[] => {
  return [
    {
      $match: {
        isDeleted: { $ne: true },
        ...matchCondition,
      },
    },
    // Populate Category
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    // Populate Shop
    {
      $lookup: {
        from: "shops",
        localField: "shopId",
        foreignField: "_id",
        as: "shop",
      },
    },
    { $unwind: { path: "$shop", preserveNullAndEmptyArrays: true } },
    // Populate Seller
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
    // Clean required fields
    {
      $project: {
        "seller.password": 0,
        "seller.role": 0,
      },
    },
    { $sort: sortCondition },
    { $limit: limitCount },
  ];
};
