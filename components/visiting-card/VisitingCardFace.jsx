"use client";

import { Building2, MessageCircle, Phone, UserRound } from "lucide-react";

const DEFAULT_COMPANY = {
  name: "Pioneer Wealth",
  subtitle: "Financial Planning & Mutual Funds",
  role: "Wealth Advisor",
  phone: "+91 98765 43210",
  email: "advisory@pioneerwealth.in",
  website: "www.pioneerwealth.in",
  address: "Mumbai, India",
};

/**
 * Visiting card visual — company template or personalized advisor card.
 * @param {{ mode: "company" | "person"; personName?: string; personPhone?: string; company?: Partial<typeof DEFAULT_COMPANY> }} props
 */
export default function VisitingCardFace({ mode, personName = "", personPhone = "", company = {} }) {
  const C = { ...DEFAULT_COMPANY, ...company };
  const displayName =
    mode === "company"
      ? "PIONEER WEALTH"
      : personName.trim()
        ? personName.trim().toUpperCase()
        : "YOUR NAME";
  const displayPhone = mode === "company" ? C.phone : personPhone.trim() || C.phone;

  return (
    <div
      className="relative z-10 aspect-[1.78/1] w-full max-w-[560px] overflow-hidden rounded-2xl border"
      style={{ borderColor: "#BFD0DD", backgroundColor: "#FFFFFF", boxShadow: "0 16px 30px rgba(15,23,42,0.16)" }}
    >
      <div className="absolute inset-y-0 left-0 w-[54%]" style={{ background: "linear-gradient(180deg, #12569B 0%, #0D4B8D 100%)" }} />
      <div className="absolute -right-[11%] top-[-20%] h-[70%] w-[62%] rounded-full border-[10px]" style={{ borderColor: "#FFFFFF", backgroundColor: "#1C5EA4" }} />
      <div className="absolute -right-[8%] top-[-12%] h-[62%] w-[54%] rounded-full border-[8px]" style={{ borderColor: "#173E74", backgroundColor: "#FFFFFF" }} />
      <div className="absolute -left-[14%] bottom-[-60%] h-[120%] w-[66%] rounded-full" style={{ backgroundColor: "#0D4B8D" }} />

      <div className="relative z-10 grid h-full grid-cols-12">
        <div className="col-span-7 flex h-full flex-col justify-between px-4 py-5 text-white sm:px-5 sm:py-6">
          <div>
            <p className="text-xl font-bold leading-tight tracking-wide sm:text-2xl">{displayName}</p>
            <p className="mt-1 text-sm text-blue-100 sm:text-base">{mode === "company" ? "Wealth Advisory" : C.role}</p>
          </div>

          <div className="space-y-2 text-[11px] sm:text-sm">
            <p className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#123F72]">
                <Phone size={12} />
              </span>
              <span>{displayPhone}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#123F72]">
                <UserRound size={12} />
              </span>
              <span>{C.email}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#123F72]">
                <Building2 size={12} />
              </span>
              <span>{C.website}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#123F72]">
                <MessageCircle size={12} />
              </span>
              <span>{C.address}</span>
            </p>
          </div>
        </div>

        <div className="col-span-5 flex h-full flex-col items-center justify-center px-3 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#0D4B8D] bg-white shadow-md sm:h-16 sm:w-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/newlogo.png" alt="Pioneer Logo" width={40} height={40} className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          </div>
          <p className="mt-3 text-lg font-bold leading-tight sm:text-2xl" style={{ color: "#0F172A" }}>
            {C.name.toUpperCase()}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs" style={{ color: "#334155" }}>
            {C.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
