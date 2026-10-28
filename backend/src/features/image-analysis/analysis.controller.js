const fs = require("fs");
const asyncHandler = require("express-async-handler");
const azureVision = require("./azureVision.service");
const Analysis = require("./analysis.model");
const env = require("../../config/env");
const { sendSuccess } = require("../../utils/apiResponse");
const logger = require("../../utils/logger");

// POST /api/images/analyze — FR-02 to FR-07, FR-10 / UC-01 & UC-06
// `optionalAuth` middleware has already run: req.user is set for a logged-in
// caller, or undefined for a guest — this single endpoint serves both.
const analyzeImage = asyncHandler(async (req, res) => {
  const { path: filePath, filename, originalname } = req.file;

  let result;
  try {
    result = await azureVision.analyzeImageFile(filePath);
  } catch (error) {
    // Clean up the uploaded file if analysis failed — no point keeping it around.
    fs.unlink(filePath, () => {});
    throw error;
  }

  const isGuest = !req.user;

  if (isGuest) {
    // FR-10: guest results are returned but NEVER saved to the database.
    // We also don't need to keep the file on disk once we've analyzed it.
    fs.unlink(filePath, () => {});
    return sendSuccess(res, 200, "Analysis complete.", {
      fileName: originalname,
      imageUrl: null,
      tags: result.tags,
      caption: result.caption,
      confidenceAvg: result.confidenceAvg,
      saved: false,
    });
  }

  const imageUrl = `${env.baseUrl}/uploads/${filename}`;

  const analysis = await Analysis.create({
    userId: req.user._id,
    fileName: originalname,
    imageUrl,
    tags: result.tags,
    caption: result.caption,
    confidenceAvg: result.confidenceAvg,
  });

  logger.info(`Analysis saved for user ${req.user._id}: ${analysis._id}`);

  sendSuccess(res, 201, "Analysis complete.", {
    id: analysis._id,
    fileName: analysis.fileName,
    imageUrl: analysis.imageUrl,
    tags: analysis.tags,
    caption: analysis.caption,
    confidenceAvg: analysis.confidenceAvg,
    createdAt: analysis.createdAt,
    saved: true,
  });
});

module.exports = { analyzeImage };
