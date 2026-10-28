const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

const env = require("./config/env");
const logger = require("./utils/logger");
const ApiError = require("./utils/ApiError");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { UPLOAD_DIR } = require("./middlewares/upload.middleware");

const authRoutes = require("./features/auth/auth.routes");
const userRoutes = require("./features/user/user.routes");
const analysisRoutes = require("./features/image-analysis/analysis.routes");
const { historyRouter, analysesRouter } = require("./features/history/history.routes");

const app = express();

// Behind a reverse proxy (Azure App Service, nginx, etc.) — needed for correct
// client IPs in rate limiting / logs, and for secure cookies if added later.
app.set("trust proxy", 1);

// --- Security middleware (NFR-03) ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow the frontend to load /uploads images
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (curl, mobile apps, server-to-server) and any whitelisted origin.
      if (!origin || env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new ApiError(403, "This origin is not allowed by CORS policy."));
    },
    credentials: true,
  })
);

app.use(mongoSanitize()); // strip any $ / . operators from user input to prevent NoSQL injection

// --- Body parsing ---
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// --- Logging (NFR-05) ---
app.use(
  morgan(env.nodeEnv === "production" ? "combined" : "dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// --- Static file serving for uploaded images ---
app.use("/uploads", express.static(UPLOAD_DIR));

// --- Health check ---
app.get("/health", (req, res) => res.status(200).json({ success: true, message: "OK" }));

// --- Routes (feature-based modular structure) ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/images", analysisRoutes);
app.use("/api/history", historyRouter);
app.use("/api/analyses", analysesRouter);

// --- 404 + global error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
