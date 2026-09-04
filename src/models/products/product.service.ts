import { Types } from "mongoose";
import { IProductQuery, IProducts } from "./product.interface";
import { Product } from "./product.model";
import { getBaseProductPipeline } from "./product.pipeline";

export const createProductIntoDB = async (payload: IProducts) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: IProductQuery) => {
  const {
    page = "1",
    limit = "10",
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  } = query;

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.max(1, Number(limit));
  const skip = (pageNumber - 1) * limitNumber;

  // Dynamic Match Conditions Construction
  const matchConditions: Record<string, unknown> = {
    isDeleted: { $ne: true },
  };

  // Search by Name, Description, or Brand
  if (search) {
    matchConditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by Category
  if (category && Types.ObjectId.isValid(category)) {
    matchConditions.category = new Types.ObjectId(category);
  }

  // Filter by Price Range
  if (minPrice || maxPrice) {
    const priceCondition: Record<string, number> = {};
    if (minPrice) priceCondition.$gte = Number(minPrice);
    if (maxPrice) priceCondition.$lte = Number(maxPrice);
    matchConditions.price = priceCondition;
  }

  // Dynamic Sorting Logic
  let sortCondition: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort) {
    if (sort === "price-asc") sortCondition = { price: 1 };
    else if (sort === "price-desc") sortCondition = { price: -1 };
    else if (sort === "rating") sortCondition = { rating: -1 };
    else if (sort === "oldest") sortCondition = { createdAt: 1 };
  }

  // Execute Aggregation Pipeline for Filtering + Pagination
  const pipeline = [
    ...getBaseProductPipeline(matchConditions, sortCondition, 10000), // Get filtered items
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limitNumber }],
      },
    },
  ];

  const result = await Product.aggregate(pipeline);

  const total = result[0]?.meta[0]?.total || 0;
  const totalPage = Math.ceil(total / limitNumber);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage,
    },
    data: result[0]?.data || [],
  };
};

const getSingleProductFromDB = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid Product ID format");
  }

  const pipeline = getBaseProductPipeline(
    { _id: new Types.ObjectId(productId) },
    { createdAt: -1 },
    1,
  );

  const result = await Product.aggregate(pipeline);

  if (!result || result.length === 0) {
    throw new Error("Product not found");
  }

  return result[0];
};

const getFlashSaleProducts = async (limit = 10) => {
  const match = {
    isFlashSale: true,
    flashSaleEndDate: { $gt: new Date() },
  };
  return await Product.aggregate(
    getBaseProductPipeline(match, { createdAt: -1 }, limit),
  );
};

const getTopRatedProducts = async (limit = 10) => {
  return await Product.aggregate(
    getBaseProductPipeline({}, { rating: -1 }, limit),
  );
};

const getNewArrivalProducts = async (limit = 10) => {
  return await Product.aggregate(
    getBaseProductPipeline({}, { createdAt: -1 }, limit),
  );
};

const getHomeSections = async () => {
  const [featured, flashSale, topRated, mostSelling, newArrivals] =
    await Promise.all([
      Product.aggregate(
        getBaseProductPipeline({ isFeatured: true }, { createdAt: -1 }, 8),
      ),
      Product.aggregate(
        getBaseProductPipeline(
          { isFlashSale: true, flashSaleEndDate: { $gt: new Date() } },
          { createdAt: -1 },
          8,
        ),
      ),
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
  getAllProductsFromDB,
  getSingleProductFromDB,
  getFlashSaleProducts,
  getTopRatedProducts,
  getNewArrivalProducts,
  getHomeSections,
};
