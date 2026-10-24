import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Pioneer Wealth Solutions | PioneerWS Advisory Team",
  description:
    "Meet Pioneer Wealth Solutions — PioneerWS advisors helping Indian families with mutual funds, SIPs, insurance, and long-term wealth planning since 2009.",
  path: "/about",
  keywords: ["about Pioneer Wealth Solutions", "PioneerWS team", "Pioneer financial advisors"],
});

export default function AboutLayout({ children }) {
  return children;
}
