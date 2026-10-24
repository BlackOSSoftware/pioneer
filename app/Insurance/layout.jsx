import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Insurance Planning | Life & Health Cover Guidance",
  description:
    "Life and health insurance planning with Pioneer Wealth Solutions — structure the right cover for family protection and liabilities.",
  path: "/Insurance",
  keywords: ["Pioneer insurance planning", "life insurance advisor India"],
});

export default function InsuranceLayout({ children }) {
  return children;
}
