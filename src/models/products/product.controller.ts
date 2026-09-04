import { Request, Response } from "express";
import { createProductIntoDB, ProductServices } from "./product.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccessResponse } from "../../config/response";

export const createProducts = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const result = await createProductIntoDB(productData);
    sendSuccessResponse(res, {
      statusCode: 201,
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

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);

  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductFromDB(
    productId as string,
  );

  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Product details retrieved successfully",
    data: result,
  });
});

const getHomeSections = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getHomeSections();
  // return res.status(200).json({
  //   success: true,
  //   message: "Home section products retrieved successfully",
  //   data: result,
  // });
  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Home section products retrieved successfully",
    data: result,
  });
});

const getFlashSaleProducts = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const result = await ProductServices.getFlashSaleProducts(limit);
  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Flash sale products retrieved successfully",
    data: result,
  });
});

const getTopRatedProducts = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const result = await ProductServices.getTopRatedProducts(limit);
  sendSuccessResponse(res, {
    statusCode: 200,
    message: "Top rated products retrieved successfully",
    data: result,
  });
});

const getNewArrivalProducts = catchAsync(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const result = await ProductServices.getNewArrivalProducts(limit);
    sendSuccessResponse(res, {
      statusCode: 200,
      message: "New arrival products retrieved successfully",
      data: result,
    });
  },
);

export const ProductControllers = {
  getAllProducts,
  getSingleProduct,
  getHomeSections,
  getFlashSaleProducts,
  getTopRatedProducts,
  getNewArrivalProducts,
};
