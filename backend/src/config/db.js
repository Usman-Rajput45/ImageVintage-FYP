const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
};

module.exports = connectDB;
