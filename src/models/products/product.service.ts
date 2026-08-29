import { IProducts } from "./product.interface";
import { Product } from "./product.model";
import { getBaseProductPipeline } from "./product.pipeline";

export const createProductIntoDB = async (payload: IProducts) => {
  const result = await Product.create(payload);
  return result;
};
const getFlashSaleProducts = async (limit = 10) => {
  const match = {
    isFlashSale: true,
    flashSaleEndDate: { $gt: new Date() },
  };
  return await Product.aggregate(getBaseProductPipeline(match, { createdAt: -1 }, limit));
};

const getTopRatedProducts = async (limit = 10) => {
  return await Product.aggregate(getBaseProductPipeline({}, { rating: -1 }, limit));
};

const getNewArrivalProducts = async (limit = 10) => {
  return await Product.aggregate(getBaseProductPipeline({}, { createdAt: -1 }, limit));
};

const getHomeSections = async () => {
  const [featured, flashSale, topRated, mostSelling, newArrivals] = await Promise.all([
    Product.aggregate(getBaseProductPipeline({ isFeatured: true }, { createdAt: -1 }, 8)),
    Product.aggregate(getBaseProductPipeline({ isFlashSale: true, flashSaleEndDate: { $gt: new Date() } }, { createdAt: -1 }, 8)),
    Product.aggregate(getBaseProductPipeline({}, { rating: -1 }, 8)),
    Product.aggregate(getBaseProductPipeline({}, { soldQuantity: -1 }, 8)),
    Product.aggregate(getBaseProductPipeline({}, { createdAt: -1 }, 8)),
  ]);

  return {
    featured,
    flashSale,
    topRated,
    mostSelling,
    newArrivals,
  };
};

export const ProductServices = {
  getFlashSaleProducts,
  getTopRatedProducts,
  getNewArrivalProducts,
  getHomeSections,
};