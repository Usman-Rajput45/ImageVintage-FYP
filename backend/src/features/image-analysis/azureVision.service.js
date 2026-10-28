const axios = require("axios");
const fs = require("fs");
const env = require("../../config/env");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/logger");

/**
 * FR-04: sends the uploaded image to Azure Cognitive Services Computer Vision API.
 * Isolated here so the rest of the app never touches the Azure key or response shape
 * directly (NFR-03, NFR-06) — and so swapping providers later only means editing this file.
 *
 * Uses the Computer Vision v3.2 `analyze` endpoint (Tags + Description/Caption).
 */
const analyzeImageFile = async (filePath) => {
  if (!env.azure.key || !env.azure.endpoint) {
    throw new ApiError(
      503,
      "Image analysis is not configured on the server. Set AZURE_VISION_KEY and AZURE_VISION_ENDPOINT in .env."
    );
  }

  const imageBuffer = fs.readFileSync(filePath);
  const endpoint = env.azure.endpoint.replace(/\/+$/, "");
  const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Tags,Description&language=en`;

  let response;
  try {
    response = await axios.post(url, imageBuffer, {
      headers: {
        "Ocp-Apim-Subscription-Key": env.azure.key,
        "Content-Type": "application/octet-stream",
      },
      timeout: env.azure.timeoutMs, // NFR-01 (configurable via AZURE_TIMEOUT_MS)
    });
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new ApiError(504, "Image analysis timed out. Please try again.");
    }

    const azureMessage = error.response?.data?.error?.message;
    logger.error(`Azure Vision API error: ${azureMessage || error.message}`);

    if (error.response?.status === 401) {
      throw new ApiError(503, "Image analysis service is misconfigured. Please contact support.");
    }
    throw new ApiError(502, "Image analysis service is currently unavailable. Please try again shortly.");
  }

  const data = response.data;

  const tags = (data.tags || [])
    .map((tag) => ({
      label: tag.name,
      confidence: Math.round(tag.confidence * 1000) / 10, // 0.985 -> 98.5
    }))
    .sort((a, b) => b.confidence - a.confidence);

  const caption = data.description?.captions?.[0]?.text || "No description available.";

  const confidenceAvg = tags.length
    ? Math.round((tags.reduce((sum, t) => sum + t.confidence, 0) / tags.length) * 10) / 10
    : 0;

  return { tags, caption, confidenceAvg };
};

module.exports = { analyzeImageFile };
