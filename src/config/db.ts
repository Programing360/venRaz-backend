import mongoose from "mongoose";
import { envVars } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.dbUri);
    console.log("Successfully connected to MongoDB via Mongoose!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
