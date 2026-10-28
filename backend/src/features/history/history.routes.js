const express = require("express");
const historyController = require("./history.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

// Mounted at /api/history
const historyRouter = express.Router();
historyRouter.use(requireAuth);
historyRouter.get("/", historyController.listHistory); // FR-08, FR-12 (supports ?tag=)
historyRouter.delete("/", historyController.clearHistory); // FR-09: clear entire history
historyRouter.delete("/:id", historyController.deleteEntry); // FR-09: delete one entry

// Mounted at /api/analyses
const analysesRouter = express.Router();
analysesRouter.use(requireAuth);
analysesRouter.get("/:id", historyController.getById);
analysesRouter.put("/:id/tags", historyController.updateTags); // FR-11
analysesRouter.get("/:id/export", historyController.exportAnalysis); // FR-16

module.exports = { historyRouter, analysesRouter };
