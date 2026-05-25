"use client";

import { useCallback, useEffect, useState } from "react";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

export default function AdminInquiriesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const del = async (id) => {
    const ok = await confirmAppModal("Delete this enquiry?", {
      title: "Confirm delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    await fetch(`/api/page-inquiry?id=${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((x) => x._id !== id));
  };

  if (loading) return <p className="text-sm text-slate-600">Loading…</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Product / Service / Insurance enquiries</h1>
      <p className="mt-1 text-sm text-slate-600">Submissions from Invest, Enquire, and Get quote modals.</p>

      <div className="mt-6 space-y-4">
        {list.length === 0 ? <p className="text-sm text-slate-500">No enquiries yet.</p> : null}
        {list.map((row) => (
          <div key={row._id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold uppercase text-sky-800">
                  {row.source}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {row.name} · {row.email}
                </p>
                {row.phone ? <p className="text-sm text-slate-600">Phone: {row.phone}</p> : null}
                {row.message ? <p className="mt-2 text-sm text-slate-700">{row.message}</p> : null}
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {JSON.stringify(row.context || {}, null, 2)}
                </pre>
                <p className="mt-1 text-xs text-slate-400">{row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}</p>
              </div>
              <button type="button" onClick={() => void del(row._id)} className="text-sm text-rose-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
