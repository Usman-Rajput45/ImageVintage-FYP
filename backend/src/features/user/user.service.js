const bcrypt = require("bcryptjs");
const User = require("./user.model");
const ApiError = require("../../utils/ApiError");

const SALT_ROUNDS = 12;

// GET /api/users/profile — FR-15 / UC-11
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");
  return user.toSafeObject();
};

// PUT /api/users/profile — FR-15 / UC-11
// Password is optional — only re-hashed and updated if provided.
const updateProfile = async (userId, { fullName, email, password }) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  if (email && email.toLowerCase().trim() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new ApiError(409, "That email is already in use by another account.");
    }
    user.email = email.toLowerCase().trim();
  }

  if (fullName) user.fullName = fullName.trim();

  if (password) {
    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters.");
    }
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await user.save();
  return user.toSafeObject();
};

module.exports = { getProfile, updateProfile };
