"use client";

import { useEffect } from "react";
import { useAdminSiteContent } from "@/components/admin/useAdminSiteContent";

export default function AdminAboutSnippetPage() {
  const { loading, saving, about, setAbout, load, save, ready } = useAdminSiteContent();

  useEffect(() => {
    void load();
  }, [load]);

  if (!ready && loading) {
    return <p className="text-sm text-slate-600">Loading…</p>;
  }
  if (!about) return null;

  const m = Array.isArray(about.missionParas) ? about.missionParas : [];
  const p0 = m[0] ?? "";
  const p1 = m[1] ?? "";

  const setP = (i, text) => {
    const next = [...m];
    while (next.length <= i) next.push("");
    next[i] = text;
    setAbout({ ...about, missionParas: next });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">About — Who we are</h1>
      <p className="mt-1 text-sm text-slate-600">
        Edit the mission title and first two paragraphs. Any extra paragraphs already in the database stay when you save.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Section title</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={about.missionTitle || ""}
            onChange={(e) => setAbout({ ...about, missionTitle: e.target.value })}
            placeholder="Who we are"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Paragraph 1</label>
          <textarea
            className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={p0}
            onChange={(e) => setP(0, e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Paragraph 2</label>
          <textarea
            className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={p1}
            onChange={(e) => setP(1, e.target.value)}
          />
        </div>
        <div className="border-t border-slate-200 pt-4">
          <label className="text-xs font-medium text-slate-600">Mission / Vision heading</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={about.missionVisionHeading || ""}
            onChange={(e) => setAbout({ ...about, missionVisionHeading: e.target.value })}
            placeholder="Our mission and vision"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Our Mission title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={about.ourMissionTitle || ""}
                onChange={(e) => setAbout({ ...about, ourMissionTitle: e.target.value })}
                placeholder="Our Mission"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Our Mission text</label>
              <textarea
                className="mt-1 min-h-[110px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={about.ourMissionText || ""}
                onChange={(e) => setAbout({ ...about, ourMissionText: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Our Vision title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={about.ourVisionTitle || ""}
                onChange={(e) => setAbout({ ...about, ourVisionTitle: e.target.value })}
                placeholder="Our Vision"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Our Vision text</label>
              <textarea
                className="mt-1 min-h-[110px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                value={about.ourVisionText || ""}
                onChange={(e) => setAbout({ ...about, ourVisionText: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="mt-6 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
