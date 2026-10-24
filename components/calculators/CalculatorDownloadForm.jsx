"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder=" "
        className="peer block h-14 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 px-3 pb-2 pt-6 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:text-transparent hover:border-slate-300 focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:h-16 sm:px-4 sm:pt-8 sm:text-[15px]"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-[1.05rem] text-sm leading-none text-slate-500 transition-all duration-200 ease-out peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-sky-700 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-wide peer-[:not(:placeholder-shown)]:text-sky-700 sm:left-4 sm:top-5 sm:text-[15px] sm:peer-focus:top-2.5 sm:peer-[:not(:placeholder-shown)]:top-2.5"
      >
        {label}
      </label>
    </div>
  );
}

/**
 * Shared premium download lead form — works from 320px up with scroll + visible close.
 */
export default function CalculatorDownloadForm({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  busy = false,
  title = "Download your report",
  subtitle = "Enter your details to receive a branded PDF advisory report.",
}) {
  const uid = useId();

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const setField = (key) => (e) =>
    setFormData({ ...formData, [key]: e.target.value });

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
    >
      <div
        className="relative flex max-h-[min(100dvh,100%)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20 sm:max-h-[min(92dvh,640px)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header — close always visible */}
        <div className="relative shrink-0 bg-gradient-to-br from-[#0a2744] via-[#0d3a5c] to-[#0e4d6e] px-4 pb-4 pt-4 text-white sm:px-6 sm:pb-5 sm:pt-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2.5 top-2.5 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/25 text-white ring-1 ring-white/40 transition hover:bg-black/35 sm:right-3 sm:top-3"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.25} />
          </button>

          <p className="pr-12 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200/90 sm:text-xs sm:tracking-[0.16em]">
            Pioneer Wealth Solutions
          </p>
          <h2
            id={`${uid}-title`}
            className="mt-1 max-w-[85%] text-lg font-bold tracking-tight sm:text-xl"
          >
            {title}
          </h2>
          <p className="mt-1 max-w-[92%] text-xs leading-relaxed text-sky-100/90 sm:mt-1.5 sm:text-sm">
            {subtitle}
          </p>
        </div>

        {/* Scrollable body on small screens */}
        <form
          className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) onSubmit?.();
          }}
        >
          <FloatingField
            id={`${uid}-name`}
            label="Full name"
            value={formData.name}
            onChange={setField("name")}
            autoComplete="name"
          />
          <FloatingField
            id={`${uid}-email`}
            label="Email address"
            type="email"
            value={formData.email}
            onChange={setField("email")}
            autoComplete="email"
          />
          <FloatingField
            id={`${uid}-mobile`}
            label="Mobile number"
            type="tel"
            value={formData.mobile}
            onChange={setField("mobile")}
            autoComplete="tel"
            inputMode="numeric"
          />
          <FloatingField
            id={`${uid}-goal`}
            label="Financial goal"
            value={formData.goal}
            onChange={setField("goal")}
          />

          <button
            type="submit"
            disabled={busy}
            className="mt-1 w-full rounded-xl bg-[#0a2744] px-4 py-3 text-sm font-semibold !text-white shadow-md shadow-[#0a2744]/25 transition hover:bg-[#0d3a5c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Preparing PDF…" : "Submit & download PDF"}
          </button>

          <p className="pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            We use your details only to personalize this report. No spam.
          </p>
        </form>
      </div>
    </div>
  );
}
