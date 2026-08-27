export type ShopStatus = "draft" | "pending" | "approved" | "active";

export interface IShop {
  ownerId: string;
  name: string;
  description: string;
  category: string;
  phone: string;
  status?: ShopStatus;
}
