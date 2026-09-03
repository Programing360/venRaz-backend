export interface IAdminDashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalShops: number;
  totalOrders: number;
  totalProducts: number;
  pendingShops: number;
  pendingProducts: number;
}

export interface IShopRejectPayload {
  reason: string;
}

export interface IProductRejectPayload {
  reason?: string;
}
