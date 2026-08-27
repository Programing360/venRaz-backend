import app from "./app";
import { envVars } from "./config/env";
import { client, connectDB } from "./config/db";

async function main() {
  await connectDB();

  const server = app.listen(envVars.port, () => {
    console.log(`Server is running on port ${envVars.port}`);
  });

  const shutdown = async () => {
    console.log("Shutting down server...");
    await client.close();
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
