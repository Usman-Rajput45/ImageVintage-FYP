import React from "react";
import { useLocation } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import ImagePreviewCard from "../components/ImagePreviewCard";
import ImageCaptionSection from "../components/ImageCaptionSection";
import TagsSection from "../components/TagsSection";
import ResultsActions from "../components/ResultsActions";

const ResultsPage = () => {
  const location = useLocation();
  const resultsData = location?.state?.results || {};

  // Mock data - will be replaced with API response
  const mockResults = {
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuABAoJ1-Wa7uvXVYMdw2JBvsBUGWWp7LENRY5oioGMGtJt1H9a4dkApq0_W6y-tddFH403KTQGkGDaouSBPFomn60D5JxazMrNUECjKcLdUJ7at0bnQs7tppAc-M_8VQVoFZguS43hDZhXrKDXj_Q5LjjH53svY5pUGG37dUIaqJ_FOkZLYVAcL6ySzeoHXwxMyNfowiJ-jjacmSs85XRlMWQo5m6FvD7isRQYeG9yFvWIaaS9xbSR0xr0o-bq3ej2B6ZXloumYhUQ",
    fileName: "cat_table.jpg",
    fileSize: "2.4 MB",
    caption: "A cat sitting on a wooden table near a window",
    tags: [
      { label: "Cat", percentage: 94, bgColor: "bg-[#e7f5ed]", textColor: "text-[#00714d]", dotColor: "#00714d" },
      { label: "Indoor", percentage: 87, bgColor: "bg-[#e7f5ed]", textColor: "text-[#00714d]", dotColor: "#00714d" },
      { label: "Table", percentage: 72, bgColor: "bg-[#fffbeb]", textColor: "text-[#854d0e]", dotColor: "#854d0e" },
      { label: "Window", percentage: 45, bgColor: "bg-[#f3f4f6]", textColor: "text-[#4b5563]", dotColor: "#4b5563" },
    ],
  };

  const data = resultsData.imageSrc ? resultsData : mockResults;
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
