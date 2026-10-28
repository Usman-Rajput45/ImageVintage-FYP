const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../../config/env");
const ApiError = require("../../utils/ApiError");
const User = require("../user/user.model");
const BlacklistedToken = require("./blacklistedToken.model");
const { sendPasswordResetEmail } = require("../../utils/mailer");
const logger = require("../../utils/logger");

const SALT_ROUNDS = 12;

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

// FR-01 / UC-02
const register = async ({ fullName, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ fullName: fullName.trim(), email, passwordHash });

  const token = signToken(user);
  return { user: user.toSafeObject(), token };
};

// FR-01 / UC-03
const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken(user);
  return { user: user.toSafeObject(), token };
};

// FR-13 / UC-09
const logout = async (token) => {
  try {
    const decoded = jwt.decode(token);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    await BlacklistedToken.create({ token, expiresAt });
  } catch (error) {
    // Even if blacklisting fails for some reason, logout should not error out for the client —
    // the frontend always clears its local session regardless.
    logger.warn(`Failed to blacklist token on logout: ${error.message}`);
  }
};

// FR-14 / UC-10 (request)
// Always resolves successfully regardless of whether the email exists, to avoid
// leaking which addresses are registered.
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour, per FR-14
  await user.save();

  const resetUrl = `${env.resetPasswordUrl}?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error.message}`);
    console.error(`[MAIL ERROR] Failed to send password reset email to ${user.email}: ${error.message}`);
    if (env.nodeEnv !== "production") {
      logger.info(`[DEV ONLY] Password reset link for ${user.email}: ${resetUrl}`);
    }
  }
};

// FR-14 / UC-10 (confirm)
const resetPassword = async ({ token, email, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email: email?.toLowerCase().trim(),
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: new Date() },
  }).select("+resetToken +resetTokenExpiry");

  if (!user) {
    throw new ApiError(400, "This password reset link is invalid or has expired.");
  }

  user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
};

module.exports = { register, login, logout, forgotPassword, resetPassword };
