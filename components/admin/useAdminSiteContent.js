"use client";

import { useCallback, useState } from "react";
import { showAppModal } from "@/lib/pioneer-modal-bus";
import { normalizeSiteContentForAdmin } from "@/lib/cms-admin-normalize";

export function useAdminSiteContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState(null);
  const [products, setProducts] = useState(null);
  const [services, setServices] = useState(null);
  const [insurance, setInsurance] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/admin", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Load failed");
      const n = normalizeSiteContentForAdmin(data.data);
      setAbout(n.about);
      setProducts(n.products);
      setServices(n.services);
      setInsurance(n.insurance);
    } catch (e) {
      showAppModal(e.message || "Could not load.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (next = {}) => {
    const payload = {
      about: next.about ?? about,
      products: next.products ?? products,
      services: next.services ?? services,
      insurance: next.insurance ?? insurance,
    };

    if (!payload.about || !payload.products || !payload.services || !payload.insurance) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      const n = normalizeSiteContentForAdmin(data.data);
      setAbout(n.about);
      setProducts(n.products);
      setServices(n.services);
      setInsurance(n.insurance);
      showAppModal("Saved successfully.", { variant: "success" });
      return true;
    } catch (e) {
      showAppModal(e.message || "Save failed.", { variant: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  }, [about, products, services, insurance]);

  const saveSection = useCallback(async (section, value) => {
    if (!section || !value) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      const n = normalizeSiteContentForAdmin(data.data);
      setAbout(n.about);
      setProducts(n.products);
      setServices(n.services);
      setInsurance(n.insurance);
      showAppModal("Saved successfully.", { variant: "success" });
      return true;
    } catch (e) {
      showAppModal(e.message || "Save failed.", { variant: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    loading,
    saving,
    about,
    setAbout,
    products,
    setProducts,
    services,
    setServices,
    insurance,
    setInsurance,
    load,
    save,
    saveSection,
    ready: Boolean(about && products && services && insurance),
  };
}
