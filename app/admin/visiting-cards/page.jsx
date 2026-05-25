"use client";

import { useEffect, useMemo, useState } from "react";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

export default function VisitingCardsAdminPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/visiting-card");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch {
      showAppModal("Failed to fetch visiting card entries.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (item) =>
        (item.userName || "").toLowerCase().includes(q) ||
        (item.userPhone || "").toLowerCase().includes(q) ||
        (item.companyName || "").toLowerCase().includes(q) ||
        (item.source || "").toLowerCase().includes(q) ||
        (item.shareToken || "").toLowerCase().includes(q) ||
        (item.cardAdvisorName || "").toLowerCase().includes(q)
    );
  }, [leads, search]);

  const deleteLead = async (id) => {
    const ok = await confirmAppModal("Delete this entry?", {
      title: "Delete submission",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/visiting-card?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Delete failed.");
      }
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      showAppModal(error.message || "Unable to delete.", { variant: "error" });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Visiting Card Submissions</h2>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / number..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-60"
          />
          <button
            onClick={fetchLeads}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading data...</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[960px] border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 p-2 text-left">User Name</th>
                  <th className="border border-gray-200 p-2 text-left">User Number</th>
                  <th className="border border-gray-200 p-2 text-left">Source</th>
                  <th className="border border-gray-200 p-2 text-left">Share / Advisor</th>
                  <th className="border border-gray-200 p-2 text-left">Company</th>
                  <th className="border border-gray-200 p-2 text-left">Subtitle</th>
                  <th className="border border-gray-200 p-2 text-left">Company Number</th>
                  <th className="border border-gray-200 p-2 text-left">Date</th>
                  <th className="border border-gray-200 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((item) => (
                  <tr key={item._id} className="transition hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 text-gray-900">{item.userName}</td>
                    <td className="border border-gray-200 p-2">
                      <a href={`tel:${item.userPhone}`} className="text-blue-600 underline">
                        {item.userPhone}
                      </a>
                    </td>
                    <td className="border border-gray-200 p-2 text-gray-700">{item.source}</td>
                    <td className="border border-gray-200 p-2 text-xs text-gray-700">
                      {item.shareToken ? (
                        <span className="block font-mono text-[11px]">{item.shareToken}</span>
                      ) : null}
                      {item.cardAdvisorName ? <span className="block text-gray-600">{item.cardAdvisorName}</span> : null}
                    </td>
                    <td className="border border-gray-200 p-2 text-gray-700">{item.companyName}</td>
                    <td className="border border-gray-200 p-2 text-gray-700">{item.subtitle}</td>
                    <td className="border border-gray-200 p-2 text-gray-700">{item.companyPhone}</td>
                    <td className="border border-gray-200 p-2 text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <button
                        onClick={() => deleteLead(item._id)}
                        className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredLeads.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">{item.userName}</p>
                  <p className="text-gray-600">
                    Number:{" "}
                    <a href={`tel:${item.userPhone}`} className="text-blue-600 underline">
                      {item.userPhone}
                    </a>
                  </p>
                  <p className="text-gray-600">Company: {item.companyName}</p>
                  <p className="text-gray-600">Source: {item.source}</p>
                  {item.shareToken ? <p className="text-xs text-gray-500">Share: {item.shareToken}</p> : null}
                  {item.cardAdvisorName ? <p className="text-xs text-gray-500">Advisor: {item.cardAdvisorName}</p> : null}
                  <p className="text-gray-600">Subtitle: {item.subtitle}</p>
                  <p className="text-gray-600">Office: {item.companyPhone}</p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteLead(item._id)}
                  className="mt-3 w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">No visiting card entries found.</p>
          )}
        </>
      )}
    </div>
  );
}
