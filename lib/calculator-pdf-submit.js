import { showAppModal } from "@/lib/pioneer-modal-bus";

/**
 * Validate lead form, generate PDF first, then save lead in background.
 * PDF download must never depend on MongoDB /api/sip-form succeeding.
 *
 * @param {{
 *   formData: { name?: string, email?: string, mobile?: string, goal?: string, calculatorType?: string },
 *   downloadPDF: () => void | Promise<void>,
 *   onDone?: () => void,
 * }} opts
 */
export async function submitCalculatorLeadAndDownloadPdf({ formData, downloadPDF, onDone }) {
  const name = String(formData?.name ?? "").trim();
  const email = String(formData?.email ?? "").trim();
  const mobile = String(formData?.mobile ?? "").trim();
  const goal = String(formData?.goal ?? "").trim();
  const calculatorType = String(formData?.calculatorType ?? "Calculator").trim();

  if (!name || !email || !mobile || !goal) {
    showAppModal("Please fill all details before downloading the PDF.", {
      title: "Missing information",
      variant: "info",
    });
    return false;
  }

  try {
    const result = await Promise.resolve(downloadPDF());
    // downloadPDF may return false after showing its own "charts not ready" message
    if (result === false) return false;
  } catch (err) {
    console.error("PDF download failed:", err);
    showAppModal(
      err?.message === "Charts not ready"
        ? "Charts are still rendering. Please wait a moment and try again."
        : "Could not generate the PDF. Please try again.",
      { variant: "error", title: "Download failed" }
    );
    return false;
  }

  onDone?.();
  showAppModal("Your PDF has been downloaded successfully.", {
    variant: "success",
    title: "Download complete",
  });

  // Fire-and-forget — never block PDF on DB
  fetch("/api/sip-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, mobile, goal, calculatorType }),
  }).catch((err) => {
    console.warn("Lead save failed (PDF already downloaded):", err);
  });

  return true;
}
