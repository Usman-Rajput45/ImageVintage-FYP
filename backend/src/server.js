const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`VisionTag backend running on port ${env.port} [${env.nodeEnv}]`);
    logger.info(`Allowed frontend origins: ${env.clientOrigins.join(", ")}`);
    if (!env.azure.key || !env.azure.endpoint) {
      logger.warn(
        "AZURE_VISION_KEY / AZURE_VISION_ENDPOINT not set — /api/images/analyze will return 503 until configured."
      );
    }
  });

  // NFR-05: don't let unhandled errors silently kill the process without a trace.
  process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

start();
