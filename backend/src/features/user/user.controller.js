const asyncHandler = require("express-async-handler");
const userService = require("./user.service");
const { sendSuccess } = require("../../utils/apiResponse");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user._id);
  sendSuccess(res, 200, "Profile fetched successfully.", profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const profile = await userService.updateProfile(req.user._id, { fullName, email, password });
  sendSuccess(res, 200, "Profile updated successfully.", profile);
});

module.exports = { getProfile, updateProfile };
