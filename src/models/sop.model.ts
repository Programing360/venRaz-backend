import { Schema, model } from "mongoose";
import { IShop } from "../types/sop";

const shopSchema = new Schema<IShop>(
  {
    ownerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "active"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Shop = model<IShop>("Shop", shopSchema);
