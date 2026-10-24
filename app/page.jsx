import Hero from "@/components/layout/Hero";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata, SITE_URL, organizationJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Pioneer Wealth Solutions | Financial Advisor & Wealth Management India",
  description:
    "Pioneer Wealth Solutions (PioneerWS) offers goal-based financial planning, mutual fund & SIP advisory, insurance structuring, retirement planning, and free calculators for Indian families.",
  path: "/",
  keywords: [
    "Pioneer Wealth Solutions Mumbai",
    "best financial advisor India",
    "PioneerWS wealth management",
    "SIP calculator Pioneer",
  ],
});

const homeFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Pioneer Wealth Solutions offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pioneer Wealth Solutions provides goal-based wealth advisory including mutual fund guidance, SIP planning, insurance planning, retirement strategies, and free online financial calculators.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I use Pioneer SIP and goal calculators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Use free tools at ${SITE_URL}/Calculators/sip-return and goal planners at ${SITE_URL}/Goal_Planners/Dream-home.`,
      },
    },
    {
      "@type": "Question",
      name: "How do I contact Pioneer Wealth Solutions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email info@pioneerws.in or call +91 98765 43210. Visit the Contact page on pioneerws.in to book a consultation.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <JsonLd id="home-faq-schema" data={homeFaq} />
      <JsonLd id="home-org-ref" data={organizationJsonLd()} />
      <Hero />
    </div>
  );
}
