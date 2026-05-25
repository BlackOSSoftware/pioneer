/** Digits only, with country code (e.g. 919876543210). Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local */
export function getWhatsAppDigits() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return String(raw).replace(/\D/g, "");
}

export function buildWhatsAppUrl(text) {
  const digits = getWhatsAppDigits();
  if (!digits) return null;
  const t = String(text ?? "").trim();
  return `https://wa.me/${digits}?text=${encodeURIComponent(t)}`;
}
