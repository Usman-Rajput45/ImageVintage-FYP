import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Check, Globe, ChevronDown } from "lucide-react";
import { requestPasswordReset } from "../services/userService";

// FR-14 / UC-10: request a password reset email. The actual reset happens on
// the ResetPassword page, reached via the link sent in that email.
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(email);
      // Always show the same confirmation, whether or not the email exists —
      // matches the backend's response (prevents user enumeration).
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1429] via-[#1A1F3A] to-[#0F1429] flex flex-col">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-8 pb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-xl flex items-center justify-center mb-4">
          <div className="w-6 h-6 bg-white rounded-md"></div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {isSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-600">
                  If an account exists for <strong>{email}</strong>, we've sent a password reset
                  link to it. The link is valid for 1 hour.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full border border-purple-300 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">
                  Enter your email address, and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Enter Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending…" : "Send Reset Link"}
                  </button>

                  <Link
                    to="/login"
                    className="w-full border border-purple-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </form>

                <div className="text-center mt-6">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 justify-between items-center px-4 py-4 text-sm text-gray-400 sm:flex-row sm:px-6">
        <div className="flex items-center space-x-4">
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
          <span>•</span>
          <Link to="/help" className="hover:text-white transition-colors">Help</Link>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>English</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
