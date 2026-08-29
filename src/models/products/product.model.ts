import { model, Schema } from "mongoose";
import { IProducts } from "./product.interface";

const productsSchema = new Schema<IProducts>(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: false,
    },

    stock: {
      type: Number,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    brand: {
      type: String,
      required: false,
    },

    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    soldCount: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "out_of_stock", "hidden"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  },
);
export const Product = model<IProducts>("Product", productsSchema);
