"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAdminSiteContent } from "@/components/admin/useAdminSiteContent";
import { newCmsId } from "@/lib/cms-editor-icons";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const emptyPlan = () => ({
  id: newCmsId(),
  name: "",
  company: "",
  coverage: "",
  premium: "",
  features: [],
});

function featuresToText(f) {
  return Array.isArray(f) ? f.join("\n") : "";
}

export default function AdminInsuranceManagePage() {
  const { loading, saving, insurance, setInsurance, load, saveSection, ready } = useAdminSiteContent();
  const [tab, setTab] = useState("life");
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(emptyPlan());
  const [featText, setFeatText] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    void load();
  }, [load]);

  const lifePlans = ready && insurance ? [...(insurance.lifePlans || [])] : [];
  const healthPlans = ready && insurance ? [...(insurance.healthPlans || [])] : [];
  const plans = tab === "life" ? lifePlans : healthPlans;

  const buildInsuranceWithPlans = (nextPlans) => {
    if (tab === "life") return { ...insurance, lifePlans: nextPlans };
    return { ...insurance, healthPlans: nextPlans };
  };

  const openAdd = () => {
    setDraft(emptyPlan());
    setFeatText("");
    setEditIndex(null);
    setModal("edit");
  };

  const openEdit = (i) => {
    const p = plans[i];
    setDraft({ ...p, features: Array.isArray(p.features) ? p.features : [] });
    setFeatText(featuresToText(p.features));
    setEditIndex(i);
    setModal("edit");
  };

  const remove = async (i) => {
    const ok = await confirmAppModal("Delete this plan?", {
      title: "Confirm delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    const nextInsurance = buildInsuranceWithPlans(plans.filter((_, j) => j !== i));
    setInsurance(nextInsurance);
    await saveSection("insurance", nextInsurance);
  };

  const persistDraft = async () => {
    if (!draft.name.trim()) {
      showAppModal("Plan name is required.", { variant: "error", title: "Required" });
      return;
    }
    const features = featText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const row = { ...draft, id: draft.id || newCmsId(), features };
    const next = editIndex === null ? [...plans, row] : plans.map((p, j) => (j === editIndex ? row : p));
    const nextInsurance = buildInsuranceWithPlans(next);
    setInsurance(nextInsurance);
    setModal(null);
    await saveSection("insurance", nextInsurance);
  };

  if (!ready && loading) return <p className="text-sm text-slate-600">Loading…</p>;
  if (!insurance) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Insurance plans</h1>
          <p className="text-sm text-slate-600">Life and health — same data as the public Insurance page. Stored in MongoDB.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-slate-300 p-0.5">
            <button
              type="button"
              onClick={() => setTab("life")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === "life" ? "bg-sky-600 text-white" : "text-slate-700"}`}
            >
              Life
            </button>
            <button
              type="button"
              onClick={() => setTab("health")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === "health" ? "bg-sky-600 text-white" : "text-slate-700"}`}
            >
              Health
            </button>
          </div>
          <button
            type="button"
            onClick={openAdd}
            disabled={saving}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add plan"}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Company</th>
              <th className="py-2 pr-2">Coverage</th>
              <th className="py-2 pr-2">Premium</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={p.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-2 font-medium text-slate-900">{p.name}</td>
                <td className="py-2 pr-2 text-slate-600">{p.company}</td>
                <td className="py-2 pr-2 text-slate-600">{p.coverage}</td>
                <td className="py-2 pr-2 text-slate-600">{p.premium}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    disabled={saving}
                    className="text-sky-600 hover:underline disabled:opacity-50"
                    onClick={() => openEdit(i)}
                  >
                    Edit
                  </button>
                  <span className="mx-2 text-slate-300">|</span>
                  <button
                    type="button"
                    disabled={saving}
                    className="text-rose-600 hover:underline disabled:opacity-50"
                    onClick={() => void remove(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "edit" ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setModal(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{editIndex === null ? `Add ${tab} plan` : `Edit ${tab} plan`}</h2>
              <button type="button" aria-label="Close" onClick={() => setModal(null)} className="text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-600">Name *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Company</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.company}
                  onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Coverage</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.coverage}
                  onChange={(e) => setDraft({ ...draft, coverage: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Premium</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.premium}
                  onChange={(e) => setDraft({ ...draft, premium: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Points / features (one per line)</label>
                <textarea
                  className="mt-1 min-h-[100px] w-full rounded border border-slate-300 px-2 py-1.5 font-mono text-xs"
                  value={featText}
                  onChange={(e) => setFeatText(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={() => void persistDraft()}
              >
                {saving ? "Saving..." : editIndex === null ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
