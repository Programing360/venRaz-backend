import { IProducts } from "./product.interface";
import { Product } from "./product.model";

export const createProductIntoDB = async (payload: IProducts) => {
  const result = await Product.create(payload);
  return result;
};
