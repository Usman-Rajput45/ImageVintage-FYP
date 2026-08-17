const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    // 0–100 scale (percentage), consistent with confidenceAvg and the frontend's display logic.
    confidence: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    // null for guest analyses (FR-10) — those are never actually persisted, but the
    // field stays nullable in the schema for correctness / future-proofing.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    fileName: { type: String, default: "image.jpg" },
    imageUrl: { type: String, required: true },
    tags: { type: [tagSchema], default: [] },
    caption: { type: String, default: "" },
    confidenceAvg: { type: Number, default: 0 },
    editedByUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ "tags.label": "text" });

module.exports = mongoose.model("Analysis", analysisSchema);
