import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import { AdminService } from './admin.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin dashboard overview statistics fetched successfully',
    data: result,
  });
});

const getPendingShops = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPendingShopsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending shops retrieved successfully',
    data: result,
  });
});

const approveShop = catchAsync(async (req: Request, res: Response) => {
  const shopId = req.params.shopId as string;
  const result = await AdminService.approveShopInDB(shopId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop approved successfully',
    data: result,
  });
});

const rejectShop = catchAsync(async (req: Request, res: Response) => {
  const shopId = req.params.shopId as string;
  const { reason } = req.body;
  const result = await AdminService.rejectShopInDB(shopId, reason);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shop rejected successfully',
    data: result,
  });
});

const getPendingProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPendingProductsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending products retrieved successfully',
    data: result,
  });
});

const approveProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  const result = await AdminService.approveProductInDB(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product approved successfully',
    data: result,
  });
});

const rejectProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId as string;
  const { reason } = req.body;
  const result = await AdminService.rejectProductInDB(productId, reason);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product rejected successfully',
    data: result,
  });
});

export const AdminController = {
  getDashboardStats,
  getPendingShops,
  approveShop,
  rejectShop,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};
