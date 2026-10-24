import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact Pioneer Wealth Solutions | Book a Consultation",
  description:
    "Contact Pioneer Wealth Solutions (PioneerWS) in Mumbai — call +91 98765 43210 or email info@pioneerws.in to book a financial planning consultation.",
  path: "/contact",
  keywords: ["contact Pioneer Wealth Solutions", "PioneerWS Mumbai", "book financial advisor"],
});

export default function ContactLayout({ children }) {
  return children;
}
