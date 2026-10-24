"use client";

import { useState } from "react";
import CalculatorDownloadForm from "@/components/calculators/CalculatorDownloadForm";
import { GoalDownloadButton } from "@/components/goal-planners/GoalPlannerShell";
import { submitCalculatorLeadAndDownloadPdf } from "@/lib/calculator-pdf-submit";
import { createPremiumCalculatorPdf, formatPdfMoney } from "@/lib/pdf-branded";

/**
 * Shared lead form + single-page branded PDF for goal planners.
 */
export default function GoalPdfDownload({
  calculatorType,
  reportTitle,
  summaryCards = [],
  metricRows = [],
  lineLabels = [],
  lineValues = [],
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: calculatorType || "Goal Planner",
  });

  const downloadPDF = async () => {
    // Only pass finite numbers into the PDF line chart (strings like "Moderate" crash jsPDF.line)
    const safeLabels = [];
    const safeValues = [];
    const len = Math.max(lineLabels?.length || 0, lineValues?.length || 0);
    for (let i = 0; i < len; i++) {
      const n = Number(lineValues?.[i]);
      if (!Number.isFinite(n)) continue;
      safeValues.push(n);
      safeLabels.push(String(lineLabels?.[i] ?? `Point ${safeValues.length}`));
    }

    await createPremiumCalculatorPdf({
      reportTitle: reportTitle || calculatorType || "Goal Plan Report",
      formData: { ...formData, calculatorType: calculatorType || formData.calculatorType },
      summaryCards: summaryCards.map(([k, v]) => [
        k,
        typeof v === "number" ? formatPdfMoney(v) : String(v).replace(/₹/g, "Rs."),
      ]),
      metricRows: metricRows.map(([k, v]) => [
        k,
        typeof v === "number" ? formatPdfMoney(v) : String(v).replace(/₹/g, "Rs."),
      ]),
      lineLabels: safeLabels,
      lineValues: safeValues,
    });
    return true;
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      await submitCalculatorLeadAndDownloadPdf({
        formData: { ...formData, calculatorType: calculatorType || formData.calculatorType },
        downloadPDF,
        onDone: () => setOpen(false),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <GoalDownloadButton busy={busy} onClick={() => setOpen(true)} />
      <CalculatorDownloadForm
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        busy={busy}
        title="Download your goal plan"
        subtitle="Enter your details to receive a branded one-page PDF advisory report."
      />
    </>
  );
}
