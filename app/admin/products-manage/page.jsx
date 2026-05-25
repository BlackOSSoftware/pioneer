"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAdminSiteContent } from "@/components/admin/useAdminSiteContent";
import { newCmsId } from "@/lib/cms-editor-icons";
import { CmsImageField } from "@/components/admin/cms/CmsImageField";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const emptyFund = () => ({
  id: newCmsId(),
  name: "",
  house: "",
  category: "",
  returns: "",
  risk: "",
  imageUrl: "",
});

export default function AdminProductsManagePage() {
  const { loading, saving, products, setProducts, load, saveSection, ready } = useAdminSiteContent();
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(emptyFund());
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    void load();
  }, [load]);

  const funds = ready && products ? [...(products.funds || [])] : [];

  const openAdd = () => {
    setDraft(emptyFund());
    setEditIndex(null);
    setModal("edit");
  };

  const openEdit = (i) => {
    setDraft({ ...funds[i] });
    setEditIndex(i);
    setModal("edit");
  };

  const remove = async (i) => {
    const ok = await confirmAppModal("Delete this product?", {
      title: "Confirm delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    const nextProducts = { ...products, funds: funds.filter((_, j) => j !== i) };
    setProducts(nextProducts);
    await saveSection("products", nextProducts);
  };

  const persistDraft = async () => {
    if (!draft.name.trim()) {
      showAppModal("Fund / product name is required.", { variant: "error", title: "Required" });
      return;
    }
    const row = { ...draft, id: draft.id || newCmsId() };
    const next = editIndex === null ? [...funds, row] : funds.map((f, j) => (j === editIndex ? row : f));
    const nextProducts = { ...products, funds: next };
    setProducts(nextProducts);
    setModal(null);
    await saveSection("products", nextProducts);
  };

  if (!ready && loading) return <p className="text-sm text-slate-600">Loading…</p>;
  if (!products) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products (funds)</h1>
          <p className="text-sm text-slate-600">Add, edit, or delete funds on the public Products page. Data is stored in MongoDB.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openAdd}
            disabled={saving}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add product"}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">AMC / House</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">1Y %</th>
              <th className="py-2 pr-2">Risk</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((f, i) => (
              <tr key={f.id || i} className="border-b border-slate-100">
                <td className="py-2 pr-2 font-medium text-slate-900">{f.name}</td>
                <td className="py-2 pr-2 text-slate-600">{f.house}</td>
                <td className="py-2 pr-2 text-slate-600">{f.category}</td>
                <td className="py-2 pr-2 text-emerald-600">{f.returns}</td>
                <td className="py-2 pr-2 text-slate-600">{f.risk}</td>
                <td className="py-2 text-right">
                  <button type="button" disabled={saving} className="text-sky-600 hover:underline disabled:opacity-50" onClick={() => openEdit(i)}>
                    Edit
                  </button>
                  <span className="mx-2 text-slate-300">|</span>
                  <button type="button" disabled={saving} className="text-rose-600 hover:underline disabled:opacity-50" onClick={() => void remove(i)}>
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
              <h2 className="text-lg font-semibold text-slate-900">{editIndex === null ? "Add product" : "Edit product"}</h2>
              <button type="button" aria-label="Close" onClick={() => setModal(null)} className="text-slate-500 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-600">Fund / product name *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. HDFC Equity Fund"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">AMC / House</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.house}
                  onChange={(e) => setDraft({ ...draft, house: e.target.value })}
                  placeholder="e.g. HDFC MF"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Category</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">1Y return (e.g. 18.5%)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.returns}
                  onChange={(e) => setDraft({ ...draft, returns: e.target.value })}
                  placeholder="18.5%"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Risk</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.risk}
                  onChange={(e) => setDraft({ ...draft, risk: e.target.value })}
                  placeholder="High / Moderate"
                />
              </div>
              <CmsImageField label="Image (optional)" value={draft.imageUrl || ""} onChange={(url) => setDraft({ ...draft, imageUrl: url })} />
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
