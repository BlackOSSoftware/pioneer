"use client";

/* eslint-disable @next/next/no-img-element */
import { Building2, Mail, MessageCircle, Phone, UserRound } from "lucide-react";

const DEFAULT_COMPANY = {
  name: "Pioneer Wealth",
  subtitle: "Financial Planning & Mutual Funds",
  role: "Wealth Advisor",
  phone: "+91 98765 43210",
  email: "info@pioneerws.in",
  website: "www.pioneerwealth.in",
  address: "Mumbai, India",
};

const TEMPLATE_THEME = {
  classic: {
    dark: "#0B4C8C",
    deep: "#092F5E",
    accent: "#38BDF8",
    soft: "#E0F2FE",
    shadow: "0 16px 30px rgba(15,23,42,0.16)",
  },
  modern: {
    dark: "#0F172A",
    deep: "#164E63",
    accent: "#14B8A6",
    soft: "#CCFBF1",
    shadow: "0 18px 34px rgba(15,23,42,0.22)",
  },
  clean: {
    dark: "#075985",
    deep: "#0369A1",
    accent: "#F59E0B",
    soft: "#F8FAFC",
    shadow: "0 16px 28px rgba(2,132,199,0.18)",
  },
};

function cardText({ mode, personName, personPhone, company }) {
  const C = { ...DEFAULT_COMPANY, ...company };
  return {
    C,
    displayName:
      mode === "company"
        ? "PIONEER WEALTH"
        : personName.trim()
          ? personName.trim().toUpperCase()
          : "YOUR NAME",
    displayPhone: mode === "company" ? C.phone : personPhone.trim() || C.phone,
    displayRole: mode === "company" ? "Wealth Advisory" : C.role,
  };
}

function ContactRow({ icon: Icon, children, tone }) {
  return (
    <p className="flex min-w-0 items-center gap-1.5 min-[360px]:gap-2.5">
      <span
        className="grid h-4 w-4 shrink-0 place-items-center rounded min-[360px]:h-5 min-[360px]:w-5 sm:h-6 sm:w-6 sm:rounded-md"
        style={{ backgroundColor: tone }}
      >
        <Icon className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
      </span>
      <span className="truncate">{children}</span>
    </p>
  );
}

function ClassicCard({ mode, personName, personPhone, company, theme }) {
  const { C, displayName, displayPhone, displayRole } = cardText({ mode, personName, personPhone, company });
  return (
    <>
      <div className="absolute inset-y-0 left-0 w-[54%]" style={{ background: `linear-gradient(180deg, ${theme.dark} 0%, ${theme.deep} 100%)` }} />
      <div className="absolute -right-[11%] top-[-20%] h-[70%] w-[62%] rounded-full border-[10px]" style={{ borderColor: "#FFFFFF", backgroundColor: theme.accent }} />
      <div className="absolute -right-[8%] top-[-12%] h-[62%] w-[54%] rounded-full border-[8px]" style={{ borderColor: theme.deep, backgroundColor: "#FFFFFF" }} />
      <div className="absolute -left-[14%] bottom-[-60%] h-[120%] w-[66%] rounded-full" style={{ backgroundColor: theme.deep }} />

      <div className="relative z-10 grid h-full grid-cols-12">
        <div className="col-span-7 flex h-full min-w-0 flex-col justify-between px-2.5 py-3 text-white min-[360px]:px-3 min-[360px]:py-4 sm:px-5 sm:py-6">
          <div>
            <p className="break-words text-[clamp(0.78rem,5vw,1.5rem)] font-bold leading-tight tracking-wide">{displayName}</p>
            <p className="mt-0.5 truncate text-[clamp(0.62rem,3vw,1rem)] text-blue-100 min-[360px]:mt-1">{displayRole}</p>
          </div>
          <div className="space-y-1 text-[clamp(0.5rem,2.5vw,0.875rem)] min-[360px]:space-y-1.5 sm:space-y-2">
            <ContactRow icon={Phone} tone={theme.deep}>{displayPhone}</ContactRow>
            <ContactRow icon={Mail} tone={theme.deep}>{C.email}</ContactRow>
            <ContactRow icon={Building2} tone={theme.deep}>{C.website}</ContactRow>
            <ContactRow icon={MessageCircle} tone={theme.deep}>{C.address}</ContactRow>
          </div>
        </div>

        <div className="col-span-5 flex h-full min-w-0 flex-col items-center justify-center px-1.5 text-center min-[360px]:px-2 sm:px-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] bg-white shadow-md min-[360px]:h-11 min-[360px]:w-11 sm:h-16 sm:w-16 sm:border-4" style={{ borderColor: theme.deep }}>
            <img src="/newlogo.png" alt="Pioneer Logo" width={40} height={40} className="h-5 w-5 object-contain min-[360px]:h-7 min-[360px]:w-7 sm:h-10 sm:w-10" />
          </div>
          <p className="mt-1.5 max-w-full break-words text-[clamp(0.7rem,4vw,1.5rem)] font-bold leading-tight min-[360px]:mt-2 sm:mt-3" style={{ color: "#0F172A" }}>
            {C.name.toUpperCase()}
          </p>
          <p className="mt-0.5 max-w-full break-words text-[clamp(0.5rem,2.5vw,0.75rem)] sm:mt-1" style={{ color: "#334155" }}>
            {C.subtitle}
          </p>
        </div>
      </div>
    </>
  );
}

function ModernCard({ mode, personName, personPhone, company, theme }) {
  const { C, displayName, displayPhone, displayRole } = cardText({ mode, personName, personPhone, company });
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.deep} 62%, #111827 100%)` }} />
      <div className="absolute -right-10 top-0 h-full w-[45%] skew-x-[-14deg]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      <div className="absolute bottom-0 left-0 h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}, #FFFFFF, ${theme.accent})` }} />
      <div className="relative z-10 flex h-full">
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3 text-white min-[360px]:px-4 min-[360px]:py-4 sm:px-6 sm:py-6">
          <div>
            <p className="text-[clamp(0.52rem,2.3vw,0.78rem)] font-semibold uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
              Pioneer Wealth Solutions
            </p>
            <p className="mt-2 break-words text-[clamp(0.9rem,5.3vw,1.65rem)] font-bold leading-tight">{displayName}</p>
            <p className="mt-1 truncate text-[clamp(0.58rem,3vw,0.95rem)] text-slate-200">{displayRole}</p>
          </div>
          <div className="grid gap-1.5 text-[clamp(0.52rem,2.5vw,0.82rem)] sm:grid-cols-2">
            <ContactRow icon={Phone} tone={theme.accent}>{displayPhone}</ContactRow>
            <ContactRow icon={Mail} tone={theme.accent}>{C.email}</ContactRow>
            <ContactRow icon={Building2} tone={theme.accent}>{C.website}</ContactRow>
            <ContactRow icon={UserRound} tone={theme.accent}>{C.address}</ContactRow>
          </div>
        </div>
        <div className="flex w-[30%] shrink-0 items-center justify-center pr-2 sm:pr-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-xl min-[360px]:h-14 min-[360px]:w-14 sm:h-20 sm:w-20">
            <img src="/newlogo.png" alt="Pioneer Logo" width={46} height={46} className="h-7 w-7 object-contain sm:h-12 sm:w-12" />
          </div>
        </div>
      </div>
    </>
  );
}

function CleanCard({ mode, personName, personPhone, company, theme }) {
  const { C, displayName, displayPhone, displayRole } = cardText({ mode, personName, personPhone, company });
  return (
    <>
      <div className="absolute inset-0 bg-white" />
      <div className="absolute left-0 top-0 h-full w-3" style={{ background: `linear-gradient(180deg, ${theme.dark}, ${theme.accent})` }} />
      <div className="absolute right-0 top-0 h-full w-[37%]" style={{ background: theme.soft }} />
      <div className="absolute right-4 top-4 h-14 w-14 rounded-full opacity-50 sm:h-24 sm:w-24" style={{ backgroundColor: theme.accent }} />
      <div className="relative z-10 grid h-full grid-cols-12">
        <div className="col-span-8 flex min-w-0 flex-col justify-between py-3 pl-5 pr-2 min-[360px]:py-4 min-[360px]:pl-6 sm:py-6 sm:pl-8">
          <div>
            <p className="text-[clamp(0.5rem,2.3vw,0.72rem)] font-bold uppercase tracking-[0.2em]" style={{ color: theme.dark }}>
              {C.name}
            </p>
            <p className="mt-2 break-words text-[clamp(0.9rem,5vw,1.6rem)] font-bold leading-tight text-slate-950">{displayName}</p>
            <p className="mt-1 truncate text-[clamp(0.58rem,2.8vw,0.92rem)] text-slate-500">{displayRole}</p>
          </div>
          <div className="space-y-1 text-[clamp(0.5rem,2.4vw,0.8rem)] text-slate-700 min-[360px]:space-y-1.5">
            <ContactRow icon={Phone} tone={theme.dark}>{displayPhone}</ContactRow>
            <ContactRow icon={Mail} tone={theme.dark}>{C.email}</ContactRow>
            <ContactRow icon={Building2} tone={theme.dark}>{C.website}</ContactRow>
          </div>
        </div>
        <div className="col-span-4 flex flex-col items-center justify-center px-2 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md ring-4 min-[360px]:h-14 min-[360px]:w-14 sm:h-20 sm:w-20" style={{ ringColor: theme.soft }}>
            <img src="/newlogo.png" alt="Pioneer Logo" width={48} height={48} className="h-7 w-7 object-contain sm:h-12 sm:w-12" />
          </div>
          <p className="mt-2 text-[clamp(0.5rem,2.2vw,0.76rem)] font-semibold leading-tight text-slate-700">{C.subtitle}</p>
        </div>
      </div>
    </>
  );
}

export default function VisitingCardFace({ mode, personName = "", personPhone = "", company = {}, template = "classic" }) {
  const theme = TEMPLATE_THEME[template] || TEMPLATE_THEME.classic;

  return (
    <div
      className="relative z-10 aspect-[1.78/1] w-full max-w-[560px] overflow-hidden rounded-xl border min-[360px]:rounded-2xl"
      style={{ borderColor: "#BFD0DD", backgroundColor: "#FFFFFF", boxShadow: theme.shadow }}
    >
      {template === "modern" ? (
        <ModernCard mode={mode} personName={personName} personPhone={personPhone} company={company} theme={theme} />
      ) : template === "clean" ? (
        <CleanCard mode={mode} personName={personName} personPhone={personPhone} company={company} theme={theme} />
      ) : (
        <ClassicCard mode={mode} personName={personName} personPhone={personPhone} company={company} theme={theme} />
      )}
    </div>
  );
}
