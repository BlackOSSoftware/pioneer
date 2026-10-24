"use client";

import { Sparkles, Download, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import SeoBreadcrumbs from "@/components/seo/SeoBreadcrumbs";

export function GoalPlannerShell({
  title,
  highlight,
  breadcrumb,
  description,
  children,
  disclaimer,
}) {
  const pathname = usePathname() || "/Goal_Planners/Dream-home";

  return (
    <div className="goal-page min-h-screen pb-20">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#071a2e]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 85% -20%, rgba(56,189,248,0.32), transparent 50%), radial-gradient(ellipse 60% 50% at -10% 80%, rgba(14,116,144,0.35), transparent 45%), linear-gradient(135deg, #071a2e 0%, #0a2744 55%, #0c3d5c 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="text-sky-100/90 [&_a]:text-sky-100 [&_a:hover]:text-white [&_span]:text-white">
            <SeoBreadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Goal Planners", path: "/Goal_Planners/Dream-home" },
                { name: breadcrumb || title, path: pathname },
              ]}
            />
          </div>

          <div className="mt-6 max-w-2xl">
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
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {children}
      </main>

      <section className="mx-auto mt-10 max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Disclaimer</h3>
          {disclaimer || (
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
              <p>
                Goal projections are illustrative estimates only. Actual returns vary with markets,
                inflation, and investment choices. Verify independently before investing.
              </p>
              <p className="font-medium text-slate-800">
                Mutual fund investments are subject to market risks. Please read all scheme-related
                documents carefully.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function GoalCard({ title, children, action }) {
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

export function GoalField({ label, children, hint }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold tracking-tight text-slate-700">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function GoalInput({ type = "text", value, onChange, placeholder, min, max, step }) {
  return (
    <input
      type={type}
      value={value}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition focus:border-[#071a2e] focus:bg-white focus:ring-4 focus:ring-sky-100"
    />
  );
}

export function GoalSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition focus:border-[#071a2e] focus:bg-white focus:ring-4 focus:ring-sky-100"
    >
      {options.map((o) => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  );
}

export function GoalPrimaryButton({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071a2e] px-6 py-3.5 text-sm font-semibold !text-white shadow-md shadow-[#071a2e]/30 transition hover:bg-[#0a2744] disabled:opacity-60"
    >
      {children}
      <ArrowRight size={16} />
    </button>
  );
}

export function GoalMetricGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#071a2e] tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function GoalResultPanel({ title = "Plan summary", rows }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#071a2e] via-[#0a2744] to-[#0e4d6e] p-5 text-white shadow-[0_20px_50px_-20px_rgba(7,26,46,0.65)] sm:p-6">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200/95">{title}</h4>
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
              <span className="text-sm text-sky-100/85">{label}</span>
              <span
                className={`text-right font-bold tabular-nums ${
                  isLast ? "text-lg text-amber-200 sm:text-xl" : "text-[15px]"
                }`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GoalDownloadButton({ onClick, busy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#071a2e] px-3.5 py-2 text-sm font-semibold !text-white shadow-md transition hover:bg-[#0a2744] disabled:opacity-60"
    >
      <Download size={15} />
      {busy ? "Preparing…" : "Download PDF"}
    </button>
  );
}
