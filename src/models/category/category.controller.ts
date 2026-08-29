// src/app/modules/category/category.controller.ts
import { Request, Response } from "express";
import { CategoryServices } from "./category.service.js";

import { catchAsync } from "../../utils/catchAsync"; // Optional async wrapper
import { sendSuccessResponse } from "../../config/response";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategoryIntoDB(req.body);

  sendSuccessResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategoriesFromDB(req.query);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryServices.updateCategoryInDB(id, req.body);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryServices.deleteCategoryFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
