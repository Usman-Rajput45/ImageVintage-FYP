const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const User = require("../features/user/user.model");
const BlacklistedToken = require("../features/auth/blacklistedToken.model");

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }
  return null;
};

/**
 * Verifies the JWT and attaches `req.user`. Rejects with 401 if missing/invalid/expired,
 * or if the token was blacklisted by a prior logout (FR-13).
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required. Please log in.");
  }

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    throw new ApiError(401, "This session has been logged out. Please log in again.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired session. Please log in again.");
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new ApiError(401, "Account no longer exists.");
  }

  req.user = user;
  req.token = token;
  next();
});

/**
 * Used by POST /api/images/analyze (UC-01 vs UC-06): attaches `req.user` if a valid
 * token is present, but never rejects the request — this is how the same endpoint
 * serves both registered users (result gets saved) and guests (result is not saved).
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) return next();

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub);
    if (user) {
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Invalid/expired token on an optional-auth route just means "treat as guest"
  }

  next();
});

module.exports = { requireAuth, optionalAuth };
