import { Shop } from "../models/sop.model";
import { IShop } from "../types/sop";

export const createShopIntoDB = async (payload: IShop) => {
  const result = await Shop.create(payload);
  return result;
};
