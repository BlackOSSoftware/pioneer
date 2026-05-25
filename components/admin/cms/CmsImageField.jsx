"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary } from "./cloudinaryUpload";
import { showAppModal } from "@/lib/pioneer-modal-bus";

export function CmsImageField({ label, value, onChange, hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async () => {
    inputRef.current?.click();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      showAppModal(err.message || "Upload failed", { variant: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1">
      {label ? <label className="text-xs font-medium text-gray-700">{label}</label> : null}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onFile(e)}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /path.jpg"
          className="min-w-[200px] flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={() => void pick()}
          disabled={busy}
          className="rounded border border-sky-600 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-800 disabled:opacity-50"
        >
          {busy ? "…" : "Cloudinary"}
        </button>
      </div>
      {hint ? <p className="text-[11px] text-gray-500">{hint}</p> : null}
    </div>
  );
}
