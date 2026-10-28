/**
 * A predictable, operational error we can throw anywhere in the app.
 * The global error handler (middlewares/error.middleware.js) knows how to
 * turn this into a clean JSON response.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
