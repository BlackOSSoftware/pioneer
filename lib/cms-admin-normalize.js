import { newCmsId } from "@/lib/cms-editor-icons";

/** Ensure stable ids for list rows in admin UI and public pages. */
export function normalizeAboutForAdmin(about) {
  if (!about || typeof about !== "object") return about;
  return {
    ...about,
    values: (about.values || []).map((v) => ({ ...v, id: v.id || newCmsId() })),
    team: (about.team || []).map((t) => ({ ...t, id: t.id || newCmsId() })),
  };
}

export function normalizeProductsForAdmin(products) {
  if (!products || typeof products !== "object") return products;
  return {
    ...products,
    funds: (products.funds || []).map((f) => ({ ...f, id: f.id || newCmsId() })),
    faqs: (products.faqs || []).map((f) => ({ ...f, id: f.id || newCmsId() })),
  };
}

export function normalizeServicesForAdmin(services) {
  if (!services || typeof services !== "object") return services;
  return {
    ...services,
    items: (services.items || []).map((s) => ({ ...s, id: s.id || newCmsId() })),
  };
}

export function normalizeInsuranceForAdmin(insurance) {
  if (!insurance || typeof insurance !== "object") return insurance;
  const mapPlans = (plans) =>
    (plans || []).map((p) => ({
      ...p,
      id: p.id || newCmsId(),
      features: Array.isArray(p.features) ? p.features : typeof p.features === "string" ? [p.features] : [],
    }));
  return {
    ...insurance,
    lifePlans: mapPlans(insurance.lifePlans),
    healthPlans: mapPlans(insurance.healthPlans),
  };
}

export function normalizeSiteContentForAdmin(data) {
  if (!data || typeof data !== "object") return data;
  const out = {
    ...data,
    about: normalizeAboutForAdmin(data.about),
    products: normalizeProductsForAdmin(data.products),
    services: normalizeServicesForAdmin(data.services),
  };
  if (data.insurance != null && typeof data.insurance === "object") {
    out.insurance = normalizeInsuranceForAdmin(data.insurance);
  }
  return out;
}
