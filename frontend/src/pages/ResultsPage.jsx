import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import ImagePreviewCard from "../components/ImagePreviewCard";
import ImageCaptionSection from "../components/ImageCaptionSection";
import TagsSection from "../components/TagsSection";
import ResultsActions from "../components/ResultsActions";

const ResultsPage = () => {
  const location = useLocation();
  const resultsData = location?.state?.results || {};

  // No analysis in router state (e.g. page opened directly) -> nothing to show, go back to upload.
  if (!resultsData.imageSrc) {
    return <Navigate to="/" replace />;
  }

  const data = resultsData;
  const normalizedTags = Array.isArray(data.tags)
    ? data.tags.map((tag) => ({
        label: tag.label || tag.name || tag,
        percentage: tag.percentage || tag.score || 0,
        bgColor: tag.bgColor || "bg-slate-100 text-slate-700",
        dotColor: tag.dotColor || "#475569",
      }))
    : [];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-grow w-full">
        <div id="results-print-area" className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:items-start">
            <div>
              <ImagePreviewCard
                imageSrc={data.imageSrc}
                fileName={data.fileName}
                fileSize={data.fileSize}
              />
            </div>

            <div className="space-y-10">
              <ImageCaptionSection caption={data.caption} />
              <TagsSection tags={normalizedTags} />
              <ResultsActions />

              <div className="flex justify-end pt-8">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Powered by Azure</span>
                  <span className="material-symbols-outlined text-base">cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
