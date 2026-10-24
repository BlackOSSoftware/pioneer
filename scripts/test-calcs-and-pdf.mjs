/**
 * Smoke-test goal/calculator math + PDF generation (incl. bad lineValues).
 * Run: node scripts/test-calcs-and-pdf.mjs
 */

import { createRequire } from "module";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const require = createRequire(import.meta.url);

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed += 1;
    console.log(`  ✓ ${msg}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${msg}`);
  }
}

function approx(a, b, tol = 1) {
  return Math.abs(a - b) <= tol;
}

// --- Load goal math (transpile-free ESM) ---
const mathUrl = pathToFileURL(path.join(root, "lib", "goal-planner-math.js")).href;
const math = await import(mathUrl);

console.log("\n== Goal planner math ==");
{
  const fv = math.inflateAmount(5_000_000, 6, 10);
  assert(fv === Math.round(5_000_000 * Math.pow(1.06, 10)), `inflateAmount 50L @6% 10y → ${fv}`);

  const ret = math.riskReturn("Moderate");
  assert(ret === 10, `riskReturn Moderate → ${ret}`);

  const sip = math.requiredMonthlySip(fv, 10, 10);
  assert(sip > 0 && Number.isFinite(sip), `requiredMonthlySip → ${sip}`);

  // Cross-check: FV of SIP ≈ target
  const months = 120;
  const r = 0.1 / 12;
  const rebuilt = sip * ((Math.pow(1 + r, months) - 1) / r);
  assert(approx(rebuilt, fv, sip), `SIP rebuilds FV (~${Math.round(rebuilt)} vs ${fv})`);

  const invested = math.totalInvestedFromSip(sip, 10);
  assert(invested === sip * 120, `totalInvestedFromSip → ${invested}`);

  const series = math.sipGrowthSeries(10_000, 5, 12);
  assert(series.labels.length === 5 && series.values.every(Number.isFinite), "sipGrowthSeries length/finite");
  assert(series.values[4] > series.values[0], "sipGrowthSeries grows over years");

  // Emergency: 6 months expenses
  const target = 50_000 * 6;
  const eSip = math.requiredMonthlySip(target, 1, 8);
  assert(eSip > 0, `emergency 1y SIP for ${target} → ${eSip}`);
}

console.log("\n== Calculator SIP math (end-of-period annuity) ==");
{
  const monthly = 10_000;
  const years = 10;
  const annual = 12;
  const months = years * 12;
  const r = annual / 100 / 12;
  const fv = monthly * ((Math.pow(1 + r, months) - 1) / r);
  const invested = monthly * months;
  assert(Math.round(fv) === 23_003_87 || approx(fv, 2_300_387, 5), `SIP FV ~23.0L → ${Math.round(fv)}`);
  // Note: classic end-of-period FV for 10k/12%/10y ≈ 23,00,387
  assert(approx(Math.round(fv), 2_300_387, 2), `SIP FV exact-ish ${Math.round(fv)}`);
  assert(invested === 1_200_000, `invested ${invested}`);
}

console.log("\n== PDF sanitize + jsPDF.line safety ==");
{
  const jsPDFModule = require("jspdf");
  const jsPDF = jsPDFModule?.jsPDF || jsPDFModule?.default || jsPDFModule;
  const pdfBranded = await import(pathToFileURL(path.join(root, "lib", "pdf-branded.js")).href);

  // Bad payload that previously crashed Dream Home PDF
  const bad = pdfBranded.sanitizePdfSeries(
    ["Years", "Risk", "Inflation"],
    [String(10), "Moderate", "6%"]
  );
  assert(bad.values.length === 1 && bad.values[0] === 10, `sanitize drops non-numeric → ${JSON.stringify(bad)}`);

  const good = pdfBranded.sanitizePdfSeries(["Y1", "Y2", "Y3"], [100, 200, 300]);
  assert(good.values.length === 3, "sanitize keeps numeric series");

  const pdf = new jsPDF("p", "pt", "a4");
  try {
    pdfBranded.drawLineChartPdf(pdf, 20, 100, 500, 160, bad.labels, bad.values);
    assert(true, "drawLineChartPdf with sanitized bad payload OK");
  } catch (e) {
    assert(false, `drawLineChartPdf bad payload threw: ${e.message}`);
  }

  try {
    // Raw unsanitized strings should no longer crash (function sanitizes internally)
    pdfBranded.drawLineChartPdf(pdf, 20, 280, 500, 120, ["A", "B"], ["Moderate", "Aggressive"]);
    assert(true, "drawLineChartPdf with raw strings no longer throws");
  } catch (e) {
    assert(false, `drawLineChartPdf raw strings threw: ${e.message}`);
  }

  // Full premium PDF with goal-style payload (no charts images)
  const series = math.sipGrowthSeries(15000, 10, 10);
  try {
    const buf1 = await pdfBranded.createPremiumCalculatorPdf({
      reportTitle: "Dream Home Goal Plan",
      formData: {
        name: "Test User",
        email: "test@example.com",
        mobile: "9999999999",
        goal: "Home",
        calculatorType: "Dream Home Goal Planner",
      },
      summaryCards: [
        ["Goal", "Dream Home"],
        ["Risk", "Moderate"],
        ["Horizon", "10 years"],
      ],
      metricRows: [
        ["Future value", 8_000_000],
        ["Monthly SIP", 15000],
      ],
      lineLabels: series.labels,
      lineValues: series.values,
      returnBuffer: true,
    });
    assert(buf1 instanceof ArrayBuffer && buf1.byteLength > 500, `premium PDF buffer ${buf1.byteLength} bytes`);

    // Previously crashing payload (Dream Home bug: string lineValues)
    const buf2 = await pdfBranded.createPremiumCalculatorPdf({
      reportTitle: "Broken payload test",
      formData: { name: "A", email: "a@b.c", mobile: "1", goal: "g", calculatorType: "Test" },
      summaryCards: [["Risk", "Moderate"]],
      metricRows: [["SIP", 1000]],
      lineLabels: ["Years", "Risk", "Inflation"],
      lineValues: ["10", "Moderate", "6%"],
      returnBuffer: true,
    });
    assert(buf2 instanceof ArrayBuffer && buf2.byteLength > 500, `string lineValues PDF buffer ${buf2.byteLength} bytes`);
  } catch (e) {
    assert(false, `createPremiumCalculatorPdf threw: ${e.message}\n${e.stack}`);
  }
}

console.log("\n== Goal scenarios sanity ==");
{
  const scenarios = [
    { name: "Dream Home", cost: 5e6, years: 10, infl: 6, risk: "Moderate" },
    { name: "Child Education", cost: 2e6, years: 12, infl: 8, risk: "Aggressive" },
    { name: "Child Wedding", cost: 15e5, years: 15, infl: 7, risk: "Moderate" },
    { name: "Wealth", cost: 1e7, years: 20, infl: 6, risk: "Aggressive" },
    { name: "Emergency", cost: 50_000 * 6, years: 1, infl: 6, risk: "Conservative" },
  ];

  for (const s of scenarios) {
    const fv = math.inflateAmount(s.cost, s.infl, s.years);
    const sip = math.requiredMonthlySip(fv, s.years, math.riskReturn(s.risk));
    const ok = fv > 0 && sip > 0 && Number.isFinite(sip);
    assert(ok, `${s.name}: FV=${fv.toLocaleString("en-IN")} SIP=${sip.toLocaleString("en-IN")}`);
  }

  // Retirement gap
  const yearsToRetire = 25;
  const yearsInRet = 25;
  const futExp = math.inflateAmount(50_000, 6, yearsToRetire);
  const corpus = futExp * 12 * yearsInRet;
  const savedFuture = math.inflateAmount(500_000, 10, yearsToRetire);
  const gap = Math.max(0, corpus - savedFuture);
  const rSip = math.requiredMonthlySip(gap, yearsToRetire, 10);
  assert(rSip > 0 && gap > 0, `Retirement SIP=${rSip.toLocaleString("en-IN")} gap=${Math.round(gap).toLocaleString("en-IN")}`);
}

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
