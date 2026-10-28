require("dotenv").config();

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill in the values before starting the server.");
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  azure: {
    key: process.env.AZURE_VISION_KEY,
    endpoint: process.env.AZURE_VISION_ENDPOINT,
    timeoutMs: Number(process.env.AZURE_TIMEOUT_MS) || 15000,
  },

  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 10,

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || "VisionTag <no-reply@visiontag.com>",
  },

  resetPasswordUrl: process.env.RESET_PASSWORD_URL || "http://localhost:5173/reset-password",
};
