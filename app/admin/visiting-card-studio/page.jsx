"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Link2, Sparkles, Trash2 } from "lucide-react";
import VisitingCardFace from "@/components/visiting-card/VisitingCardFace";
import { showAppModal, confirmAppModal } from "@/lib/pioneer-modal-bus";

const COMPANY = {
  name: "Pioneer Wealth",
  subtitle: "Financial Planning & Mutual Funds",
  role: "Wealth Advisor",
  phone: "+91 98765 43210",
  email: "info@pioneerws.in",
  website: "www.pioneerwealth.in",
  address: "Mumbai, India",
};

const CARD_TEMPLATES = [
  { value: "classic", label: "Executive Arc" },
  { value: "modern", label: "Obsidian Edge" },
  { value: "clean", label: "Minimal Luxe" },
];

async function waitForAssets(node) {
  if (!node) return;
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
}

export default function VisitingCardStudioPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cardTemplate, setCardTemplate] = useState("classic");
  const [previewReady, setPreviewReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const cardRef = useRef(null);

  const [shares, setShares] = useState([]);
  const [shareName, setShareName] = useState("");
  const [sharePhone, setSharePhone] = useState("");
  const [shareTemplate, setShareTemplate] = useState("classic");
  const [creatingShare, setCreatingShare] = useState(false);

  const cleanPhone = useMemo(() => phone.replace(/[^\d+\-\s()]/g, ""), [phone]);
  const validPhone = useMemo(() => /^[0-9+\-\s()]{7,20}$/.test(cleanPhone), [cleanPhone]);
  const enteredPhone = useMemo(() => cleanPhone.trim(), [cleanPhone]);

  const fetchShares = async () => {
    try {
      const res = await fetch("/api/visiting-card-share?admin=1");
      const data = await res.json();
      if (data.success) setShares(data.shares || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    void fetchShares();
  }, []);

  const createShareRecord = async ({ advisorName, advisorPhone, template }) => {
    const res = await fetch("/api/visiting-card-share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advisorName,
        advisorPhone,
        companyName: COMPANY.name,
        subtitle: COMPANY.subtitle,
        companyPhone: COMPANY.phone,
        companyEmail: COMPANY.email,
        role: COMPANY.role,
        template,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Could not create link.");
    return data.share;
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!name.trim() || !cleanPhone.trim()) {
      showAppModal("Please enter your name and mobile number.");
      return;
    }
    if (!validPhone) {
      showAppModal("Please enter a valid mobile number.");
      return;
    }
    setPreviewReady(true);
    setShowPopup(false);
    setTimeout(() => {
      void handleDownload({ force: true });
    }, 220);
  };

  const handleDownload = async (arg) => {
    if (arg && typeof arg.preventDefault === "function") arg.preventDefault();
    const force = Boolean(arg && typeof arg === "object" && "force" in arg && arg.force);
    if (!previewReady && !force) {
      setShowPopup(true);
      return;
    }
    if (!cardRef.current) {
      showAppModal("Card preview is not ready yet.");
      return;
    }
    try {
      setIsDownloading(true);
      setSaveStatus("");
      setGeneratedLink("");
      let savedToAdmin = false;
      let saveErrorMessage = "";
      let shareUrl = "";
      let shareErrorMessage = "";
      try {
        const res = await fetch("/api/visiting-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: name.trim(),
            userPhone: enteredPhone,
            companyName: COMPANY.name,
            subtitle: COMPANY.subtitle,
            companyPhone: COMPANY.phone,
            source: "Admin Visiting Card Studio",
          }),
        });
        let payload = {};
        try {
          payload = await res.json();
        } catch {
          payload = {};
        }
        if (res.ok && payload.success) savedToAdmin = true;
        else saveErrorMessage = payload?.error || payload?.message || "Admin save failed.";
      } catch (error) {
        saveErrorMessage = error.message || "Admin save failed.";
      }
      await waitForAssets(cardRef.current);
      const domtoimage = (await import("dom-to-image-more")).default;
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        bgcolor: "#ffffff",
        cacheBust: true,
        copyDefaultStyles: false,
        disableEmbedFonts: true,
        scale: Math.min(window.devicePixelRatio || 2, 3),
      });
      const filename = `${name.trim().replace(/\s+/g, "-").toLowerCase()}-visiting-card.png`;
      const link = document.createElement("a");
      link.setAttribute("href", dataUrl);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      try {
        const share = await createShareRecord({
          advisorName: name.trim(),
          advisorPhone: enteredPhone,
          template: cardTemplate,
        });
        shareUrl = `${window.location.origin}/card/${share.token}`;
        setGeneratedLink(shareUrl);
        await fetchShares();
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch {
          /* ignore clipboard failures */
        }
      } catch (error) {
        shareErrorMessage = error.message || "Share link failed.";
      }

      const statusParts = ["Card downloaded."];
      statusParts.push(savedToAdmin ? "Data saved in admin." : `Admin save failed.${saveErrorMessage ? ` ${saveErrorMessage}` : ""}`);
      statusParts.push(shareUrl ? "Share link generated and copied." : `Share link failed.${shareErrorMessage ? ` ${shareErrorMessage}` : ""}`);
      setSaveStatus(statusParts.join(" "));
    } catch (error) {
      showAppModal(error.message || "Unable to download right now.");
    } finally {
      setIsDownloading(false);
    }
  };

  const createShareLink = async (e) => {
    e.preventDefault();
    if (!shareName.trim() || !sharePhone.trim()) {
      showAppModal("Enter advisor name and phone to create a share link.");
      return;
    }
    setCreatingShare(true);
    try {
      const share = await createShareRecord({
        advisorName: shareName.trim(),
        advisorPhone: sharePhone.trim(),
        template: shareTemplate,
      });
      setShareName("");
      setSharePhone("");
      await fetchShares();
      setGeneratedLink(`${window.location.origin}/card/${share.token}`);
      showAppModal("Share link created. Copy it from the list below.", { variant: "success" });
    } catch (err) {
      showAppModal(err.message || "Failed to create link.", { variant: "error" });
    } finally {
      setCreatingShare(false);
    }
  };

  const copyLink = (token) => {
    const url = `${window.location.origin}/card/${token}`;
    void navigator.clipboard.writeText(url);
    showAppModal("Link copied to clipboard.", { variant: "success" });
  };

  const removeShare = async (id) => {
    const ok = await confirmAppModal("Delete this share link?", {
      title: "Delete link",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/visiting-card-share?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();
      await fetchShares();
    } catch {
      showAppModal("Could not delete link.", { variant: "error" });
    }
  };

  return (
    <div
      style={{ background: "radial-gradient(circle at top right, #E0F2FE 0%, #F8FAFC 36%, #EFF6FF 100%)", color: "#0F172A" }}
      className="relative min-h-screen overflow-x-hidden pb-16"
    >
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(14, 116, 144, 0.16)" }} />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(15, 23, 42, 0.12)" }} />

      <section className="mx-3 mt-4 rounded-3xl px-4 py-7 shadow-xl sm:mx-6 sm:px-8 lg:mt-3 lg:py-6" style={{ background: "linear-gradient(132deg, #0B132B 0%, #1B2A41 52%, #255E7E 100%)", color: "#fff" }}>
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs tracking-wide text-slate-100">
            <Sparkles size={14} />
            Admin · Visiting Card Studio
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Design & share visiting cards</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            Create downloadable cards and public flip links. Leads from share links appear in Visiting Card Submissions with source tracking.
          </p>
          <div className="mt-4 text-xs text-slate-300 sm:text-sm">
            <Link href="/admin" className="underline">
              Admin
            </Link>{" "}
            <span className="mx-1">/</span> Visiting Card Studio
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-3 pb-10 pt-6 sm:px-6 lg:grid-cols-2">
        <section className="rounded-2xl border p-4 shadow-sm sm:p-6" style={{ background: "rgba(255,255,255,0.92)", borderColor: "#D6E3EE" }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold sm:text-xl">Card preview</h2>
            <button
              type="button"
              onClick={() => setShowPopup(true)}
              className="rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-slate-100 sm:text-sm"
              style={{ borderColor: "#CBD5E1", color: "#334155" }}
            >
              Edit details
            </button>
          </div>
          <div className="rounded-xl p-1">
            <div className="relative mx-auto max-w-[560px]" ref={cardRef}>
              <VisitingCardFace
                mode="person"
                personName={previewReady ? name : ""}
                personPhone={previewReady ? enteredPhone : ""}
                company={COMPANY}
                template={cardTemplate}
              />
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border p-4 shadow-sm sm:p-6" style={{ background: "rgba(255,255,255,0.92)", borderColor: "#D6E3EE" }}>
            <h2 className="text-lg font-semibold sm:text-xl">Download</h2>
            <p className="mt-2 text-sm" style={{ color: "#4D6378" }}>
              Save lead to admin, then download PNG.
            </p>
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={isDownloading}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "linear-gradient(120deg, #0E2A47 0%, #256D85 100%)", boxShadow: "0 12px 24px rgba(14,42,71,0.22)" }}
            >
              {isDownloading ? "Saving & downloading…" : "Download visiting card"}
            </button>
            {saveStatus ? <p className="mt-3 text-xs" style={{ color: "#3E5870" }}>{saveStatus}</p> : null}
            {generatedLink ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none"
                  title="Generated visiting card share link"
                />
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                  onClick={() => {
                    void navigator.clipboard.writeText(generatedLink);
                    showAppModal("Link copied to clipboard.", { variant: "success" });
                  }}
                >
                  Copy
                </button>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border p-4 shadow-sm sm:p-6" style={{ background: "rgba(255,255,255,0.92)", borderColor: "#D6E3EE" }}>
            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
              <Link2 className="h-5 w-5" />
              Shareable links
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Visitors see the Pioneer card, then a flip to the advisor card, with a lead form tracked to this link.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live link preview</p>
              <VisitingCardFace
                mode="person"
                personName={shareName}
                personPhone={sharePhone}
                company={COMPANY}
                template={shareTemplate}
              />
            </div>
            <form onSubmit={createShareLink} className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Advisor name on card"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Advisor mobile on card"
                value={sharePhone}
                onChange={(e) => setSharePhone(e.target.value)}
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {CARD_TEMPLATES.map((template) => (
                  <label
                    key={template.value}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-semibold transition ${
                      shareTemplate === template.value
                        ? "border-sky-600 bg-sky-50 text-sky-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shareTemplate"
                      value={template.value}
                      checked={shareTemplate === template.value}
                      onChange={(e) => setShareTemplate(e.target.value)}
                      className="sr-only"
                    />
                    {template.label}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={creatingShare}
                className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {creatingShare ? "Creating…" : "Create share link"}
              </button>
            </form>

            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
              {shares.map((s) => (
                <li key={s._id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.advisorName}</p>
                    <p className="truncate text-xs text-slate-500">{s.advisorPhone} - {CARD_TEMPLATES.find((t) => t.value === s.template)?.label || "Executive Arc"}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" className="rounded p-2 text-slate-600 hover:bg-slate-100" onClick={() => copyLink(s.token)} title="Copy link">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded p-2 text-rose-600 hover:bg-rose-50" onClick={() => void removeShare(s._id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-2xl sm:p-6"
            style={{ borderColor: "#D6E3EE", background: "linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-slate-900">Card details</h3>
            <form onSubmit={handleCreateCard} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name on card</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mobile on card</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Card format</label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {CARD_TEMPLATES.map((template) => (
                    <label
                      key={template.value}
                      className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-semibold transition ${
                        cardTemplate === template.value
                          ? "border-sky-600 bg-sky-50 text-sky-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cardTemplate"
                        value={template.value}
                        checked={cardTemplate === template.value}
                        onChange={(e) => setCardTemplate(e.target.value)}
                        className="sr-only"
                      />
                      {template.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowPopup(false)} className="flex-1 rounded-lg border py-2 text-sm">
                  Close
                </button>
                <button type="submit" className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
