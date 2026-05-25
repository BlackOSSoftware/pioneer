/**
 * Branded calculator PDF helpers (client-side jsPDF).
 */

export function loadImageAsDataURL(src) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || img.width;
        c.height = img.naturalHeight || img.height;
        const ctx = c.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * @param {import("jspdf").jsPDF} pdf
 * @returns {number} y position after header
 */
export async function drawBrandedPdfHeader(pdf, { reportTitle, reportSubtitle = "" }) {
  const W = pdf.internal.pageSize.getWidth();
  const logo = await loadImageAsDataURL("/newlogo.png");

  pdf.setFillColor(11, 36, 71);
  pdf.rect(0, 0, W, 78, "F");

  const textLeft = logo ? 72 : 28;
  if (logo) {
    try {
      pdf.addImage(logo, "PNG", 22, 18, 40, 40);
    } catch {
      // ignore bad image
    }
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Pioneer Wealth Solutions", textLeft, 30);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(203, 213, 225);
  const tagline = "Goal-based wealth advisory | Mutual funds | Insurance & retirement planning";
  pdf.text(tagline, textLeft, 42, { maxWidth: W - textLeft - 28 });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(255, 255, 255);
  pdf.text(reportTitle, 24, 62);

  if (reportSubtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(226, 232, 240);
    const subLines = pdf.splitTextToSize(reportSubtitle, W - 48);
    pdf.text(subLines, 24, 72);
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(226, 232, 240);
  pdf.text(`Generated: ${new Date().toLocaleString("en-IN")}`, W - 24, 74, { align: "right" });

  return 92;
}

/**
 * Draw a simple line chart (vector) into the PDF.
 * @param {import("jspdf").jsPDF} pdf
 * @param {number[]} values
 * @param {string[]} labels
 */
export function drawLineChartPdf(pdf, x, y, w, h, labels, values) {
  if (!values?.length) return y + h;

  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = max - min || 1;

  pdf.setDrawColor(226, 232, 240);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(x, y, w, h, 4, 4, "FD");

  const pad = 28;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const baseY = y + h - pad;

  const pts = values.map((v, i) => {
    const t = values.length === 1 ? 0.5 : i / (values.length - 1);
    const px = x + pad + t * innerW;
    const py = baseY - ((v - min) / span) * innerH;
    return [px, py];
  });

  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1.25);
  for (let i = 0; i < pts.length - 1; i++) {
    pdf.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  }

  pdf.setFillColor(37, 99, 235);
  for (const [px, py] of pts) {
    pdf.circle(px, py, 2.2, "F");
  }

  pdf.setFontSize(7);
  pdf.setTextColor(71, 85, 105);
  const step = Math.max(1, Math.ceil(labels.length / 6));
  for (let i = 0; i < labels.length; i += step) {
    const t = values.length === 1 ? 0.5 : i / (values.length - 1);
    const px = x + pad + t * innerW;
    const lab = String(labels[i] ?? "");
    pdf.text(lab, px, y + h - 8, { align: "center", maxWidth: 48 });
  }

  pdf.setFontSize(8);
  pdf.setTextColor(15, 23, 42);
  pdf.text("Growth trajectory (₹)", x + pad, y + 14);

  return y + h + 8;
}

/** Safe wrapped label + value rows */
export function drawKeyValueRows(pdf, startY, rows, marginX = 28, maxWidthOffset = 56) {
  const W = pdf.internal.pageSize.getWidth();
  const maxW = W - marginX * 2;
  let y = startY;
  pdf.setFontSize(10);
  for (const [k, v] of rows) {
    const label = String(k);
    const val = String(v);
    pdf.setTextColor(71, 85, 105);
    const labelLines = pdf.splitTextToSize(label, maxW * 0.45);
    pdf.text(labelLines, marginX, y);
    pdf.setTextColor(15, 23, 42);
    const valLines = pdf.splitTextToSize(val, maxW * 0.48);
    pdf.text(valLines, W - marginX, y, { align: "right", maxWidth: maxW * 0.48 });
    y += Math.max(labelLines.length, valLines.length) * 12 + 6;
  }
  return y;
}
