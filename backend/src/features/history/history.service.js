const Analysis = require("../image-analysis/analysis.model");
const ApiError = require("../../utils/ApiError");

// GET /api/history?tag= — FR-08, FR-12 / UC-04, UC-08
const listHistory = async (userId, tagQuery) => {
  const filter = { userId };

  if (tagQuery && tagQuery.trim()) {
    // Partial, case-insensitive match on tag label (FR-12)
    filter["tags.label"] = { $regex: tagQuery.trim(), $options: "i" };
  }

  return Analysis.find(filter).sort({ createdAt: -1 });
};

// GET /api/analyses/:id — used by the "view details" page
const getById = async (userId, analysisId) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) throw new ApiError(404, "Analysis not found.");

  // Ownership check — a user may only view their own analyses (Section 4 cross-cutting requirement)
  if (String(analysis.userId) !== String(userId)) {
    throw new ApiError(403, "You do not have access to this analysis.");
  }

  return analysis;
};

// DELETE /api/history/:id — FR-09 / UC-05
const deleteEntry = async (userId, analysisId) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) throw new ApiError(404, "Analysis not found.");

  if (String(analysis.userId) !== String(userId)) {
    throw new ApiError(403, "You do not have access to this analysis.");
  }

  await analysis.deleteOne();
};

// DELETE /api/history — clear entire history (FR-09: "...or clear their entire history")
const clearHistory = async (userId) => {
  await Analysis.deleteMany({ userId });
};

// PUT /api/analyses/:id/tags — FR-11 / UC-07
const updateTags = async (userId, analysisId, tags) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) throw new ApiError(404, "Analysis not found.");

  if (String(analysis.userId) !== String(userId)) {
    throw new ApiError(403, "You do not have access to this analysis.");
  }

  if (!Array.isArray(tags)) {
    throw new ApiError(400, "`tags` must be an array of { label, confidence }.");
  }

  analysis.tags = tags
    .filter((tag) => tag && tag.label && String(tag.label).trim())
    .map((tag) => ({
      label: String(tag.label).trim(),
      confidence: Math.max(0, Math.min(100, Number(tag.confidence) || 0)),
    }));
  analysis.editedByUser = true; // per FR-11: "Entry must be flagged as user-edited afterward."

  await analysis.save();
  return analysis;
};

module.exports = { listHistory, getById, deleteEntry, clearHistory, updateTags };
