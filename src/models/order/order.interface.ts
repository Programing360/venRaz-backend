import { Types } from "mongoose";

export type IOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: Types.ObjectId;
  trackingId: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: "cash_on_delivery" | "online";
  status: IOrderStatus;
  isCancelled: boolean;
}
