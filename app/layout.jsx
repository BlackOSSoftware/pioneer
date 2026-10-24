import "./globals.css";
import Script from "next/script";
import ClientRootLayout from "./ClientRootLayout";
import FloatingButtons from "@/components/FloatingButtons";
import { ModalProvider } from "@/components/ui/ModalProvider";
import {
  SITE_URL,
  SITE_NAME,
  BRAND_KEYWORDS,
  organizationJsonLd,
  websiteJsonLd,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Financial Advisor & Wealth Management India`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Pioneer Wealth Solutions (PioneerWS) — trusted financial advisor in India for mutual funds, SIP planning, insurance, retirement, and goal-based wealth management.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: BRAND_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | Financial Advisor & Wealth Management India`,
    description:
      "Goal-based investing, SIP calculators, insurance planning, and retirement strategies from Pioneer Wealth Solutions.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Pioneer Wealth Solutions — Financial Planning India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | PioneerWS Financial Advisory`,
    description: "Professional wealth advisory, SIP tools, and goal planners from Pioneer Wealth Solutions.",
    images: [DEFAULT_OG_IMAGE],
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
  verification: {
    // Add Search Console code in env later: google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
};

export default function RootLayout({ children }) {
  const org = organizationJsonLd();
  const site = websiteJsonLd();

  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="canonical" href={SITE_URL} />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
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
