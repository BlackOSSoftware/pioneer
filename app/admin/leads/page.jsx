"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [originalLeads, setOriginalLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH LEADS ================= */
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();

      if (data.success) {
        setLeads(data.leads);
        setOriginalLeads(data.leads);
      }
    } catch (err) {
      alert("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value.trim()) {
      setLeads(originalLeads);
      return;
    }

    setLeads(
      originalLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(value) ||
          l.email.toLowerCase().includes(value)
      )
    );
  };

  /* ================= DELETE ================= */
  const deleteLead = async (id) => {
    if (!confirm("Delete this lead?")) return;

    await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    const csv = leads
      .map(
        (l) =>
          `${l.name},${l.email},${l.mobile},${l.goal},${l.calculatorType}`
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          All Leads
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={handleSearch}
            className="
              border border-gray-300 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-gray-100
              px-3 py-2 rounded-lg text-sm w-64
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          <button
            onClick={fetchLeads}
            className="
              bg-gray-200 dark:bg-slate-700
              text-gray-800 dark:text-gray-100
              px-4 py-2 rounded-lg text-sm
              hover:bg-blue-600 hover:text-white
              transition
            "
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-slate-700">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Mobile",
                  "Goal",
                  "Calculator",
                  "Date",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-2 border border-gray-200 dark:border-slate-700 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {leads.map((l) => (
                <tr
                  key={l._id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100">
                    {l.name}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {l.email}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700">
                    <a
                      href={`tel:${l.mobile}`}
                      className="text-blue-600 dark:text-blue-400 underline"
                    >
                      {l.mobile}
                    </a>
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {l.goal}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {l.calculatorType}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-2 border border-gray-200 dark:border-slate-700">
                    <button
                      onClick={() => deleteLead(l._id)}
                      className="
                        bg-red-500 hover:bg-red-600
                        text-white px-3 py-1 rounded text-xs
                        transition
                      "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No leads found
            </p>
          )}
        </div>
      )}

      {/* EXPORT */}
      <button
        onClick={exportCSV}
        className="
          mt-4 bg-green-600 hover:bg-green-700
          text-white px-4 py-2 rounded-lg text-sm
          transition
        "
      >
        Export CSV
      </button>
    </div>
  );
}
