import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { resetPassword } from "../services/userService";

// FR-14 / UC-10: landing page for the link sent by /api/auth/forgot-password.
// The email includes `?token=...&email=...` — both are required by the backend.
const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isLinkValid = Boolean(token && email);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, email, password: newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg">
        {!isLinkValid ? (
          <div className="bg-white rounded-2xl p-8 shadow text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Invalid reset link</h2>
            <p className="text-gray-600">
              This password reset link is missing or malformed. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] py-3 font-medium text-white"
            >
              Request a new link
            </Link>
          </div>
        ) : success ? (
          <div className="bg-white rounded-2xl p-8 shadow text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-green-600 font-semibold">Password reset successful — redirecting to login…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-gray-600 mt-2">Choose a new password for <strong>{email}</strong>.</p>

            <form onSubmit={handleReset} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 pr-12"
                    placeholder="New password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 pr-12"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
