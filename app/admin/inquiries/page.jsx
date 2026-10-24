"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  Search,
  MessageSquare,
  Shield,
  Package,
  Briefcase,
  Calendar,
  User,
} from "lucide-react";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const SOURCE_META = {
  product: {
    label: "Product",
    icon: Package,
    badge: "bg-violet-100 text-violet-800 ring-violet-200",
    accent: "border-l-violet-500",
  },
  service: {
    label: "Service",
    icon: Briefcase,
    badge: "bg-sky-100 text-sky-800 ring-sky-200",
    accent: "border-l-sky-500",
  },
  insurance: {
    label: "Insurance",
    icon: Shield,
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    accent: "border-l-emerald-500",
  },
};

/** Parse context.lines like "Title: Foo" into structured fields; skip Icon noise */
function parseContext(context) {
  if (!context || typeof context !== "object") {
    return { headline: "", fields: [], description: "" };
  }

  const headline = String(context.headline || "").trim();
  const fields = [];
  let description = "";

  const lines = Array.isArray(context.lines) ? context.lines : [];
  for (const raw of lines) {
    const line = String(raw || "").trim();
    if (!line) continue;

    const colon = line.indexOf(":");
    if (colon === -1) {
      fields.push({ label: "Detail", value: line });
      continue;
    }

    const label = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    const key = label.toLowerCase();

    if (key === "icon") continue;
    if (key === "description") {
      description = value;
      continue;
    }
    if (key === "title" && headline) {
      // Headline already covers title — keep only if different
      const headTitle = headline.replace(/^(service|product|insurance)\s*:\s*/i, "").trim();
      if (value.toLowerCase() === headTitle.toLowerCase()) continue;
    }

    fields.push({ label, value });
  }

  // Fallbacks from known ids
  if (context.serviceId && !fields.some((f) => f.label.toLowerCase() === "id")) {
    fields.push({ label: "Service ID", value: String(context.serviceId) });
  }
  if (context.productId && !fields.some((f) => f.label.toLowerCase() === "id")) {
    fields.push({ label: "Product ID", value: String(context.productId) });
  }
  if (context.insuranceId && !fields.some((f) => f.label.toLowerCase() === "id")) {
    fields.push({ label: "Insurance ID", value: String(context.insuranceId) });
  }

  return { headline, fields, description };
}

function formatWhen(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(iso);
  }
}

function SourceBadge({ source }) {
  const meta = SOURCE_META[source] || {
    label: source || "Enquiry",
    icon: MessageSquare,
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${meta.badge}`}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

export default function AdminInquiriesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/page-inquiry");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setList(data.inquiries || []);
    } catch (e) {
      showAppModal(e.message || "Could not load inquiries", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: list.length, product: 0, service: 0, insurance: 0 };
    for (const row of list) {
      if (c[row.source] !== undefined) c[row.source] += 1;
    }
    return c;
  }, [list]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return list.filter((row) => {
      if (filter !== "all" && row.source !== filter) return false;
      if (!needle) return true;
      const ctx = parseContext(row.context);
      const hay = [
        row.name,
        row.email,
        row.phone,
        row.message,
        row.source,
        ctx.headline,
        ctx.description,
        ...ctx.fields.map((f) => `${f.label} ${f.value}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [list, filter, q]);

  const del = async (id) => {
    const ok = await confirmAppModal("Delete this enquiry? This cannot be undone.", {
      title: "Confirm delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    await fetch(`/api/page-inquiry?id=${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((x) => x._id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Enquiries
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Product, service, and insurance form submissions — readable at a glance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "service", label: "Service" },
              { id: "product", label: "Product" },
              { id: "insurance", label: "Insurance" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === tab.id
                    ? "bg-[#0a2744] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 opacity-70">({counts[tab.id] ?? 0})</span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, service…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading enquiries…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <MessageSquare className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 text-sm font-medium text-slate-700">No enquiries found</p>
          <p className="mt-1 text-xs text-slate-500">
            {list.length === 0
              ? "New submissions from Invest / Enquire / Get quote will appear here."
              : "Try another filter or search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((row) => {
            const ctx = parseContext(row.context);
            const meta = SOURCE_META[row.source] || {
              accent: "border-l-slate-400",
            };
            const title =
              ctx.headline ||
              ctx.fields.find((f) => f.label.toLowerCase() === "title")?.value ||
              `${SOURCE_META[row.source]?.label || "Enquiry"} request`;

            return (
              <article
                key={row._id}
                className={`overflow-hidden rounded-2xl border border-slate-200 border-l-4 bg-white shadow-sm ${meta.accent}`}
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <SourceBadge source={row.source} />
                      {row.createdAt ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Calendar size={12} />
                          {formatWhen(row.createdAt)}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                        {title.replace(/^(Service|Product|Insurance):\s*/i, "")}
                      </h2>
                      {ctx.headline && ctx.headline !== title ? (
                        <p className="mt-0.5 text-xs font-medium text-slate-500">{ctx.headline}</p>
                      ) : null}
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                        <User size={14} className="text-slate-400" />
                        {row.name || "—"}
                      </span>
                      {row.email ? (
                        <a
                          href={`mailto:${row.email}`}
                          className="inline-flex items-center gap-1.5 text-sky-700 hover:underline"
                        >
                          <Mail size={14} />
                          {row.email}
                        </a>
                      ) : null}
                      {row.phone ? (
                        <a
                          href={`tel:${row.phone}`}
                          className="inline-flex items-center gap-1.5 text-slate-700 hover:underline"
                        >
                          <Phone size={14} />
                          {row.phone}
                        </a>
                      ) : null}
                    </div>

                    {/* Structured context (no raw JSON) */}
                    {(ctx.fields.length > 0 || ctx.description) && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Request details
                        </p>
                        {ctx.fields.length > 0 ? (
                          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                            {ctx.fields.map((f) => (
                              <div key={`${f.label}-${f.value}`}>
                                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                  {f.label}
                                </dt>
                                <dd className="mt-0.5 text-sm font-medium text-slate-800">{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : null}
                        {ctx.description ? (
                          <p className="mt-3 border-t border-slate-200/80 pt-3 text-sm leading-relaxed text-slate-600">
                            {ctx.description}
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Message */}
                    {row.message ? (
                      <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800/80">
                          Message
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                          {row.message}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => void del(row._id)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
