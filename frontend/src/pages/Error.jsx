import { useState } from "react";
import { Link } from "react-router-dom";
import ApiDocumentationModal from "../components/ApiDocumentationModal";
import SupportModal from "../components/SupportModal";

const Error = () => {
  const [loading, setLoading] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleRetry = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold text-slate-900">
              VisionTag
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Home
              </Link>
              <Link
                to="/history"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                History
              </Link>
            </div>
          </div>

          <Link
            to="/login"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="text-xl font-semibold text-slate-900">
                Something went wrong
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">
                We couldn't analyze this image. Please check the file format or
                try again.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Retrying...
                  </span>
                ) : (
                  "Try Again"
                )}
              </button>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 sm:w-auto"
              >
                Go Home
              </Link>
            </div>

            <div className="w-full border-t border-slate-200 pt-4">
              <div className="inline-flex items-center justify-center gap-2 text-sm text-slate-500">
                <span className="material-symbols-outlined text-base">help_outline</span>
                <span>Supported formats: JPG, PNG, WebP</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-slate-700">
            <span className="font-semibold">VisionTag</span>
            <p>© 2024 VisionTag AI. Precision Image Analysis.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <a href="#" className="transition hover:text-slate-900">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-slate-900">
              Privacy Policy
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsApiOpen(true);
              }}
              className="transition hover:text-slate-900"
            >
              API Docs
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsSupportOpen(true);
              }}
              className="transition hover:text-slate-900"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {isApiOpen && <ApiDocumentationModal onClose={() => setIsApiOpen(false)} />}
      {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}
    </div>
  );
};

export default Error;
