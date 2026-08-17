import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BrandLogo from "./visiontag/BrandLogo";

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 no-underline hover:text-slate-700">
          <BrandLogo className="h-8 w-8 shrink-0 text-blue-700" />
          VisionTag
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Home
          </Link>
          <Link to="/history" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            History
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
          aria-label="Open mobile menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-slate-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </>
            )}
          </svg>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="flex flex-col space-y-4 mt-2">
            <Link
              to="/"
              className="text-center text-sm font-medium text-slate-500 hover:text-slate-900 px-4 py-2"
            >
              Home
            </Link>
            <Link
              to="/history"
              className="text-center text-sm font-medium text-slate-500 hover:text-slate-900 px-4 py-2"
            >
              History
            </Link>
          </div>
        </div>

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-slate-700"
          >
            Sign In
          </Link>
        ) : null}
      </nav>
    </header>
  );
};

export default TopNav;
