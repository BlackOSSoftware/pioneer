"use client";

import { useEffect, useState } from "react";
import VisitingCardFace from "@/components/visiting-card/VisitingCardFace";
import { showAppModal } from "@/lib/pioneer-modal-bus";

export default function PublicVisitingCardClient({ token }) {
  const [share, setShare] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/visiting-card-share?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!data.success || !data.share) {
          setLoadError(data.message || "This visiting card link is not available.");
          return;
        }
        setShare(data.share);
      } catch {
        if (!cancelled) setLoadError("Unable to load this card.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!share) return;
    const t = setTimeout(() => setFlipped(true), 1000);
    return () => clearTimeout(t);
  }, [share]);

  const company = share
    ? {
        name: share.companyName,
        subtitle: share.subtitle,
        role: share.role,
        phone: share.companyPhone,
        email: share.companyEmail || "info@pioneerws.in",
      }
    : {};
  const template = share?.template || "classic";

  const handleLead = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      showAppModal("Please enter your name and mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/visiting-card-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userName: leadName.trim(), userPhone: leadPhone.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not submit.");
      showAppModal("Thank you. Our team will contact you shortly.", { variant: "success", title: "Submitted" });
      setLeadName("");
      setLeadPhone("");
    } catch (err) {
      showAppModal(err.message || "Submission failed.", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-lg font-semibold text-slate-800">{loadError}</p>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 px-2 py-5 min-[360px]:px-3 sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col items-center">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800 min-[360px]:text-xs min-[360px]:tracking-[0.2em]">
            Pioneer Wealth Solutions
          </p>
          <div className="relative w-full max-w-[560px]" style={{ perspective: "1200px" }}>
            <div
              className="relative transition-transform duration-[900ms] ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <div className="backface-hidden" style={{ backfaceVisibility: "hidden" }}>
                <VisitingCardFace mode="company" company={company} template={template} />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <VisitingCardFace
                  mode="person"
                  personName={share.advisorName}
                  personPhone={share.advisorPhone}
                  company={company}
                  template={template}
                />
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500 sm:mt-4">
            {!flipped ? "Introducing Pioneer Wealth…" : "Your advisor's card"}
          </p>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur min-[360px]:p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Connect with us</h2>
          <p className="mt-2 text-sm text-slate-600">Share your details and we&apos;ll reach out from this advisor&apos;s desk.</p>
          <form onSubmit={handleLead} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Mobile number</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="Mobile"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-sky-700 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Contact us"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
