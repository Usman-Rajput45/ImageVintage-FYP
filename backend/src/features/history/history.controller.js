const asyncHandler = require("express-async-handler");
const historyService = require("./history.service");
const exportService = require("./export.service");
const { sendSuccess } = require("../../utils/apiResponse");

// GET /api/history?tag=
const listHistory = asyncHandler(async (req, res) => {
  const items = await historyService.listHistory(req.user._id, req.query.tag);
  sendSuccess(res, 200, "History fetched successfully.", items);
});

// GET /api/analyses/:id
const getById = asyncHandler(async (req, res) => {
  const analysis = await historyService.getById(req.user._id, req.params.id);
  sendSuccess(res, 200, "Analysis fetched successfully.", analysis);
});

// DELETE /api/history/:id
const deleteEntry = asyncHandler(async (req, res) => {
  await historyService.deleteEntry(req.user._id, req.params.id);
  sendSuccess(res, 200, "Analysis deleted successfully.");
});

// DELETE /api/history — clear all
const clearHistory = asyncHandler(async (req, res) => {
  await historyService.clearHistory(req.user._id);
  sendSuccess(res, 200, "History cleared successfully.");
});

// PUT /api/analyses/:id/tags
const updateTags = asyncHandler(async (req, res) => {
  const analysis = await historyService.updateTags(req.user._id, req.params.id, req.body.tags);
  sendSuccess(res, 200, "Tags updated successfully.", analysis);
});

// GET /api/analyses/:id/export?format=json|pdf
const exportAnalysis = asyncHandler(async (req, res) => {
  const analysis = await historyService.getById(req.user._id, req.params.id);
  const format = (req.query.format || "json").toLowerCase();

  if (format === "pdf") {
    return exportService.streamPdfExport(analysis, res);
  }

  sendSuccess(res, 200, "Analysis exported successfully.", exportService.toJsonExport(analysis));
});

module.exports = { listHistory, getById, deleteEntry, clearHistory, updateTags, exportAnalysis };
