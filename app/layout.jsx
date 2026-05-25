import "./globals.css";
import Script from "next/script";
import ClientRootLayout from "./ClientRootLayout";
import FloatingButtons from "@/components/FloatingButtons";
import { ModalProvider } from "@/components/ui/ModalProvider";

export const metadata = {
  metadataBase: new URL("https://www.pioneerws.in"),
  title: {
    default: "Pioneer Wealth Solutions | Financial Planning and Wealth Advisory",
    template: "%s | Pioneer Wealth Solutions",
  },
  description:
    "Pioneer Wealth Solutions delivers professional financial planning, investment advisory, insurance strategy, and retirement planning for individuals and families.",
  applicationName: "Pioneer Wealth Solutions",
  authors: [{ name: "Pioneer Wealth Solutions", url: "https://www.pioneerws.in" }],
  creator: "Pioneer Wealth Solutions",
  publisher: "Pioneer Wealth Solutions",
  keywords: [
    "financial advisor india",
    "wealth management",
    "mutual fund advisory",
    "retirement planning",
    "insurance planning",
    "tax planning",
    "goal based investing",
    "sip planning",
  ],
  alternates: {
    canonical: "https://www.pioneerws.in",
  },
  openGraph: {
    title: "Pioneer Wealth Solutions | Financial Planning and Wealth Advisory",
    description:
      "Goal-based investment and financial planning solutions for long-term wealth and family protection.",
    url: "https://www.pioneerws.in",
    siteName: "Pioneer Wealth Solutions",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pioneer Wealth Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pioneer Wealth Solutions",
    description: "Professional financial planning and wealth advisory solutions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "financial-services",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": "https://www.pioneerws.in/#organization",
  name: "Pioneer Wealth Solutions",
  url: "https://www.pioneerws.in",
  logo: "https://www.pioneerws.in/newlogo.png",
  description:
    "Professional financial advisory services including mutual funds, insurance planning, retirement planning, and goal-based investment strategies.",
  areaServed: "IN",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9876543210",
    contactType: "customer support",
    email: "info@pioneerws.in",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body className="min-h-screen bg-slate-50 antialiased">
        <ModalProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
          <FloatingButtons />
        </ModalProvider>
      </body>
    </html>
  );
}
