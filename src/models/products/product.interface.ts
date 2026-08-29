import { Types } from "mongoose";

export type ProductStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "out_of_stock"
  | "hidden";

export interface IProducts {
  name: string;
  description: string;
  images: string[];
  price: number;
  discount?: number;
  stock: number;
  category: Types.ObjectId;
  shop: Types.ObjectId;
  brand?: string;
  rating: number;
  soldCount: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
