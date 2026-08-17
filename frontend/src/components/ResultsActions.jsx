import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const ResultsActions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopyResults = () => {
    const resultsText = document.body.innerText;
    navigator.clipboard.writeText(resultsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeAnother = () => {
    navigate("/");
  };

  const handleExportPDF = async () => {
    const analysisId = location?.state?.analysisId || location?.state?.results?.analysisId || Date.now();
    setExporting(true);

    const loadImageDataUrl = async (src) => {
      try {
        const response = await fetch(src, { mode: "cors" });
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        return null;
      }
    };

    try {
      const results = location?.state?.results || {};
      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const margin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = margin;

      pdf.setFontSize(18);
      pdf.text("VisionTag Analysis Results", margin, y);
      y += 28;

      if (results.imageSrc) {
        const imageDataUrl = await loadImageDataUrl(results.imageSrc);
        if (imageDataUrl) {
          const maxImageWidth = pageWidth - margin * 2;
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageDataUrl;
          });
          const ratio = img.width / img.height || 1;
          const imgWidth = Math.min(maxImageWidth, img.width);
          const imgHeight = imgWidth / ratio;
          const lowerUrl = imageDataUrl.toLowerCase();
          const imageType = lowerUrl.includes("image/jpeg") || lowerUrl.includes("image/jpg") ? "JPEG" : "PNG";
          pdf.addImage(imageDataUrl, imageType, margin, y, imgWidth, imgHeight);
          y += imgHeight + 20;
        }
      }

      pdf.setFontSize(12);
      const addText = (label, value) => {
        if (!value) return;
        const lines = pdf.splitTextToSize(`${label}: ${value}`, pageWidth - margin * 2);
        lines.forEach((line) => {
          if (y > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin, y);
          y += 16;
        });
      };

      addText("File Name", results.fileName || "N/A");
      addText("File Size", results.fileSize || "N/A");
      addText("Caption", results.caption || "N/A");
      addText("Confidence", results.confidence ? `${results.confidence}%` : "N/A");

      if (Array.isArray(results.tags) && results.tags.length > 0) {
        const tagsLine = results.tags.map((tag) => tag.label || tag).join(", ");
        addText("Tags", tagsLine);
      }

      pdf.save(`analysis-${analysisId}.pdf`);
    } catch (err) {
      console.error("Export PDF failed", err);
      alert("PDF export failed. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <button
        onClick={handleExportPDF}
        className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
      >
        <span className="material-symbols-outlined text-base text-slate-700">picture_as_pdf</span>
        Export PDF
      </button>
      
      <button
        onClick={handleCopyResults}
        className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
      >
        <span className="material-symbols-outlined text-base text-slate-700">
          {copied ? "check" : "content_copy"}
        </span>
        {copied ? "Copied!" : "Copy Results"}
      </button>
      <button
        onClick={handleAnalyzeAnother}
        className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
      >
        <span className="material-symbols-outlined text-base">refresh</span>
        Analyze Another Image
      </button>
    </div>
  );
};

export default ResultsActions;
