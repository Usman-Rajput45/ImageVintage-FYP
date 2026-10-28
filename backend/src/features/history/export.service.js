const PDFDocument = require("pdfkit");

// FR-16 / UC-12: JSON export — just the clean, relevant fields.
const toJsonExport = (analysis) => ({
  fileName: analysis.fileName,
  imageUrl: analysis.imageUrl,
  caption: analysis.caption,
  confidenceAvg: analysis.confidenceAvg,
  tags: analysis.tags.map((tag) => ({ label: tag.label, confidence: tag.confidence })),
  editedByUser: analysis.editedByUser,
  createdAt: analysis.createdAt,
});

// FR-16 / UC-12: streams a simple one-page PDF report directly to the response.
const streamPdfExport = (analysis, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="analysis-${analysis._id}.pdf"`);

  doc.pipe(res);

  doc.fontSize(20).text("VisionTag — Analysis Report", { align: "left" });
  doc.moveDown();

  doc.fontSize(11).fillColor("#666").text(`File: ${analysis.fileName}`);
  doc.text(`Analyzed on: ${new Date(analysis.createdAt).toLocaleString()}`);
  doc.text(`Average confidence: ${analysis.confidenceAvg}%`);
  doc.moveDown();

  doc.fontSize(14).fillColor("#000").text("Caption");
  doc.fontSize(11).fillColor("#333").text(analysis.caption || "No caption available.");
  doc.moveDown();

  doc.fontSize(14).fillColor("#000").text("Tags");
  doc.moveDown(0.5);

  analysis.tags.forEach((tag) => {
    doc.fontSize(11).fillColor("#333").text(`•  ${tag.label} — ${tag.confidence}%`);
  });

  if (analysis.tags.length === 0) {
    doc.fontSize(11).fillColor("#999").text("No tags recorded.");
  }

  doc.end();
};

module.exports = { toJsonExport, streamPdfExport };
