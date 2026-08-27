"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
if (!uri) {
    console.error("FATAL ERROR: MONGODB_URI environment variable is missing.");
    process.exit(1);
}
async function main() {
    try {
        await mongoose_1.default.connect(uri);
        console.log("Successfully connected to MongoDB via Mongoose! 🚀");
        const server = app_1.default.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        const shutdown = async () => {
            console.log("Shutting down server...");
            await mongoose_1.default.connection.close();
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
main().catch((err) => {
    console.error("Unexpected Error in main execution:", err);
    process.exit(1);
});
