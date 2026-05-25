"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAdminSiteContent } from "@/components/admin/useAdminSiteContent";
import { SERVICE_ICONS, newCmsId } from "@/lib/cms-editor-icons";
import { CmsImageField } from "@/components/admin/cms/CmsImageField";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const emptyItem = () => ({
  id: newCmsId(),
  title: "",
  description: "",
  icon: "Wallet",
  category: "Investment",
  imageUrl: "",
});

export default function AdminServicesManagePage() {
  const { loading, saving, services, setServices, load, saveSection, ready } = useAdminSiteContent();
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState(emptyItem());
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    void load();
  }, [load]);

  const items = ready && services ? [...(services.items || [])] : [];

  const openAdd = () => {
    setDraft(emptyItem());
    setEditIndex(null);
    setModal("edit");
  };

  const openEdit = (i) => {
    setDraft({ ...items[i] });
    setEditIndex(i);
    setModal("edit");
  };

  const remove = async (i) => {
    const ok = await confirmAppModal("Delete this service?", {
      title: "Confirm delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    const nextServices = { ...services, items: items.filter((_, j) => j !== i) };
    setServices(nextServices);
    await saveSection("services", nextServices);
  };

  const persistDraft = async () => {
    if (!draft.title.trim()) {
      showAppModal("Title is required.", { variant: "error", title: "Required" });
      return;
    }
    const row = { ...draft, id: draft.id || newCmsId() };
    const next = editIndex === null ? [...items, row] : items.map((it, j) => (j === editIndex ? row : it));
    const nextServices = { ...services, items: next };
    setServices(nextServices);
    setModal(null);
    await saveSection("services", nextServices);
  };

  if (!ready && loading) return <p className="text-sm text-slate-600">Loading…</p>;
  if (!services) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Services</h1>
          <p className="text-sm text-slate-600">Add, edit, or delete services on the public page. Data is stored in MongoDB.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openAdd}
            disabled={saving}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add service"}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="py-2 pr-2">Title</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">Icon</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id || i} className="border-b border-slate-100">
                <td className="max-w-[200px] truncate py-2 pr-2 font-medium text-slate-900">{it.title}</td>
                <td className="py-2 pr-2 text-slate-600">{it.category}</td>
                <td className="py-2 pr-2 text-slate-600">{it.icon}</td>
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
              <h2 className="text-lg font-semibold text-slate-900">{editIndex === null ? "Add service" : "Edit service"}</h2>
              <button type="button" aria-label="Close" onClick={() => setModal(null)} className="text-slate-500">
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-600">Title *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
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
                <label className="text-xs text-slate-600">Icon</label>
                <select
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.icon}
                  onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                >
                  {SERVICE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600">Description</label>
                <textarea
                  className="mt-1 min-h-[88px] w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={3}
                />
              </div>
              <CmsImageField label="Card image (optional)" value={draft.imageUrl || ""} onChange={(url) => setDraft({ ...draft, imageUrl: url })} />
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
