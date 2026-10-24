import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Financial Planning Tools | SIP Estimator by PioneerWS",
  description:
    "Use Pioneer Wealth Solutions’ financial planning tools to estimate SIP growth, plan goals, and build a disciplined investment roadmap.",
  path: "/financial-planning",
  keywords: ["financial planning India", "PioneerWS planning tools"],
});

export default function FinancialPlanningLayout({ children }) {
  return children;
}
