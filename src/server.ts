import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

if (!uri) {
  console.error("FATAL ERROR: MONGODB_URI environment variable is missing.");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(uri as string);
    console.log("Successfully connected to MongoDB via Mongoose! 🚀");

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      await mongoose.connection.close();
      server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected Error in main execution:", err);
  process.exit(1);
});
