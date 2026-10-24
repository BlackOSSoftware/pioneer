"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Calculator,
  Calendar,
  Users,
} from "lucide-react";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const PAGE_SIZE = 10;

function formatWhen(iso) {
  if (!iso) return "—";
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

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [calculatorType, setCalculatorType] = useState("all");
  const [calculatorTypes, setCalculatorTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const abortRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [qDebounced, calculatorType]);

  const fetchLeads = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (qDebounced) params.set("q", qDebounced);
      if (calculatorType && calculatorType !== "all") {
        params.set("calculatorType", calculatorType);
      }

      const res = await fetch(`/api/leads?${params}`, { signal: controller.signal });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch leads");
      }

      setLeads(data.leads || []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        }
      );
      if (Array.isArray(data.filters?.calculatorTypes)) {
        setCalculatorTypes(data.filters.calculatorTypes);
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
      showAppModal(err.message || "Failed to fetch leads.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, qDebounced, calculatorType]);

  useEffect(() => {
    void fetchLeads();
    return () => abortRef.current?.abort();
  }, [fetchLeads]);

  const deleteLead = async (id) => {
    const ok = await confirmAppModal("Delete this lead? This cannot be undone.", {
      title: "Delete lead",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");

      // If last item on page, go back a page
      if (leads.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        void fetchLeads();
      }
    } catch (err) {
      showAppModal(err.message || "Could not delete lead.", { variant: "error" });
    }
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ export: "1" });
      if (qDebounced) params.set("q", qDebounced);
      if (calculatorType && calculatorType !== "all") {
        params.set("calculatorType", calculatorType);
      }

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Export failed");

      const rows = data.leads || [];
      const header = ["Name", "Email", "Mobile", "Goal", "Calculator", "Date"];
      const body = rows.map((l) =>
        [
          csvEscape(l.name),
          csvEscape(l.email),
          csvEscape(l.mobile),
          csvEscape(l.goal),
          csvEscape(l.calculatorType),
          csvEscape(l.createdAt ? new Date(l.createdAt).toISOString() : ""),
        ].join(",")
      );

      const blob = new Blob([[header.join(","), ...body].join("\n")], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `calculator-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showAppModal(err.message || "Could not export CSV.", { variant: "error" });
    } finally {
      setExporting(false);
    }
  };

  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Calculator leads
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              PDF download form submissions from all calculators.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void fetchLeads()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void exportCSV()}
              disabled={exporting || pagination.total === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a2744] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d3a5c] disabled:opacity-60"
            >
              <Download size={15} />
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Stats + filters */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-sm text-slate-700">
            <Users size={15} className="text-sky-700" />
            <span className="font-semibold text-slate-900">{pagination.total}</span>
            <span className="text-slate-500">total leads</span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={calculatorType}
              onChange={(e) => setCalculatorType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              <option value="all">All calculators</option>
              {calculatorTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, email, mobile, goal…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading leads…
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Calculator className="mx-auto text-slate-300" size={32} />
          <p className="mt-3 text-sm font-medium text-slate-700">No leads found</p>
          <p className="mt-1 text-xs text-slate-500">
            {pagination.total === 0 && !qDebounced && calculatorType === "all"
              ? "Leads appear when someone downloads a calculator PDF."
              : "Try another search or calculator filter."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5">Lead</th>
                    <th className="px-4 py-3.5">Contact</th>
                    <th className="px-4 py-3.5">Goal</th>
                    <th className="px-4 py-3.5">Calculator</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr key={l._id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a2744]/8 text-[#0a2744]">
                            <User size={15} />
                          </span>
                          <span className="font-semibold text-slate-900">{l.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {l.email ? (
                            <a
                              href={`mailto:${l.email}`}
                              className="flex items-center gap-1.5 text-sky-700 hover:underline"
                            >
                              <Mail size={13} />
                              {l.email}
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                          {l.mobile ? (
                            <a
                              href={`tel:${l.mobile}`}
                              className="flex items-center gap-1.5 text-slate-600 hover:underline"
                            >
                              <Phone size={13} />
                              {l.mobile}
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-start gap-1.5 text-slate-700">
                          <Target size={13} className="mt-0.5 shrink-0 text-slate-400" />
                          {l.goal || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 ring-1 ring-inset ring-sky-100">
                          {l.calculatorType || "Calculator"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {formatWhen(l.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void deleteLead(l._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {leads.map((l) => (
              <article
                key={l._id}
                className="rounded-2xl border border-slate-200 border-l-4 border-l-sky-500 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{l.name || "—"}</p>
                    <span className="mt-1 inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800">
                      {l.calculatorType || "Calculator"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteLead(l._id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  {l.email ? (
                    <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-sky-700">
                      <Mail size={13} />
                      {l.email}
                    </a>
                  ) : null}
                  {l.mobile ? (
                    <a href={`tel:${l.mobile}`} className="flex items-center gap-1.5 text-slate-700">
                      <Phone size={13} />
                      {l.mobile}
                    </a>
                  ) : null}
                  {l.goal ? (
                    <p className="flex items-start gap-1.5 text-slate-600">
                      <Target size={13} className="mt-0.5 shrink-0" />
                      {l.goal}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} />
                    {formatWhen(l.createdAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:px-5">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {from}–{to}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPrev || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="min-w-[5.5rem] text-center text-sm font-semibold text-slate-800">
                Page {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={!pagination.hasNext || loading}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
