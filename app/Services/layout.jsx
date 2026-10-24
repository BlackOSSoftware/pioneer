import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Financial Services | Mutual Funds, Insurance & Tax Planning",
  description:
    "Explore Pioneer Wealth Solutions services — mutual fund advisory, insurance planning, tax planning, and goal-based wealth management across India.",
  path: "/Services",
  keywords: ["Pioneer Wealth services", "mutual fund advisory India", "insurance planning"],
});

export default function ServicesLayout({ children }) {
  return children;
}
