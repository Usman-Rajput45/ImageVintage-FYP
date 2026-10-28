const logger = require("../utils/logger");
const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// FR-07 / NFR-05: meaningful error messages for the client, full detail logged server-side.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.name === "ValidationError" ? 400 : 500;

    if (err.code === 11000) {
      statusCode = 409;
      message = "A record with these details already exists.";
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid identifier.";
    } else {
      message = statusCode === 500 ? "Something went wrong on our end. Please try again." : err.message;
    }
  }

  if (statusCode >= 500) {
    logger.error(err);
  } else {
    logger.warn(`${statusCode} ${req.method} ${req.originalUrl} — ${message}`);
  }

  res.status(statusCode || 500).json({
    success: false,
    message: message || "Internal server error.",
    ...(err.details && { errors: err.details }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
