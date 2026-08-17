import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SupportModal from "../components/SupportModal";
import ApiDocumentationModal from "../components/ApiDocumentationModal";
import { login, continueAsGuest, setError } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const authError = useSelector((state) => state.auth?.error);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || "/", { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  useEffect(() => {
    // Clear any stale error banner from a previous attempt when this page mounts
    dispatch(setError(null));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(login({ email: form.email, password: form.password }));

    setLoading(false);

    if (result.success) {
      navigate(location.state?.from || "/", { replace: true });
    }
    // On failure, `authError` (from Redux state) drives the inline error banner below —
    // the user is NOT logged in and NOT redirected. No demo/fallback session is created.
  };

  const handleGuestContinue = (e) => {
    e.preventDefault();
    dispatch(continueAsGuest());
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md sm:max-w-lg rounded-[28px] border border-slate-200 bg-white px-6 sm:px-8 py-10 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-blue-600 text-[32px]">visibility</span>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">VisionTag</h1>
            <p className="text-sm sm:text-base text-slate-500">Precision Image Analysis &amp; Tagging</p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900 text-center">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500 text-center">Precision Image Analysis &amp; Tagging</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-500">
                Remember me for 30 days
              </label>
            </div>

            {authError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGuestContinue}
            className="mt-4 flex w-full h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Continue as Guest
          </button>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500 mb-4">New to VisionTag?</p>
            <Link
              to="/signup"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-slate-50"
            >
              Create an account
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-slate-900">VisionTag</p>
            <p className="text-xs text-slate-500">© 2024 VisionTag AI. Precision Image Analysis.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600 hover:underline">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={() => setIsApiOpen(true)}
              className="hover:text-blue-600 hover:underline"
            >
              API Docs
            </button>
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-blue-600 hover:underline"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {isApiOpen && <ApiDocumentationModal onClose={() => setIsApiOpen(false)} />}
      {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-slate-100 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
