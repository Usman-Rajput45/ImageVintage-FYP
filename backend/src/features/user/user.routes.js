const express = require("express");
const userController = require("./user.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { validateBody, email } = require("../../utils/validate");

const router = express.Router();

router.get("/profile", requireAuth, userController.getProfile);

router.put(
  "/profile",
  requireAuth,
  validateBody({ email: [email()] }), // fullName/password are optional and validated in the service
  userController.updateProfile
);

module.exports = router;
