/**
 * Premium calculator PDF kit (jsPDF) — Pioneer Wealth Solutions.
 * Always ONE A4 page, content stretched to fill (no large empty band).
 * Avoid Unicode ₹ (renders as "¹"); use "Rs.".
 */

import jsPDFModule from "jspdf";

// CJS/ESM interop (Next bundler + Node smoke tests)
const jsPDF = jsPDFModule?.jsPDF || jsPDFModule?.default || jsPDFModule;

const logoCache = new Map();

export const PIONEER_PDF = {
  brand: "Pioneer Wealth Solutions",
  tagline: "Goal-based wealth advisory",
  email: "info@pioneerws.in",
  phone: "+91 98765 43210",
  website: "www.pioneerws.in",
  navy: [10, 39, 68],
  sky: [14, 116, 144],
  accent: [37, 99, 235],
  soft: [241, 245, 249],
  soft2: [226, 232, 240],
  border: [203, 213, 225],
  text: [15, 23, 42],
  muted: [100, 116, 139],
  white: [255, 255, 255],
  amber: [245, 158, 11],
};

/** PDF-safe currency */
export function formatPdfMoney(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "Rs. 0";
  return `Rs. ${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatPdfDateTime(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${dd}/${mm}/${yyyy}, ${h}:${min} ${ampm}`;
}

export function loadImageAsDataURL(src) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (logoCache.has(src)) return logoCache.get(src);

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        const maxSide = 140;
        const nw = img.naturalWidth || img.width || maxSide;
        const nh = img.naturalHeight || img.height || maxSide;
        const scale = Math.min(1, maxSide / Math.max(nw, nh));
        c.width = Math.max(1, Math.round(nw * scale));
        c.height = Math.max(1, Math.round(nh * scale));
        const ctx = c.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.9));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

  logoCache.set(src, promise);
  return promise;
}

function setRgb(pdf, rgb, kind = "text") {
  const [r, g, b] = rgb;
  if (kind === "fill") pdf.setFillColor(r, g, b);
  else if (kind === "draw") pdf.setDrawColor(r, g, b);
  else pdf.setTextColor(r, g, b);
}

function clip(s, n = 42) {
  const t = String(s ?? "");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function parseMoneyToNumber(s) {
  const n = Number(String(s ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Branded header */
export async function drawBrandedPdfHeader(pdf, { reportTitle } = {}) {
  const W = pdf.internal.pageSize.getWidth();
  const logo = await loadImageAsDataURL("/newlogo.png");
  const headerH = 64;

  setRgb(pdf, PIONEER_PDF.navy, "fill");
  pdf.rect(0, 0, W, headerH, "F");

  // Subtle right glow band
  setRgb(pdf, [14, 60, 100], "fill");
  pdf.rect(W * 0.62, 0, W * 0.38, headerH, "F");

  setRgb(pdf, PIONEER_PDF.accent, "fill");
  pdf.rect(0, headerH - 3.5, W, 3.5, "F");
  setRgb(pdf, PIONEER_PDF.amber, "fill");
  pdf.rect(0, headerH - 3.5, 72, 3.5, "F");

  const textLeft = logo ? 62 : 24;
  if (logo) {
    try {
      const fmt = logo.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(16, 12, 38, 38, 6, 6, "F");
      pdf.addImage(logo, fmt, 18, 14, 34, 34);
    } catch {
      // ignore
    }
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text(PIONEER_PDF.brand, textLeft, 24);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(186, 230, 253);
  pdf.text(PIONEER_PDF.tagline, textLeft, 36);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(255, 255, 255);
  pdf.text(clip(reportTitle || "Advisory Report", 46), textLeft, 52);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text(PIONEER_PDF.email, W - 20, 22, { align: "right" });
  pdf.text(PIONEER_PDF.phone, W - 20, 34, { align: "right" });
  pdf.setTextColor(186, 230, 253);
  pdf.text(formatPdfDateTime(), W - 20, 46, { align: "right" });
  pdf.setFontSize(7.5);
  pdf.text(PIONEER_PDF.website, W - 20, 56, { align: "right" });

  return headerH + 12;
}

/** Client details — fuller card */
export function drawClientDetailsCard(pdf, y, formData = {}) {
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const boxW = W - margin * 2;
  const rows = [
    ["Name", formData.name || "—"],
    ["Email", formData.email || "—"],
    ["Mobile", formData.mobile || "—"],
    ["Goal", formData.goal || "—"],
  ];
  const cols = 2;
  const rowH = 20;
  const titleH = 22;
  const boxH = titleH + Math.ceil(rows.length / cols) * rowH + 10;

  setRgb(pdf, PIONEER_PDF.soft, "fill");
  setRgb(pdf, PIONEER_PDF.border, "draw");
  pdf.setLineWidth(0.7);
  pdf.roundedRect(margin, y, boxW, boxH, 8, 8, "FD");

  setRgb(pdf, PIONEER_PDF.navy, "fill");
  pdf.roundedRect(margin, y, boxW, titleH, 8, 8, "F");
  pdf.rect(margin, y + titleH - 8, boxW, 8, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Client details", margin + 12, y + 15);

  const report = clip(formData.calculatorType || "Calculator", 34);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(186, 230, 253);
  pdf.text(report, W - margin - 12, y + 15, { align: "right" });

  const colW = (boxW - 24) / cols;
  rows.forEach(([label, value], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = margin + 12 + col * colW;
    const yy = y + titleH + 6 + row * rowH;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setRgb(pdf, PIONEER_PDF.muted);
    pdf.text(`${label}`, x, yy + 10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setRgb(pdf, PIONEER_PDF.text);
    pdf.text(clip(value, 30), x + 42, yy + 10);
  });

  return y + boxH + 12;
}

/** Input / summary cards */
export function drawSummaryCards(pdf, y, items, { cols = 3 } = {}) {
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const gap = 10;
  const usable = W - margin * 2;
  const list = (items || []).slice(0, 6);
  const colCount = Math.min(cols, list.length || 1);
  const boxW = (usable - gap * (colCount - 1)) / colCount;
  const boxH = 52;

  list.forEach((item, i) => {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const x = margin + col * (boxW + gap);
    const yy = y + row * (boxH + gap);

    setRgb(pdf, PIONEER_PDF.white, "fill");
    setRgb(pdf, PIONEER_PDF.border, "draw");
    pdf.setLineWidth(0.8);
    pdf.roundedRect(x, yy, boxW, boxH, 7, 7, "FD");

    setRgb(pdf, PIONEER_PDF.accent, "fill");
    pdf.roundedRect(x, yy, 4, boxH, 2, 2, "F");

    const label = clip(item[0] ?? "", 26);
    const value = String(item[1] ?? "").replace(/₹/g, "Rs.");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    setRgb(pdf, PIONEER_PDF.muted);
    pdf.text(label, x + 14, yy + 18);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    setRgb(pdf, PIONEER_PDF.navy);
    pdf.text(clip(value, 20), x + 14, yy + 38);
  });

  const rows = Math.ceil(list.length / colCount) || 0;
  return y + (rows ? rows * (boxH + gap) : 0);
}

/** Highlight strip for key result (fills visual weight) */
function drawHeroResult(pdf, y, metricRows) {
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const boxW = W - margin * 2;
  const boxH = 58;
  const list = (metricRows || []).slice(0, 3);
  if (!list.length) return y;

  // Prefer last row as primary (usually future value / EMI / corpus)
  const primary = list[list.length - 1];
  const secondary = list.slice(0, -1);

  setRgb(pdf, PIONEER_PDF.navy, "fill");
  pdf.roundedRect(margin, y, boxW, boxH, 9, 9, "F");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(186, 230, 253);
  pdf.text(String(primary[0] || "Key result").toUpperCase(), margin + 16, y + 18);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text(clip(String(primary[1] || "").replace(/₹/g, "Rs."), 28), margin + 16, y + 42);

  // Secondary metrics on the right
  const rightX = margin + boxW * 0.52;
  secondary.forEach((row, i) => {
    const yy = y + 16 + i * 20;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(clip(row[0], 22), rightX, yy);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text(clip(String(row[1]).replace(/₹/g, "Rs."), 22), rightX + 110, yy);
  });

  return y + boxH + 12;
}

/** Metric table */
export function drawMetricTable(pdf, y, title, rows) {
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const tableW = W - margin * 2;
  const headerH = 20;
  const rowH = 20;
  const list = (rows || []).slice(0, 6);
  let yy = y;

  if (title) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    setRgb(pdf, PIONEER_PDF.navy);
    pdf.text(String(title), margin, yy);
    yy += 14;
  }

  setRgb(pdf, PIONEER_PDF.navy, "fill");
  pdf.roundedRect(margin, yy, tableW, headerH, 4, 4, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Metric", margin + 12, yy + 13);
  pdf.text("Amount", margin + tableW - 12, yy + 13, { align: "right" });
  yy += headerH;

  list.forEach((row, i) => {
    const label = clip(row[0] ?? "", 42);
    const value = String(row[1] ?? "").replace(/₹/g, "Rs.");
    if (i % 2 === 0) {
      setRgb(pdf, PIONEER_PDF.soft, "fill");
      pdf.rect(margin, yy, tableW, rowH, "F");
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setRgb(pdf, PIONEER_PDF.text);
    pdf.text(label, margin + 12, yy + 13);
    pdf.setFont("helvetica", "bold");
    pdf.text(clip(value, 30), margin + tableW - 12, yy + 13, { align: "right" });
    yy += rowH;
  });

  return yy + 10;
}

export function drawSectionTitle(pdf, y, title) {
  const margin = 20;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  setRgb(pdf, PIONEER_PDF.navy);
  pdf.text(String(title), margin, y);
  setRgb(pdf, PIONEER_PDF.accent, "fill");
  pdf.rect(margin, y + 4, 28, 2, "F");
  return y + 14;
}

export function ensurePdfSpace(pdf, y) {
  return y;
}

function drawYearSnapshot(pdf, y, labels, values, maxBottom) {
  if (!labels?.length || !values?.length) return y;
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const usableH = maxBottom - y - 4;
  if (usableH < 48) return y;

  const n = Math.min(labels.length, values.length);
  // Pick evenly spaced years (max 5 columns)
  const cols = Math.min(5, n);
  const idxs = [];
  if (cols === 1) idxs.push(0);
  else {
    for (let i = 0; i < cols; i++) {
      idxs.push(Math.round((i * (n - 1)) / (cols - 1)));
    }
  }

  const gap = 8;
  const boxW = (W - margin * 2 - gap * (cols - 1)) / cols;
  const boxH = Math.min(56, usableH);

  idxs.forEach((idx, i) => {
    const x = margin + i * (boxW + gap);
    setRgb(pdf, PIONEER_PDF.soft, "fill");
    setRgb(pdf, PIONEER_PDF.border, "draw");
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x, y, boxW, boxH, 6, 6, "FD");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    setRgb(pdf, PIONEER_PDF.muted);
    pdf.text(clip(labels[idx], 12), x + 10, y + 16);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    setRgb(pdf, PIONEER_PDF.navy);
    pdf.text(formatPdfMoney(values[idx]), x + 10, y + 36);
  });

  return y + boxH + 8;
}

function drawInsightNotes(pdf, y, summaryCards, metricRows, maxBottom) {
  const W = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const h = Math.min(52, maxBottom - y);
  if (h < 36) return y;

  const invested = metricRows.find((r) => /invest/i.test(String(r[0])));
  const growth = metricRows.find((r) => /growth/i.test(String(r[0])));
  const future = metricRows[metricRows.length - 1];
  const invN = parseMoneyToNumber(invested?.[1]);
  const grN = parseMoneyToNumber(growth?.[1]);
  const mult = invN > 0 ? (parseMoneyToNumber(future?.[1]) / invN).toFixed(2) : "—";
  const growthPct = invN > 0 ? ((grN / invN) * 100).toFixed(1) : "—";

  setRgb(pdf, [239, 246, 255], "fill");
  setRgb(pdf, [147, 197, 253], "draw");
  pdf.setLineWidth(0.7);
  pdf.roundedRect(margin, y, W - margin * 2, h, 7, 7, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  setRgb(pdf, PIONEER_PDF.navy);
  pdf.text("Advisory notes", margin + 12, y + 16);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  setRgb(pdf, PIONEER_PDF.text);
  const line1 = `Estimated wealth multiple ≈ ${mult}x  ·  Growth over invested ≈ ${growthPct}%`;
  const inputs = (summaryCards || [])
    .slice(0, 3)
    .map((c) => `${c[0]}: ${String(c[1]).replace(/₹/g, "Rs.")}`)
    .join("  ·  ");
  pdf.text(clip(line1, 95), margin + 12, y + 30);
  if (h > 42 && inputs) {
    setRgb(pdf, PIONEER_PDF.muted);
    pdf.text(clip(`Assumptions — ${inputs}`, 100), margin + 12, y + 44);
  }

  return y + h + 6;
}

export function drawPdfFooter(pdf) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= pdf.internal.getNumberOfPages(); i++) {
    pdf.setPage(i);
    setRgb(pdf, PIONEER_PDF.navy, "fill");
    pdf.rect(0, H - 32, W, 32, "F");
    setRgb(pdf, PIONEER_PDF.amber, "fill");
    pdf.rect(0, H - 32, W, 2, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(226, 232, 240);
    pdf.text(
      `${PIONEER_PDF.brand}  ·  ${PIONEER_PDF.email}  ·  ${PIONEER_PDF.phone}  ·  ${PIONEER_PDF.website}`,
      W / 2,
      H - 18,
      { align: "center" }
    );
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text("Single-page advisory report  ·  Illustrative estimate only — not investment advice", W / 2, H - 8, {
      align: "center",
    });
  }
}

/** Keep only finite numbers for jsPDF vector charts (strings → NaN crash). */
export function sanitizePdfSeries(labels = [], values = []) {
  const safeLabels = [];
  const safeValues = [];
  const len = Math.max(labels?.length || 0, values?.length || 0);
  for (let i = 0; i < len; i++) {
    const n = Number(values?.[i]);
    if (!Number.isFinite(n)) continue;
    safeValues.push(n);
    safeLabels.push(String(labels?.[i] ?? `Y${safeValues.length}`));
  }
  return { labels: safeLabels, values: safeValues };
}

export function drawLineChartPdf(pdf, x, y, w, h, labels, values) {
  const series = sanitizePdfSeries(labels, values);
  if (!series.values.length) return y;

  const min = Math.min(...series.values, 0);
  const max = Math.max(...series.values, 1);
  const span = max - min || 1;
  if (!Number.isFinite(span) || span === 0) return y;

  const chartW = Number(w);
  const chartH = Number(h);
  const originX = Number(x);
  const originY = Number(y);
  if (![chartW, chartH, originX, originY].every(Number.isFinite)) return y;

  setRgb(pdf, PIONEER_PDF.border, "draw");
  setRgb(pdf, PIONEER_PDF.soft, "fill");
  pdf.roundedRect(originX, originY, chartW, chartH, 8, 8, "FD");

  const pad = 28;
  const innerW = chartW - pad * 2;
  const innerH = chartH - pad * 2 - 8;
  const baseY = originY + chartH - pad;

  const pts = series.values.map((v, i) => {
    const t = series.values.length === 1 ? 0.5 : i / (series.values.length - 1);
    const px = originX + pad + t * innerW;
    const py = baseY - ((v - min) / span) * innerH;
    return [px, py];
  }).filter(([px, py]) => Number.isFinite(px) && Number.isFinite(py));

  if (pts.length < 1) return originY + chartH + 6;

  setRgb(pdf, PIONEER_PDF.accent, "draw");
  pdf.setLineWidth(2);
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    if ([x1, y1, x2, y2].every(Number.isFinite)) {
      pdf.line(x1, y1, x2, y2);
    }
  }

  setRgb(pdf, PIONEER_PDF.navy, "fill");
  for (const [px, py] of pts) {
    if (Number.isFinite(px) && Number.isFinite(py)) pdf.circle(px, py, 2.4, "F");
  }

  pdf.setFontSize(7.5);
  setRgb(pdf, PIONEER_PDF.muted);
  const step = Math.max(1, Math.ceil(series.labels.length / 6));
  for (let i = 0; i < series.labels.length; i += step) {
    const t = series.values.length === 1 ? 0.5 : i / (series.values.length - 1);
    const px = originX + pad + t * innerW;
    if (Number.isFinite(px)) {
      pdf.text(String(series.labels[i] ?? ""), px, originY + chartH - 10, { align: "center" });
    }
  }

  return originY + chartH + 6;
}

export function drawKeyValueRows(pdf, startY, rows, marginX = 20) {
  const W = pdf.internal.pageSize.getWidth();
  let y = startY;
  pdf.setFontSize(9);
  for (const [k, v] of rows) {
    setRgb(pdf, PIONEER_PDF.muted);
    pdf.text(clip(k, 36), marginX, y);
    setRgb(pdf, PIONEER_PDF.text);
    pdf.text(clip(String(v).replace(/₹/g, "Rs."), 32), W - marginX, y, { align: "right" });
    y += 14;
  }
  return y;
}

/**
 * ONE-PAGE filled advisory report.
 * Charts expand into remaining vertical space so the page does not look empty.
 */
export async function createPremiumCalculatorPdf(opts) {
  const {
    reportTitle,
    formData = {},
    summaryCards = [],
    metricRows = [],
    pieImage = null,
    barImage = null,
    lineLabels = [],
    lineValues = [],
    fileName,
    /** When true, return ArrayBuffer instead of triggering browser download (tests). */
    returnBuffer = false,
  } = opts;

  const pdf = new jsPDF("p", "pt", "a4");
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = W - margin * 2;
  const footerReserve = 40;
  const maxY = H - footerReserve;

  // Soft page wash (reduces stark white feel)
  setRgb(pdf, [248, 250, 252], "fill");
  pdf.rect(0, 0, W, H, "F");

  let y = await drawBrandedPdfHeader(pdf, { reportTitle });
  y = drawClientDetailsCard(pdf, y, formData);

  if (summaryCards.length) {
    y = drawSummaryCards(pdf, y, summaryCards, { cols: Math.min(3, summaryCards.length) });
  }

  if (metricRows.length) {
    y = drawHeroResult(pdf, y, metricRows);
  }

  const series = sanitizePdfSeries(lineLabels, lineValues);
  const hasPie = Boolean(pieImage);
  const hasBar = Boolean(barImage);
  const hasLine = !hasBar && !hasPie && series.values.length > 0;
  const hasCharts = hasPie || hasBar || hasLine;
  const hasSnapshot = series.values.length > 1;

  // Reserve bottom bands for notes + year snapshot so charts don't collide
  const notesH = 52;
  const snapH = hasSnapshot ? 64 : 0;
  const chartCeiling = maxY - notesH - snapH - 8;

  if (hasCharts) {
    y = drawSectionTitle(pdf, y, "Visual summary");
  }

  // EXPAND charts to use almost all remaining height (fixes empty bottom)
  const chartAvail = Math.max(160, chartCeiling - y);
  const chartH = chartAvail;

  if (hasPie && hasBar) {
    const gap = 12;
    const pieColW = Math.min(200, contentW * 0.36);
    const barW = contentW - pieColW - gap;

    setRgb(pdf, PIONEER_PDF.white, "fill");
    setRgb(pdf, PIONEER_PDF.border, "draw");
    pdf.setLineWidth(0.6);
    pdf.roundedRect(margin, y, contentW, chartH, 10, 10, "FD");

    const pad = 12;
    const fmtPie = pieImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    const fmtBar = barImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    const imgH = chartH - pad * 2;
    // Keep pie square (no stretch) and vertically centered in its column
    const pieSide = Math.min(pieColW - pad, imgH);
    const pieX = margin + pad + (pieColW - pad - pieSide) / 2;
    const pieY = y + pad + (imgH - pieSide) / 2;
    pdf.addImage(pieImage, fmtPie, pieX, pieY, pieSide, pieSide);
    pdf.addImage(barImage, fmtBar, margin + pieColW + gap, y + pad, barW - pad, imgH);
    y += chartH + 10;
  } else if (hasBar) {
    setRgb(pdf, PIONEER_PDF.white, "fill");
    setRgb(pdf, PIONEER_PDF.border, "draw");
    pdf.roundedRect(margin, y, contentW, chartH, 10, 10, "FD");
    const fmt = barImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    pdf.addImage(barImage, fmt, margin + 8, y + 8, contentW - 16, chartH - 16);
    y += chartH + 10;
  } else if (hasPie) {
    setRgb(pdf, PIONEER_PDF.white, "fill");
    setRgb(pdf, PIONEER_PDF.border, "draw");
    pdf.roundedRect(margin, y, contentW, chartH, 10, 10, "FD");
    const fmt = pieImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    const side = Math.min(chartH - 20, 220);
    pdf.addImage(pieImage, fmt, margin + (contentW - side) / 2, y + 10, side, side);
    y += chartH + 10;
  } else if (hasLine) {
    y = drawLineChartPdf(pdf, margin, y, contentW, Math.min(chartH, 220), series.labels, series.values);
  }

  if (hasSnapshot) {
    y = drawSectionTitle(pdf, Math.min(y, maxY - snapH - notesH - 20), "Portfolio checkpoints");
    y = drawYearSnapshot(pdf, y, series.labels, series.values, maxY - notesH);
  }

  // Push notes to sit just above footer (fills residual gap)
  const notesY = Math.max(y, maxY - notesH);
  drawInsightNotes(pdf, notesY, summaryCards, metricRows, maxY);

  while (pdf.internal.getNumberOfPages() > 1) {
    pdf.deletePage(pdf.internal.getNumberOfPages());
  }

  drawPdfFooter(pdf);

  const safeName = String(formData.name || "client").replace(/\s+/g, "-");
  const safeType = String(formData.calculatorType || "report").replace(/\s+/g, "-");
  if (returnBuffer) {
    return pdf.output("arraybuffer");
  }
  pdf.save(fileName || `${safeName}-${safeType}.pdf`);
  return true;
}

export function canvasToPdfJpeg(canvas, maxW = 900) {
  if (!canvas) return null;
  const w = canvas.width || 1;
  const h = canvas.height || 1;
  const scale = Math.min(1, maxW / w);
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(w * scale));
  out.height = Math.max(1, Math.round(h * scale));
  const ctx = out.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/jpeg", 0.82);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.82);
}

export function getChartCanvas(ref) {
  const inst = ref?.current;
  if (!inst) return null;
  return inst.canvas || inst.ctx?.canvas || inst.chart?.canvas || null;
}
