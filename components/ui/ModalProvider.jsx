"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ModalContext = createContext(null);

function AnimatedModal({ open, title, message, variant, onClose }) {
  if (!open) return null;
  const ring =
    variant === "success"
      ? "border-emerald-200/80 bg-emerald-50/95"
      : variant === "error"
        ? "border-rose-200/80 bg-rose-50/95"
        : "border-sky-200/80 bg-white/95";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-modal-title"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md ${ring} animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-400/20 blur-2xl" />
        <div className="relative p-6 sm:p-7">
          <h2 id="app-modal-title" className="text-lg font-semibold text-slate-900 sm:text-xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-confirm-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 sm:p-7">
          <h2 id="app-confirm-title" className="text-lg font-semibold text-slate-900 sm:text-xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{message}</p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto sm:min-w-[100px]"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="w-full rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 sm:w-auto sm:min-w-[100px]"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const confirmResolveRef = useRef(null);

  const hide = useCallback(() => setModal(null), []);

  const closeConfirm = useCallback((result) => {
    const fn = confirmResolveRef.current;
    confirmResolveRef.current = null;
    setConfirm(null);
    if (typeof fn === "function") fn(Boolean(result));
  }, []);

  const api = useMemo(
    () => ({
      showNotice: (message, title = "Notice") => setModal({ title, message, variant: "info" }),
      success: (message, title = "Success") => setModal({ title, message, variant: "success" }),
      error: (message, title = "Something went wrong") => setModal({ title, message, variant: "error" }),
      hide,
    }),
    [hide]
  );

  useEffect(() => {
    function onBus(e) {
      setConfirm(null);
      confirmResolveRef.current = null;
      const d = e.detail || {};
      const v = d.variant || "info";
      if (v === "success") api.success(d.message, d.title);
      else if (v === "error") api.error(d.message, d.title);
      else api.showNotice(d.message, d.title);
    }
    function onConfirmBus(e) {
      setModal(null);
      const d = e.detail || {};
      confirmResolveRef.current = typeof d.resolve === "function" ? d.resolve : null;
      setConfirm({
        title: d.title ?? "Please confirm",
        message: String(d.message ?? ""),
        confirmLabel: d.confirmLabel ?? "OK",
        cancelLabel: d.cancelLabel ?? "Cancel",
      });
    }
    window.addEventListener("pioneer-app-modal", onBus);
    window.addEventListener("pioneer-app-confirm", onConfirmBus);
    return () => {
      window.removeEventListener("pioneer-app-modal", onBus);
      window.removeEventListener("pioneer-app-confirm", onConfirmBus);
    };
  }, [api]);

  return (
    <ModalContext.Provider value={api}>
      {children}
      <AnimatedModal
        open={Boolean(modal)}
        title={modal?.title ?? ""}
        message={modal?.message ?? ""}
        variant={modal?.variant ?? "info"}
        onClose={hide}
      />
      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "OK"}
        cancelLabel={confirm?.cancelLabel ?? "Cancel"}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </ModalContext.Provider>
  );
}

export function useAppModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useAppModal must be used within ModalProvider");
  }
  return ctx;
}
