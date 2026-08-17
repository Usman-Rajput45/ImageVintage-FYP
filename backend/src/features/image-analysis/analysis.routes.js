const express = require("express");
const analysisController = require("./analysis.controller");
const { optionalAuth } = require("../../middlewares/auth.middleware");
const { uploadSingleImage } = require("../../middlewares/upload.middleware");

const router = express.Router();

// Auth optional: registered users get the result auto-saved (UC-01), guests don't (UC-06)
router.post("/analyze", optionalAuth, uploadSingleImage, analysisController.analyzeImage);

module.exports = router;
