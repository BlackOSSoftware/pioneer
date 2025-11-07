"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      {/* Logo */}
      <div className="mb-6 flex items-center space-x-2">
        <div className="bg-blue-600 text-white rounded-lg w-9 h-9 flex items-center justify-center font-bold text-lg">
          P
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Pioneer Wealth</h1>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-2 rounded-lg font-medium transition-all ${
              activeTab === "login"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`w-1/2 py-2 rounded-lg font-medium transition-all ${
              activeTab === "register"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* ================= LOGIN FORM ================= */}
        {activeTab === "login" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Login to access your account
            </p>

            <form className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div
                    className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input type="checkbox" className="accent-blue-600" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => setActiveTab("register")}
                className="text-blue-600 hover:underline"
              >
                Register now
              </button>
            </p>

            <Link
              href="/"
              className="block text-center text-sm text-gray-400 mt-6 hover:text-gray-600"
            >
              ← Back to Home
            </Link>
          </>
        )}

        {/* ================= REGISTER FORM ================= */}
        {activeTab === "register" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Create an Account
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Register to start your journey with us
            </p>

            <form className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div
                    className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Register
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>

            <Link
              href="/"
              className="block text-center text-sm text-gray-400 mt-6 hover:text-gray-600"
            >
              ← Back to Home
            </Link>
          </>
        )}
      </div>

      {/* ================= Forgot Password Modal ================= */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setForgotOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Enter your registered email, and we’ll send you a reset link.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
