const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("./auth.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { validateBody, required, minLength, email } = require("../../utils/validate");

const router = express.Router();

// NFR-03: throttle auth endpoints to slow down brute-force / credential-stuffing attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in a few minutes." },
});

router.post(
  "/register",
  authLimiter,
  validateBody({
    fullName: [required("Full name")],
    email: [required("Email"), email()],
    password: [required("Password"), minLength(8, "Password")],
  }),
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validateBody({
    email: [required("Email"), email()],
    password: [required("Password")],
  }),
  authController.login
);

router.post("/logout", requireAuth, authController.logout);

router.post(
  "/forgot-password",
  authLimiter,
  validateBody({ email: [required("Email"), email()] }),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  validateBody({
    token: [required("Reset token")],
    email: [required("Email"), email()],
    password: [required("Password"), minLength(8, "Password")],
  }),
  authController.resetPassword
);

module.exports = router;
