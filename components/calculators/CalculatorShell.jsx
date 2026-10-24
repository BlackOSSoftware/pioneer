"use client";

import { Download, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import SeoBreadcrumbs from "@/components/seo/SeoBreadcrumbs";

export function formatINR(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "₹ 0";
  return `₹ ${Math.round(n).toLocaleString("en-IN")}`;
}

export function clamp(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

export function SliderMarks({ marks }) {
  return (
    <div className="mt-2.5 flex justify-between px-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {marks.map((m) => (
        <span key={m}>{m}</span>
      ))}
    </div>
  );
}

/** Shared professional shell — all calculator pages */
export function CalculatorShell({
  title,
  highlight,
  breadcrumb,
  description,
  children,
  about,
  disclaimer,
}) {
  const pathname = usePathname() || "/Calculators/sip-return";

  return (
    <div className="calc-page min-h-screen pb-20">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#071a2e]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 85% -20%, rgba(56,189,248,0.35), transparent 50%), radial-gradient(ellipse 60% 50% at -10% 80%, rgba(14,116,144,0.4), transparent 45%), linear-gradient(135deg, #071a2e 0%, #0a2744 55%, #0c3d5c 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="text-sky-100/90 [&_a]:text-sky-100 [&_a:hover]:text-white [&_span]:text-white">
            <SeoBreadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Calculators", path: "/Calculators/sip-return" },
                { name: breadcrumb || title, path: pathname },
              ]}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200 backdrop-blur-sm">
                <Sparkles size={12} className="text-amber-300" />
                Pioneer Wealth Solutions
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
                {highlight ? (
                  <>
                    {" "}
                    <span className="text-amber-300">{highlight}</span>
                  </>
                ) : null}
              </h1>
              {description ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-sky-100/85 sm:text-base">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 sm:justify-end">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300/80">
                  Live tools
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">Instant estimates</p>
              </div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
                  Report
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">1-page PDF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative mx-auto -mt-1 max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {children}
      </main>

      {about ? (
        <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_50px_-24px_rgba(7,26,46,0.35)]">
            <div className="flex h-1.5 w-full">
              <div className="w-1/3 bg-[#071a2e]" />
              <div className="w-1/3 bg-sky-600" />
              <div className="w-1/3 bg-amber-400" />
            </div>
            <div className="p-6 sm:p-8">{about}</div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto mt-8 max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Disclaimer</h3>
          {disclaimer || (
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
              <p>
                Figures shown are illustrative estimates only and do not guarantee future returns. Verify
                independently before investing.
              </p>
              <p className="font-medium text-slate-800">
                Mutual fund investments are subject to market risks. Please read all scheme-related documents
                carefully.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function CalcCard({ title, children, action }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-18px_rgba(7,26,46,0.28)] ring-1 ring-slate-900/[0.03]">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 sm:px-6">
          {title ? (
            <div className="flex items-center gap-2.5">
              <span className="h-4 w-1 rounded-full bg-[#071a2e]" />
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
                {title}
              </h3>
            </div>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[13px] font-semibold tracking-tight text-slate-700">
      {children}
    </label>
  );
}

export function MoneyInput({ value, onChange, placeholder = "Enter amount" }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#071a2e]">
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-8 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-[#071a2e] focus:bg-white focus:ring-4 focus:ring-sky-100"
        value={value ? Number(value).toLocaleString("en-IN") : ""}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          onChange(raw === "" ? 0 : Number(raw));
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

export function NumberField({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition focus:border-[#071a2e] focus:bg-white focus:ring-4 focus:ring-sky-100"
    />
  );
}

export function RangeField({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#071a2e]"
    />
  );
}

export function ResultPanel({ title = "Summary", rows, children }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#071a2e] via-[#0a2744] to-[#0e4d6e] p-5 text-white shadow-[0_20px_50px_-20px_rgba(7,26,46,0.65)] sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200/95">
            {title}
          </h4>
        </div>
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
          Live
        </span>
      </div>
      <div className="mt-4 space-y-0">
        {(rows || []).map(([label, value], i) => {
          const isLast = i === (rows?.length || 0) - 1;
          return (
            <div
              key={label}
              className={`flex items-start justify-between gap-3 py-3.5 ${
                !isLast ? "border-b border-white/10" : ""
              }`}
            >
              <span className={`text-sm ${isLast ? "text-sky-100" : "text-sky-100/80"}`}>{label}</span>
              <span
                className={`text-right font-bold tabular-nums tracking-tight ${
                  isLast ? "text-lg text-amber-200 sm:text-xl" : "text-[15px] sm:text-base"
                }`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

export function DownloadButton({ onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#071a2e] px-3.5 py-2 text-sm font-semibold !text-white shadow-md shadow-[#071a2e]/30 transition hover:bg-[#0a2744] disabled:opacity-60"
    >
      <Download size={15} />
      {busy ? "Preparing…" : "Download PDF"}
    </button>
  );
}

export function ChartPanel({ title, children }) {
  return (
    <CalcCard title={title}>
      <div className="relative w-full max-h-[400px] overflow-hidden">{children}</div>
    </CalcCard>
  );
}
