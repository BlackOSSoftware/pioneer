/**
 * Pioneer Wealth Solutions — SEO helpers (Next.js App Router metadata).
 * Focused brand + intent keywords beat stuffing thousands of terms.
 */

export const SITE_URL = "https://www.pioneerws.in";
export const SITE_NAME = "Pioneer Wealth Solutions";
export const SITE_NAME_SHORT = "PioneerWS";
export const DEFAULT_OG_IMAGE = "/newlogo.png";

/** High-value brand + service keywords (quality > quantity) */
export const BRAND_KEYWORDS = [
  "Pioneer Wealth Solutions",
  "PioneerWS",
  "Pioneer Wealth",
  "Pioneer financial advisor",
  "Pioneer wealth management India",
  "Pioneer mutual fund advisor",
  "Pioneer SIP calculator",
  "financial advisor India",
  "wealth management India",
  "mutual fund advisory",
  "goal based investing",
  "retirement planning India",
  "SIP planning",
  "insurance planning India",
];

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   path?: string,
 *   keywords?: string[],
 *   image?: string,
 *   noIndex?: boolean,
 *   type?: string,
 * }} opts
 */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = "website",
}) {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes(SITE_NAME) ? title : title;

  return {
    title: fullTitle,
    description,
    keywords: [...new Set([...BRAND_KEYWORDS, ...keywords])],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/** BreadcrumbList JSON-LD */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [SITE_NAME_SHORT, "Pioneer Wealth", "Pioneer Wealth Solutions India"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/newlogo.png`,
    },
    image: `${SITE_URL}/newlogo.png`,
    description:
      "Pioneer Wealth Solutions is a goal-based financial advisory firm in India offering mutual fund guidance, SIP and retirement planning, insurance structuring, and wealth management for families.",
    foundingDate: "2009",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Financial District, Bandra West",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400050",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-98765-43210",
        contactType: "customer support",
        email: "info@pioneerws.in",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [],
    knowsAbout: [
      "Mutual Funds",
      "SIP Planning",
      "Retirement Planning",
      "Life Insurance",
      "Health Insurance",
      "Wealth Management",
      "Goal Based Investing",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_SHORT,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/Calculators/sip-return`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** FAQ / HowTo style WebApplication for calculators */
export function calculatorAppJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export const CALCULATOR_SEO = {
  "sip-return": {
    title: "SIP Return Calculator Online — Free SIP Maturity Estimator",
    description:
      "Use Pioneer Wealth Solutions’ free SIP Return Calculator to estimate mutual fund SIP maturity, total investment, and wealth gain. Plan SIPs with PioneerWS.",
    keywords: ["SIP return calculator", "SIP calculator India", "mutual fund SIP calculator", "Pioneer SIP calculator"],
    h1: "SIP Return Calculator",
  },
  crorepati: {
    title: "Become a Crorepati Calculator — SIP for ₹1 Crore Goal",
    description:
      "Calculate the monthly SIP needed to become a crorepati with Pioneer Wealth Solutions. Inflation-aware crorepati planner by PioneerWS.",
    keywords: ["crorepati calculator", "how to become crorepati SIP", "1 crore SIP calculator"],
    h1: "Become a Crorepati Calculator",
  },
  "sip-step-up": {
    title: "SIP Step-Up Calculator — Annual Increase SIP Planner",
    description:
      "Estimate returns with a step-up SIP. Pioneer Wealth Solutions’ SIP Step-Up Calculator shows growth when you raise SIP every year.",
    keywords: ["SIP step up calculator", "increasing SIP calculator"],
    h1: "SIP Step-Up Calculator",
  },
  emi: {
    title: "EMI Calculator — Home Loan EMI & Interest Breakdown",
    description:
      "Free EMI Calculator by Pioneer Wealth Solutions. Compute home loan EMI, interest, and total payment with clear charts.",
    keywords: ["EMI calculator", "home loan EMI calculator India"],
    h1: "EMI Calculator",
  },
  "target-sip": {
    title: "Target Amount SIP Calculator — Required Monthly SIP",
    description:
      "Find the monthly SIP needed for your target corpus with Pioneer Wealth Solutions’ Target SIP Calculator.",
    keywords: ["target SIP calculator", "required SIP calculator"],
    h1: "Target Amount SIP Calculator",
  },
  "sip-annual": {
    title: "SIP with Annual Increase Calculator",
    description:
      "Project corpus with yearly SIP increases. Free tool from Pioneer Wealth Solutions for goal-based investing.",
    keywords: ["SIP annual increase calculator"],
    h1: "SIP with Annual Increase Calculator",
  },
  retirement: {
    title: "Retirement Planning Calculator — Corpus & SIP Needed",
    description:
      "Plan retirement corpus and required SIP with Pioneer Wealth Solutions’ Retirement Planning Calculator.",
    keywords: ["retirement calculator India", "retirement corpus calculator"],
    h1: "Retirement Planning Calculator",
  },
  "goal-setting": {
    title: "Goal Setting Calculator — Monthly SIP for Any Goal",
    description:
      "Set a financial goal and calculate the SIP required. Goal Setting Calculator by Pioneer Wealth Solutions.",
    keywords: ["goal setting calculator", "financial goal SIP"],
    h1: "Goal Setting Calculator",
  },
  "financial-goal": {
    title: "Composite Financial Goal Calculator — Multiple Goals SIP",
    description:
      "Combine multiple goals into one SIP plan. Composite Financial Goal Calculator from PioneerWS.",
    keywords: ["financial goal calculator", "multi goal SIP"],
    h1: "Composite Financial Goal Calculator",
  },
  education: {
    title: "Children Education Planner Calculator — Education SIP",
    description:
      "Estimate future education cost and SIP with Pioneer Wealth Solutions’ Children Education Planner.",
    keywords: ["child education calculator", "education SIP planner"],
    h1: "Children Education Planner",
  },
  compounding: {
    title: "Compounding Calculator — Power of Compound Interest",
    description:
      "See how compounding grows wealth over time. Free Compounding Calculator by Pioneer Wealth Solutions.",
    keywords: ["compounding calculator", "compound interest calculator India"],
    h1: "Compounding Calculator",
  },
  "future-value": {
    title: "Future Value Calculator — Investment Growth Estimator",
    description:
      "Calculate future value of lump sum and monthly contributions with Pioneer Wealth Solutions.",
    keywords: ["future value calculator", "FV calculator investment"],
    h1: "Future Value Calculator",
  },
  "lumpsum-target": {
    title: "Lumpsum Target Calculator — Amount Needed Today",
    description:
      "Find how much to invest as lumpsum today to reach a future target. Pioneer Wealth Solutions tool.",
    keywords: ["lumpsum target calculator", "PV calculator"],
    h1: "Lumpsum Target Calculator",
  },
  lumpsum: {
    title: "Lumpsum Calculator — Mutual Fund Lumpsum Returns",
    description:
      "Estimate mutual fund lumpsum returns online. Free Lumpsum Calculator by Pioneer Wealth Solutions.",
    keywords: ["lumpsum calculator", "mutual fund lumpsum returns"],
    h1: "Lumpsum Calculator",
  },
};

export const PLANNER_SEO = {
  "Dream-home": {
    title: "Dream Home Goal Planner — SIP for Your House Goal",
    description:
      "Plan your dream home with inflation-adjusted corpus and SIP. Dream Home Goal Planner by Pioneer Wealth Solutions.",
    keywords: ["dream home planner", "home buying SIP plan"],
  },
  "Wealth-Creation": {
    title: "Wealth Creation Goal Planner — Long-Term Corpus SIP",
    description:
      "Build long-term wealth with Pioneer Wealth Solutions’ Wealth Creation Goal Planner and SIP roadmap.",
    keywords: ["wealth creation planner", "wealth SIP planner"],
  },
  Retiremen: {
    title: "Retirement Goal Planner — Corpus, Gap & Monthly SIP",
    description:
      "Estimate retirement corpus, savings gap, and required SIP with Pioneer Wealth Solutions’ Retirement Goal Planner.",
    keywords: ["retirement goal planner", "retirement SIP India"],
  },
  "Child-Education": {
    title: "Child Education Goal Planner — Education Corpus SIP",
    description:
      "Plan your child’s higher education cost and SIP with Pioneer Wealth Solutions’ Child Education Goal Planner.",
    keywords: ["child education goal planner", "education corpus SIP"],
  },
  "Child-Wedding": {
    title: "Child Wedding Goal Planner — Wedding Corpus SIP",
    description:
      "Estimate wedding corpus and monthly SIP with Pioneer Wealth Solutions’ Child Wedding Goal Planner.",
    keywords: ["child wedding planner", "wedding SIP calculator"],
  },
  Emergency: {
    title: "Emergency Fund Goal Planner — 6-Month Buffer SIP",
    description:
      "Build a 6-month emergency fund with a clear SIP plan. Emergency Goal Planner by Pioneer Wealth Solutions.",
    keywords: ["emergency fund planner", "emergency corpus SIP"],
  },
};

/** All public indexable paths for sitemap */
export function getPublicSitemapPaths() {
  const staticPaths = [
    "/",
    "/about",
    "/Services",
    "/Product",
    "/Insurance",
    "/financial-planning",
    "/contact",
    "/wealth",
  ];

  const calcPaths = Object.keys(CALCULATOR_SEO).map((slug) => `/Calculators/${slug}`);
  const plannerPaths = Object.keys(PLANNER_SEO).map((slug) => `/Goal_Planners/${slug}`);

  return [...staticPaths, ...calcPaths, ...plannerPaths];
}
