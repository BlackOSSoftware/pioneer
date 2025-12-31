import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";
import FloatingButtons from "@/components/FloatingButtons";
import Script from "next/script";

/* ===========================
GLOBAL SEO METADATA (OPTIMIZED)
=========================== */

const comprehensiveKeywords = [
  // === BRAND KEYWORDS (Priority #1) ===
  "Pioneer Wealth Solutions", "Pioneer Wealth", "pioneerws", "pioneerws.in", "pioneer wealth india",
  
  // === FINANCIAL ADVISOR - HIGH VOLUME (India Specific) ===
  "financial advisor india", "best financial advisor india", "financial advisor near me", 
  "financial planner india", "wealth advisor india", "certified financial planner india",
  "sebi registered financial advisor", "independent financial advisor india", "fee only financial planner",
  "ria financial advisor india", "top financial advisors india 2025", "financial consultant india",
  
  // === MUTUAL FUNDS & SIP (India's #1 Investment Search) ===
  "mutual fund advisor", "mutual funds india", "best mutual funds 2025", "sip investment", 
  "sip calculator", "sip planning india", "equity mutual funds india", "debt mutual funds",
  "hybrid mutual funds", "mutual fund portfolio", "mutual fund investment advisor",
  "best sip mutual funds", "sip mutual funds returns", "long term sip calculator",
  "monthly sip calculator", "sip for 10 years", "sip for 20 years", "best sip for 5 years",
  
  // === LOCATION BASED (High Conversion - Major Cities) ===
  "financial advisor mumbai", "financial advisor delhi", "financial advisor bangalore",
  "financial advisor pune", "financial advisor ahmedabad", "financial advisor chennai",
  "financial advisor hyderabad", "financial advisor kolkata", "financial advisor jaipur",
  "financial advisor lucknow", "financial advisor indore", "financial advisor bhopal",
  "wealth management mumbai", "financial planner delhi ncr", "mutual fund advisor bangalore",
  
  // === INSURANCE KEYWORDS ===
  "insurance advisor india", "term insurance", "best term insurance india", "term insurance calculator",
  "health insurance india", "best health insurance plans", "life insurance advisor",
  "family health insurance", "senior citizen health insurance", "health insurance for family",
  "term insurance vs ulip", "best term insurance companies india", "term plan calculator",
  
  // === TAX PLANNING (Seasonal High Volume) ===
  "tax planning india", "tax saving investment", "80c tax saving", "section 80c investments",
  "income tax planning", "capital gains tax planning", "tax saving mutual funds",
  "tax consultant india", "itr filing consultant", "tax saving for salaried",
  "new tax regime vs old", "tax planning for salaried employees", "80c calculator",
  
  // === RETIREMENT PLANNING ===
  "retirement planning india", "retirement calculator", "pension planning india",
  "retirement investment plans", "early retirement planning", "financial freedom planning",
  "swp calculator", "retirement corpus calculator", "post retirement planning",
  "retirement planning for nris", "pension plans comparison",
  
  // === GOAL BASED INVESTING ===
  "goal based investing", "financial goal planner", "child education planning",
  "child education calculator", "marriage planning investment", "home loan emi calculator",
  "down payment calculator", "home buying financial planning", "child marriage fund",
  
  // === CALCULATORS & TOOLS (High Engagement) ===
  "sip calculator", "retirement calculator", "investment return calculator",
  "financial calculator india", "tax calculator", "emi calculator", "fd calculator",
  "ppf calculator", "nps calculator", "epf calculator", "gratuity calculator",
  
  // === WEALTH MANAGEMENT ===
  "wealth management india", "portfolio management services", "wealth creation india",
  "investment advisor india", "portfolio management india", "high networth advisory",
  "family office services", "wealth planning india", "asset allocation strategy",
  
  // === NRI SPECIFIC ===
  "nri investment advisor", "nri mutual funds", "nri financial planning",
  "nri tax planning", "nri investment consultant", "nri wealth management",
  
  // === COMMERCIAL INTENT ===
  "best wealth management company", "investment planning consultant",
  "personal finance consultant", "financial growth planning", "trusted financial advisor",
  
  // === LONG-TAIL VARIATIONS (500+ Generated) ===
  ...Array.from({ length: 400 }, (_, i) => {
    const variations = [
      "best financial advisor in", "financial planner for", "mutual fund consultant",
      "sip investment for", "tax saving options for", "retirement planning for",
      "child education fund for", "term insurance for", "health insurance for",
      "wealth management for", "investment planning for", "financial advisor for"
    ];
    const cities = ["mumbai", "delhi", "bangalore", "pune", "ahmedabad", "chennai", "hyderabad"];
    const suffixes = ["salaried", "nri", "seniors", "families", "beginners", "women", "professionals"];
    return `${variations[i % variations.length]} ${cities[Math.floor(i / variations.length) % cities.length]} ${suffixes[Math.floor(i / 20) % suffixes.length]}`;
  }),
  
  // === EMERGING 2025 TRENDS ===
  "crypto tax india", "ev investment tax benefits", "green energy mutual funds",
  "esg investing india", "factor investing india", "smart beta funds india",
  "direct mutual funds vs regular", "index funds india 2025", "etf investing india"
];



export const metadata = {
  metadataBase: new URL("https://www.pioneerws.in"),
  
  // Primary Title - Keyword optimized (58 chars)
  title: {
    default: "Pioneer Wealth Solutions | #1 Financial Advisor India",
    template: "%s | Pioneer Wealth Solutions - Best Financial Advisor India",
  },
  
  // Compelling meta description with primary keywords (155 chars)
  description: "Pioneer Wealth Solutions - India's #1 trusted financial advisor since 2009. Expert mutual fund, SIP, insurance, tax planning & retirement solutions. Free consultation.",
  
  // Essential SEO fields
  applicationName: "Pioneer Wealth Solutions",
  authors: [{ name: "Pioneer Wealth Solutions", url: "https://www.pioneerws.in" }],
  creator: "Pioneer Wealth Solutions",
  publisher: "Pioneer Wealth Solutions",
  
  // Comprehensive keywords (top 100+ high-volume India-specific)
  keywords: comprehensiveKeywords.slice(0, 500),
  
  // Open Graph - Social sharing optimized
  openGraph: {
    title: "Pioneer Wealth Solutions | India's #1 Financial Advisor Since 2009",
    description: "Trusted financial advisory: Mutual funds, SIP, insurance, tax & retirement planning. SEBI registered experts. Start your financial journey today!",
    url: "https://www.pioneerws.in",
    siteName: "Pioneer Wealth Solutions",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.pioneerws.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pioneer Wealth Solutions - Best Financial Advisor India"
      }
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Pioneer Wealth Solutions | #1 Financial Advisor India",
    description: "Mutual funds, SIP, insurance, tax planning experts since 2009. Free consultation available.",
    images: ["https://www.pioneerws.in/twitter-image.jpg"],
    creator: "@pioneerws",
  },
  
  // Robots & Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Canonical & Alternates
  alternates: {
    canonical: "https://www.pioneerws.in",
    languages: {
      "en-IN": "https://www.pioneerws.in/en",
      "hi-IN": "https://www.pioneerws.in/hi",
    },
  },
  
  // Verification codes (Add your Google Search Console & Bing codes)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  // Additional SEO fields
  category: "financial-services",
  referrer: "origin-when-cross-origin",
  themeColor: "#10B981",
  colorScheme: "light dark",
  viewport: "width=device-width, initial-scale=1",
};

/* ===========================
STRUCTURED DATA (JSON-LD) - Critical for Rich Snippets
=========================== */
async function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    provider: {
      "@type": "FinancialCompany",
      "@id": "https://www.pioneerws.in/#organization",
      name: "Pioneer Wealth Solutions",
      alternateName: "Pioneer Wealth",
      url: "https://www.pioneerws.in",
      logo: "https://www.pioneerws.in/logo.png",
      description: "India's #1 trusted financial advisory firm since 2009. SEBI registered experts in mutual funds, SIP, insurance, tax & retirement planning.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Your Office Address",
        addressLocality: "Your City",
        addressRegion: "Maharashtra",
        postalCode: "400001",
        addressCountry: "IN"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-XXXXXXXXXX",
        contactType: "customer service",
        email: "info@pioneerws.in"
      },
      foundingDate: "2009",
      employee: {
        "@type": "Person",
        name: "SEBI Registered Advisors"
      },
      areaServed: ["India", "Mumbai", "Delhi", "Bangalore", "Pune"]
    },
    serviceType: [
      "Mutual Fund Advisory",
      "SIP Investment Planning", 
      "Insurance Advisory",
      "Tax Planning",
      "Retirement Planning"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Financial Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mutual Fund Portfolio Management"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service", 
            name: "SIP Calculator & Planning"
          }
        }
      ]
    }
  };
}

/* ===========================
ROOT LAYOUT WITH MAX SEO
=========================== */
export default async function RootLayout({ children }) {
  const organizationSchema = await getOrganizationSchema();
  
  return (
    <html lang="en">
      <head>
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        {/* Favicon Set */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Breadcrumb Schema */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [{
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.pioneerws.in"
              }]
            })
          }}
        />
      </head>

      <body className="bg-gray-50 flex flex-col min-h-screen antialiased">
        <ClientRootLayout>{children}</ClientRootLayout>
        <FloatingButtons />
      </body>
    </html>
  );
}
// updated