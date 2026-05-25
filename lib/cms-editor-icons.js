/** Lucide icon names (PascalCase) valid for dynamic imports in public pages */
export const ABOUT_VALUE_ICONS = [
  "ShieldCheck",
  "Users",
  "Award",
  "Target",
  "HeartPulse",
  "Sparkles",
  "TrendingUp",
  "BriefcaseBusiness",
];

export const SERVICE_ICONS = [
  "Wallet",
  "ShieldCheck",
  "HeartPulse",
  "Target",
  "BriefcaseBusiness",
  "PiggyBank",
  "Landmark",
  "LineChart",
  "Circle",
];

export function newCmsId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
