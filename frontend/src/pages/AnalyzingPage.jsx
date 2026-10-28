import React, { useEffect } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import AnalyzingCard from "../components/AnalyzingCard";
import { useLocation, useNavigate } from "react-router-dom";

const AnalyzingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const previewUrl = location?.state?.previewUrl;
  const analysisResult = location?.state?.analysisResult;

  useEffect(() => {
    if (!previewUrl) {
      navigate("/", { replace: true });
    }
  }, [navigate, previewUrl]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow flex items-center justify-center p-4 md:p-6 lg:p-8">
        <AnalyzingCard imageSrc={previewUrl} analysisResult={analysisResult} />
      </main>
      <Footer />
    </div>
  );
};

export default AnalyzingPage;
