"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { showAppModal } from "@/lib/pioneer-modal-bus";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function linesFromContext(ctx) {
  if (!ctx || typeof ctx !== "object") return [];
  const out = [];
  if (ctx.headline) out.push(String(ctx.headline));
  if (ctx.lines && Array.isArray(ctx.lines)) {
    for (const line of ctx.lines) {
      if (line) out.push(String(line));
    }
  }
  return out;
}

export default function PublicInquiryModal({ open, onClose, title, source, context }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const waText = useMemo(() => {
    const parts = [
      `*${title || "Enquiry"}*`,
      "",
      ...linesFromContext(context),
      "",
      `Name: ${name || "—"}`,
      `Email: ${email || "—"}`,
      `Phone: ${phone || "—"}`,
      message ? `Message: ${message}` : "",
    ].filter(Boolean);
    return parts.join("\n");
  }, [title, context, name, email, phone, message]);

  const waUrl = useMemo(() => buildWhatsAppUrl(waText), [waText]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!name.trim() || !email.trim()) {
      showAppModal("Please enter your name and email.", { variant: "error", title: "Required" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/page-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, context, name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Submit failed");
      showAppModal("Thank you — we received your details. We will contact you shortly.", { variant: "success" });
      handleClose();
    } catch (e) {
      showAppModal(e.message || "Could not submit.", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/55 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inq-title"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="inq-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button type="button" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Name *</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Email *</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Phone</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Message</label>
            <textarea
              className="mt-1 min-h-[88px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            className="flex-1 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit enquiry"}
          </button>
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              WhatsApp with details
            </a>
          ) : (
            <p className="w-full text-center text-xs text-amber-700 sm:flex-1 sm:self-center">
              Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_WHATSAPP_NUMBER</code> in .env.local for WhatsApp (digits with country code).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
