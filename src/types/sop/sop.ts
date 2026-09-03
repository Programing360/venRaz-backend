export type ShopStatus = "draft" | "pending" | "approved" | "active" | "rejected" | "suspended";

export interface IShop {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  phone: string;
  status?: ShopStatus;
  rejectionReason?: string;
  rating?: number;
}
