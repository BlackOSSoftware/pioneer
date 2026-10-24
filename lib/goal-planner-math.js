/** Shared goal-planner math (English UI / PDF-safe numbers). */

export const RISK_RETURNS = {
  Conservative: 8,
  Moderate: 10,
  Aggressive: 12,
};

export function riskReturn(risk) {
  return RISK_RETURNS[risk] ?? RISK_RETURNS.Moderate;
}

export function inflateAmount(present, inflationPct, years) {
  const p = Number(present) || 0;
  const y = Number(years) || 0;
  const i = Number(inflationPct) || 0;
  if (p <= 0 || y <= 0) return Math.round(p);
  return Math.round(p * Math.pow(1 + i / 100, y));
}

/** Required monthly SIP to reach futureValue in `years` at annualReturn%. */
export function requiredMonthlySip(futureValue, years, annualReturnPct) {
  const fv = Number(futureValue) || 0;
  const y = Number(years) || 0;
  const months = Math.round(y * 12);
  if (fv <= 0 || months <= 0) return 0;
  const r = (Number(annualReturnPct) || 0) / 100 / 12;
  if (r === 0) return Math.round(fv / months);
  const sip = (fv * r) / (Math.pow(1 + r, months) - 1);
  return Math.round(sip > 1e12 ? 1e12 : sip);
}

export function totalInvestedFromSip(monthlySip, years) {
  return Math.round((Number(monthlySip) || 0) * (Number(years) || 0) * 12);
}

export function formatGoalINR(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "₹ 0";
  return `₹ ${Math.round(n).toLocaleString("en-IN")}`;
}

/** Year-end corpus path for a fixed monthly SIP (for charts / PDF). */
export function sipGrowthSeries(monthlySip, years, annualReturnPct) {
  const m = Number(monthlySip) || 0;
  const y = Math.max(0, Math.round(Number(years) || 0));
  const r = (Number(annualReturnPct) || 0) / 100 / 12;
  const labels = [];
  const values = [];
  let balance = 0;
  for (let year = 1; year <= y; year++) {
    for (let mo = 0; mo < 12; mo++) {
      balance += m;
      balance *= 1 + r;
    }
    labels.push(`Y${year}`);
    values.push(Math.round(balance));
  }
  return { labels, values };
}
