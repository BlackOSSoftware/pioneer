import Hero from "@/components/layout/Hero";

export const metadata = {
  title: "Pioneer Wealth Solutions | Financial Planning and Wealth Advisory",
  description:
    "Pioneer Wealth Solutions offers goal-based financial planning, mutual fund advisory, insurance structuring, and retirement strategies for long-term wealth growth.",
  alternates: {
    canonical: "https://www.pioneerws.in",
  },
  openGraph: {
    title: "Pioneer Wealth Solutions | Financial Planning and Wealth Advisory",
    description:
      "Trusted advisory for investment planning, risk protection, and long-term wealth strategy.",
    url: "https://www.pioneerws.in",
    siteName: "Pioneer Wealth Solutions",
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <h1 className="sr-only">Pioneer Wealth Solutions - Financial Planning and Wealth Advisory</h1>
      <Hero />
    </div>
  );
}
