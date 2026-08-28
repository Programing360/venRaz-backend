"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
async function main() {
    await (0, db_1.connectDB)();
    const server = app_1.default.listen(env_1.envVars.port, () => {
        console.log(`Server is running on port ${env_1.envVars.port}`);
    });
    const shutdown = async () => {
        console.log("Shutting down server...");
        await db_1.client.close();
        server.close(() => {
            console.log("HTTP server closed.");
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
main().catch((err) => {
    console.error("Unexpected Error in main execution:", err);
    process.exit(1);
});
