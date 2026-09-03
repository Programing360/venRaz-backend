import mongoose from 'mongoose';
import { IAdminDashboardStats } from './admin.interface';
import { User } from '../user/user.model';
import { Shop } from '../sop/sop.model';
import { Product } from '../products/product.model';
import { Order } from '../order/order.model';

const getDashboardStatsFromDB = async (): Promise<IAdminDashboardStats> => {
  // Aggregate revenue from non-cancelled orders
  let totalRevenue = 0;
  try {
    const revenueResult = await Order.aggregate([
      { $match: { isCancelled: { $ne: true }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    if (revenueResult.length > 0) {
      totalRevenue = revenueResult[0].total;
    }
  } catch (error) {
    console.warn('Could not aggregate order revenue:', error);
  }

  const [
    totalUsers,
    totalShops,
    totalOrders,
    totalProducts,
    pendingShops,
    pendingProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Shop.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ isDeleted: { $ne: true } }),
    Shop.countDocuments({ status: 'pending' }),
    Product.countDocuments({ status: 'pending', isDeleted: { $ne: true } }),
  ]);

  return {
    totalRevenue,
    totalUsers,
    totalShops,
    totalOrders,
    totalProducts,
    pendingShops,
    pendingProducts,
  };
};

const getPendingShopsFromDB = async () => {
  const pendingShops = await Shop.find({ status: 'pending' }).sort({
    createdAt: -1,
  });
  return pendingShops;
};

const approveShopInDB = async (shopId: string) => {
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw { statusCode: 400, message: 'Invalid shop ID format' };
  }

  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status: 'approved' },
    { new: true }
  );

  if (!shop) {
    throw { statusCode: 404, message: 'Shop not found' };
  }

  return shop;
};

const rejectShopInDB = async (shopId: string, reason: string) => {
  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    throw { statusCode: 400, message: 'Invalid shop ID format' };
  }

  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status: 'rejected', rejectionReason: reason || 'Does not meet platform guidelines' },
    { new: true }
  );

  if (!shop) {
    throw { statusCode: 404, message: 'Shop not found' };
  }

  return shop;
};

const getPendingProductsFromDB = async () => {
  const pendingProducts = await Product.find({
    status: 'pending',
    isDeleted: { $ne: true },
  })
    .populate('shop', 'name ownerId phone')
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  return pendingProducts;
};

const approveProductInDB = async (productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw { statusCode: 400, message: 'Invalid product ID format' };
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { status: 'approved' },
    { new: true }
  );

  if (!product) {
    throw { statusCode: 404, message: 'Product not found' };
  }

  return product;
};

const rejectProductInDB = async (productId: string, reason?: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw { statusCode: 400, message: 'Invalid product ID format' };
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { status: 'rejected' },
    { new: true }
  );

  if (!product) {
    throw { statusCode: 404, message: 'Product not found' };
  }

  return product;
};

export const AdminService = {
  getDashboardStatsFromDB,
  getPendingShopsFromDB,
  approveShopInDB,
  rejectShopInDB,
  getPendingProductsFromDB,
  approveProductInDB,
  rejectProductInDB,
};
