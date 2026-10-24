import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Investment Products | Mutual Funds & Curated Portfolios",
  description:
    "Browse Pioneer Wealth Solutions investment products and mutual fund options aligned to your risk profile and financial goals.",
  path: "/Product",
  keywords: ["Pioneer mutual funds", "investment products India"],
});

export default function ProductLayout({ children }) {
  return children;
}
