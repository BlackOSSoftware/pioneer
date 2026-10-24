"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { showAppModal } from "@/lib/pioneer-modal-bus";

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  rightSlot,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder=" "
        required
        className="peer block h-14 w-full rounded-xl border border-slate-200 bg-slate-50/90 px-3.5 pb-2.5 pt-6 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:text-transparent hover:border-slate-300 focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-[1.05rem] text-sm leading-none text-slate-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-sky-700 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-wide peer-[:not(:placeholder-shown)]:text-sky-700"
      >
        {label}
      </label>
      {rightSlot}
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        showAppModal("Login successful. Redirecting…", {
          variant: "success",
          title: "Welcome",
        });
        window.location.href = "/admin";
      } else {
        showAppModal(data.message || "Invalid credentials.", {
          variant: "error",
          title: "Login failed",
        });
      }
    } catch (err) {
      console.error(err);
      showAppModal("Something went wrong. Please try again.", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showAppModal("Please enter your email address.", {
        variant: "error",
        title: "Required",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      showAppModal(data.message || "Done.", {
        variant: data.success ? "success" : "error",
        title: data.success ? "Email sent" : "Request failed",
      });
      if (data.success) setForgotOpen(false);
    } catch (err) {
      console.error(err);
      showAppModal("Error sending reset link. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-clip bg-slate-50">
      <div className="grid min-h-[100dvh] lg:grid-cols-2">
        {/* Left — branded visual */}
        <aside className="relative hidden min-h-[100dvh] overflow-hidden lg:block">
          <Image
            src="/bg/bg1.jpg"
            alt="Pioneer Wealth advisory"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(2,18,40,0.92)_0%,rgba(7,89,133,0.78)_48%,rgba(2,18,40,0.88)_100%)]" />
          <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 right-0 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/newlogo.png"
                alt="Pioneer Wealth Solutions"
                width={140}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <div className="max-w-lg text-white">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
                <ShieldCheck size={14} />
                Secure advisor access
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Plan wealth with clarity and confidence
              </h1>
              <p className="mt-4 text-base leading-relaxed text-sky-100/95">
                Sign in to manage leads, content, and client journeys — built for
                Pioneer Wealth Solutions teams.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-sky-50/95">
                <li className="flex items-center gap-2">
                  <Sparkles size={16} className="text-sky-300" />
                  Goal-based planning tools
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={16} className="text-sky-300" />
                  CMS and enquiry dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={16} className="text-sky-300" />
                  Protected admin workspace
                </li>
              </ul>
            </div>

            <p className="text-xs text-sky-100/70">
              © {new Date().getFullYear()} Pioneer Wealth Solutions
            </p>
          </div>
        </aside>

        {/* Right — login panel */}
        <section className="relative flex min-h-[100dvh] flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_50%)]" />

          <div className="relative mx-auto w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-sky-700"
            >
              <ArrowLeft size={16} />
              Back to website
            </Link>

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <Image
                src="/newlogo.png"
                alt="Pioneer Wealth Solutions"
                width={120}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                Advisor login
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Enter your credentials to open the Pioneer admin dashboard.
              </p>

              <form className="mt-7 space-y-4" onSubmit={handleLogin}>
                <Field
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />

                <div className="relative">
                  <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-sky-700"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotOpen(true);
                    }}
                    className="font-medium text-sky-700 transition hover:text-sky-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-sky-700/25 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Signing in…"
                  ) : (
                    <>
                      <Lock size={16} />
                      Sign in
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
                Protected workspace for authorized Pioneer advisors only.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} className="text-sky-700" />
                info@pioneerws.in
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </section>
      </div>

      {/* Forgot password */}
      {forgotOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={() => setForgotOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">Reset password</h3>
            <p className="mt-1 text-sm text-slate-500">
              Enter your account email and we will send reset instructions.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleForgot}>
              <Field
                id="forgotEmail"
                label="Email address"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                autoComplete="email"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold !text-white hover:bg-sky-800"
                >
                  Send link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
