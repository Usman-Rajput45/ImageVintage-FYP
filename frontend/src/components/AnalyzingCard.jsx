import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { analyzingPreview } from "../assets/images";

const AnalyzingCard = ({ imageSrc = analyzingPreview, onCancel, analysisResult }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(31); // Start at 31% to match desired screenshot
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return p;
        const inc = Math.floor(Math.random() * 5) + 1;
        const next = Math.min(100, p + inc);
        if (next >= 100) {
          clearInterval(id);
          setIsAnalyzing(false);
          // Navigate to results page after 1 second
          setTimeout(() => {
            navigate("/results", {
              state: {
                results: {
                  imageSrc: imageSrc,
                  fileName: location?.state?.fileName || "image.jpg",
                  fileSize: analysisResult?.fileSize || "",
                  caption: analysisResult?.caption || "Analysis completed successfully.",
                  tags: analysisResult?.tags || [],
                  confidenceAvg: analysisResult?.confidenceAvg || 0,
                  analysisId: location?.state?.analysisId || null,
                },
              },
            });
          }, 1000);
        }
        return next;
      });
    }, 400);
    return () => clearInterval(id);
  }, [isAnalyzing, navigate, imageSrc, location]);

  useEffect(() => {
    const handle = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="w-full max-w-[90%] mx-auto px-4">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low mb-6">
        <div className="absolute inset-0 z-10">
          <div className="scan-line" />
        </div>
        <img
          ref={imgRef}
          alt="Analyzing preview"
          src={imageSrc}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center gap-4 w-full text-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-surface-container-highest spinner-ring rounded-full" />
          <span className="font-headline-sm text-headline-sm text-on-surface">{isAnalyzing ? "Analyzing your image..." : "Analysis Complete"}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[480px] text-center">
          Our AI is identifying objects, colors, and textures to generate precise metadata tags.
        </p>

        <div className="w-full mt-4">
          <ProgressBar progress={progress} />
          <div className="flex justify-between w-full mt-2 text-sm text-on-surface-variant">
            <span>{progress}%</span>
            <span>Step 2 of 4</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            setIsAnalyzing(false);
            setProgress(0);
            if (onCancel) onCancel();
          }}
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-outline-variant text-primary font-label-sm text-label-sm hover:bg-surface-container-low active:scale-95 transition-all duration-200"
        >
          Cancel Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalyzingCard;
