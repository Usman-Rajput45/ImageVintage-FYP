const asyncHandler = require("express-async-handler");
const authService = require("./auth.service");
const { sendSuccess } = require("../../utils/apiResponse");

// POST /api/auth/register — FR-01 / UC-02
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const result = await authService.register({ fullName, email, password });
  sendSuccess(res, 201, "Account created successfully.", result);
});

// POST /api/auth/login — FR-01 / UC-03
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  sendSuccess(res, 200, "Logged in successfully.", result);
});

// POST /api/auth/logout — FR-13 / UC-09
const logout = asyncHandler(async (req, res) => {
  if (req.token) {
    await authService.logout(req.token);
  }
  sendSuccess(res, 200, "Logged out successfully.");
});

// POST /api/auth/forgot-password — FR-14 / UC-10
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  // Always the same generic message, whether or not the email exists — prevents user enumeration.
  sendSuccess(res, 200, "If an account with that email exists, a password reset link has been sent.");
});

// POST /api/auth/reset-password — FR-14 / UC-10
const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;
  await authService.resetPassword({ token, email, password });
  sendSuccess(res, 200, "Password has been reset successfully. You can now log in.");
});

module.exports = { register, login, logout, forgotPassword, resetPassword };
