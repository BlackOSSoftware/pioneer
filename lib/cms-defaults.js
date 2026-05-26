/** Default CMS payloads when DB is empty — mirrors previous static pages. */

export function getDefaultAbout() {
  return {
    heroTag: "About Pioneer Wealth",
    heroTitle: "Built on trust, discipline, and long-term thinking",
    heroSubtitle:
      "Since 2009, we have helped clients simplify financial decisions through structured planning, risk protection, and goal-driven investing.",
    missionTitle: "Who we are",
    missionParas: [
      "Pioneer Wealth Solutions is a professional advisory team focused on practical financial planning. We combine personalized strategy, portfolio discipline, and regular tracking so clients can move toward their goals with confidence.",
      "From wealth creation and insurance planning to tax-aware investing, our recommendations are built for clarity, consistency, and measurable progress.",
    ],
    missionImage: "/neww.jpg",
    missionVisionHeading: "Our mission and vision",
    ourMissionTitle: "Our Mission",
    ourMissionText:
      "To simplify financial decisions with disciplined planning, transparent advice, and goal-based execution for every client family.",
    ourVisionTitle: "Our Vision",
    ourVisionText:
      "To become a trusted long-term wealth partner known for clarity, consistency, and measurable progress across generations.",
    valuesHeading: "Our core values",
    teamHeading: "Meet the team",
    values: [
      {
        icon: "ShieldCheck",
        title: "Integrity",
        description: "Transparent advice and responsible financial decision-making at every step.",
      },
      {
        icon: "Users",
        title: "Client First",
        description: "Plans are designed around your family goals, risk comfort, and timelines.",
      },
      {
        icon: "Award",
        title: "Excellence",
        description: "Disciplined process, regular reviews, and data-backed recommendations.",
      },
      {
        icon: "Target",
        title: "Long-Term Focus",
        description: "Sustainable wealth strategies built for life milestones, not short-term noise.",
      },
    ],
    team: [
      { image: "/anu.jpg", name: "Rajesh Mehta", role: "Founder and CEO" },
      { image: "/item33.jpg", name: "Anjali Desai", role: "Head of Investments" },
      { image: "/item45.jpg", name: "Vikram Singh", role: "Insurance Specialist" },
      { image: "/item44.jpg", name: "Sneha Reddy", role: "Tax Consultant" },
    ],
  };
}

export function getDefaultProducts() {
  return {
    heroTitle: "Mutual fund products",
    heroSubtitle:
      "Explore curated fund options and shortlist schemes aligned with your goals and risk comfort.",
    faqsHeading: "Mutual fund basics",
    fundsSectionEyebrow: "Search and filter",
    funds: [
      { id: "1", name: "HDFC Equity Fund", house: "HDFC MF", category: "Equity", returns: "18.5%", risk: "High", imageUrl: "" },
      { id: "2", name: "SBI Bluechip Fund", house: "SBI MF", category: "Large Cap", returns: "14.2%", risk: "Moderate", imageUrl: "" },
      { id: "3", name: "Axis Small Cap Fund", house: "Axis MF", category: "Small Cap", returns: "22.1%", risk: "High", imageUrl: "" },
    ],
    faqs: [
      {
        id: "1",
        question: "What are mutual funds?",
        answer:
          "Mutual funds pool capital from investors and deploy it across diversified assets managed by professional fund managers.",
      },
      {
        id: "2",
        question: "Why invest in mutual funds?",
        answer:
          "They offer diversification, liquidity, professional management, and a structured path for long-term goal investing.",
      },
      {
        id: "3",
        question: "Are mutual funds risky?",
        answer:
          "Risk levels vary by category. Proper asset allocation and horizon alignment help control risk effectively.",
      },
    ],
    filterCategories: ["All", "Equity", "Large Cap", "Small Cap"],
    filterHouses: ["All", "HDFC MF", "SBI MF", "Axis MF"],
  };
}

export function getDefaultServices() {
  return {
    heroTitle: "Professional financial services",
    heroSubtitle:
      "Comprehensive advisory solutions covering investments, insurance, tax planning, and long-term wealth strategy.",
    categories: ["All", "Investment", "Insurance", "Tax", "Advisory"],
    items: [
      {
        id: "1",
        title: "Mutual Fund Advisory",
        description: "Evidence-based fund selection and disciplined allocation for long-term wealth growth.",
        icon: "Wallet",
        category: "Investment",
        imageUrl: "",
      },
      {
        id: "2",
        title: "Life Insurance Planning",
        description: "Right coverage structure for family protection, liabilities, and life-stage priorities.",
        icon: "ShieldCheck",
        category: "Insurance",
        imageUrl: "",
      },
      {
        id: "3",
        title: "Health Insurance Planning",
        description: "Comprehensive protection strategy with family floater and critical rider evaluation.",
        icon: "HeartPulse",
        category: "Insurance",
        imageUrl: "",
      },
      {
        id: "4",
        title: "Tax Planning",
        description: "Tax-aware investing and deduction optimization aligned with your annual financial goals.",
        icon: "Target",
        category: "Tax",
        imageUrl: "",
      },
      {
        id: "5",
        title: "Wealth Advisory",
        description: "Goal-based planning, risk profiling, and periodic reviews to keep execution on track.",
        icon: "BriefcaseBusiness",
        category: "Advisory",
        imageUrl: "",
      },
      {
        id: "6",
        title: "Retirement Planning",
        description: "Structured retirement corpus planning with inflation-aware accumulation and drawdown strategy.",
        icon: "PiggyBank",
        category: "Advisory",
        imageUrl: "",
      },
    ],
  };
}

export function getDefaultInsurance() {
  return {
    heroTitle: "Insurance planning",
    heroSubtitle:
      "Protect your family, health, and long-term goals with properly structured insurance coverage.",
    lifeTabLabel: "Life Insurance",
    healthTabLabel: "Health Insurance",
    lifePlans: [
      {
        id: "life-1",
        name: "HDFC Life Click 2 Protect",
        company: "HDFC Life",
        coverage: "INR 1 Cr",
        premium: "INR 8,500 per year",
        features: ["Pure term plan", "Online discount", "Return of premium option", "Critical illness rider"],
      },
      {
        id: "life-2",
        name: "ICICI Pru iProtect Smart",
        company: "ICICI Prudential",
        coverage: "INR 1 Cr",
        premium: "INR 9,200 per year",
        features: ["Life cover", "Accidental death benefit", "Premium waiver", "Flexible payout options"],
      },
      {
        id: "life-3",
        name: "SBI Life eShield",
        company: "SBI Life",
        coverage: "INR 1 Cr",
        premium: "INR 8,800 per year",
        features: ["Affordable premiums", "Tax benefits", "Terminal illness cover", "Income benefit option"],
      },
    ],
    healthPlans: [
      {
        id: "health-1",
        name: "Star Health Comprehensive",
        company: "Star Health",
        coverage: "INR 25 Lakh",
        premium: "INR 10,500 per year",
        features: ["Cashless hospitalization", "Pre and post hospitalization", "No-claim bonus", "Health check-up"],
      },
      {
        id: "health-2",
        name: "HDFC ERGO Health Suraksha",
        company: "HDFC ERGO",
        coverage: "INR 20 Lakh",
        premium: "INR 9,800 per year",
        features: ["Family floater", "Ambulance covered", "AYUSH treatment", "Unlimited restoration"],
      },
      {
        id: "health-3",
        name: "Care Health Insurance",
        company: "Care Health",
        coverage: "INR 15 Lakh",
        premium: "INR 8,600 per year",
        features: ["Large cashless network", "Health check-ups", "No room rent limit", "Section 80D benefits"],
      },
    ],
  };
}

/**
 * Use DB array when it is a real array (including empty []). Otherwise fall back to defaults
 * so first-time visitors still see seeded content — but empty lists stay empty after delete.
 */
function pickArray(stored, fallback) {
  return Array.isArray(stored) ? stored : fallback;
}

export function mergeSiteContent(doc) {
  const defA = getDefaultAbout();
  const defP = getDefaultProducts();
  const defS = getDefaultServices();
  const defI = getDefaultInsurance();
  const a = doc?.about || {};
  return {
    about: {
      ...defA,
      ...a,
      values: pickArray(a.values, defA.values),
      team: pickArray(a.team, defA.team),
      missionParas: pickArray(a.missionParas, defA.missionParas),
      missionVisionHeading: a.missionVisionHeading ?? defA.missionVisionHeading,
      ourMissionTitle: a.ourMissionTitle ?? defA.ourMissionTitle,
      ourMissionText: a.ourMissionText ?? defA.ourMissionText,
      ourVisionTitle: a.ourVisionTitle ?? defA.ourVisionTitle,
      ourVisionText: a.ourVisionText ?? defA.ourVisionText,
      valuesHeading: a.valuesHeading ?? defA.valuesHeading,
      teamHeading: a.teamHeading ?? defA.teamHeading,
    },
    products: {
      ...defP,
      ...(doc?.products || {}),
      faqsHeading: doc?.products?.faqsHeading ?? defP.faqsHeading,
      fundsSectionEyebrow: doc?.products?.fundsSectionEyebrow ?? defP.fundsSectionEyebrow,
      funds: pickArray(doc?.products?.funds, defP.funds),
      faqs: pickArray(doc?.products?.faqs, defP.faqs),
      filterCategories: pickArray(doc?.products?.filterCategories, defP.filterCategories),
      filterHouses: pickArray(doc?.products?.filterHouses, defP.filterHouses),
    },
    services: {
      ...defS,
      ...(doc?.services || {}),
      items: pickArray(doc?.services?.items, defS.items),
      categories: pickArray(doc?.services?.categories, defS.categories),
    },
    insurance: {
      ...defI,
      ...(doc?.insurance || {}),
      lifePlans: pickArray(doc?.insurance?.lifePlans, defI.lifePlans),
      healthPlans: pickArray(doc?.insurance?.healthPlans, defI.healthPlans),
    },
  };
}
