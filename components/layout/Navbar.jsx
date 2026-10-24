"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, ChevronDown, Calculator, Target } from "lucide-react";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  ["/", "Home"],
  ["/about", "About"],
  ["/Services", "Services"],
  ["/Product", "Products"],
  ["/Insurance", "Insurance"],
  ["/financial-planning", "Planning"],
  ["/contact", "Contact"],
];

const CALCULATOR_LINKS = [
  ["sip-return", "SIP Return"],
  ["crorepati", "Become A Crorepati"],
  ["sip-step-up", "SIP Step-Up"],
  ["emi", "EMI Calculator"],
  ["target-sip", "Target Amount SIP"],
  ["sip-annual", "SIP Annual Increase"],
  ["retirement", "Retirement Planning"],
  ["goal-setting", "Goal Setting"],
  ["financial-goal", "Composite Financial Goal"],
  ["education", "Children Education"],
  ["compounding", "Compounding"],
  ["future-value", "Future Value"],
  ["lumpsum-target", "Lumpsum Target"],
  ["lumpsum", "Lumpsum"],
];

const PLANNER_LINKS = [
  ["Dream-home", "Dream Home"],
  ["Wealth-Creation", "Wealth Creation"],
  ["Retiremen", "Retirement"],
  ["Child-Education", "Child's Education"],
  ["Child-Wedding", "Child's Wedding"],
  ["Emergency", "Emergency"],
];

const navLink = (active) =>
  `relative inline-flex h-9 items-center whitespace-nowrap px-1 text-[13px] font-semibold tracking-tight transition-colors xl:text-sm ${
    active ? "text-[#071a2e]" : "text-slate-600 hover:text-[#071a2e]"
  } after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-amber-400 after:transition-transform after:duration-200 ${
    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
  }`;

const dropItem = (active, compact = false) =>
  `block rounded-lg px-3 py-2 transition-colors ${compact ? "text-xs" : "text-sm"} ${
    active
      ? "bg-[#071a2e] font-semibold !text-white"
      : "text-slate-700 hover:bg-slate-50 hover:text-[#071a2e]"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [calcDesktopOpen, setCalcDesktopOpen] = useState(false);
  const [plannerDesktopOpen, setPlannerDesktopOpen] = useState(false);

  const calcRef = useRef(null);
  const plannerRef = useRef(null);
  const calcCloseTimer = useRef(null);
  const plannerCloseTimer = useRef(null);

  const pathname = usePathname() ?? "/";
  const normalizedPath = useMemo(() => pathname.toLowerCase(), [pathname]);
  const calcSectionActive = normalizedPath.includes("/calculators");
  const plannerSectionActive = normalizedPath.includes("/goal_planners");

  const closeAll = () => {
    setMenuOpen(false);
    setCalcOpen(false);
    setPlannerOpen(false);
    setCalcDesktopOpen(false);
    setPlannerDesktopOpen(false);
  };

  const openCalcDesktop = () => {
    if (calcCloseTimer.current) clearTimeout(calcCloseTimer.current);
    setPlannerDesktopOpen(false);
    setCalcDesktopOpen(true);
  };

  const scheduleCloseCalc = () => {
    if (calcCloseTimer.current) clearTimeout(calcCloseTimer.current);
    calcCloseTimer.current = setTimeout(() => setCalcDesktopOpen(false), 160);
  };

  const openPlannerDesktop = () => {
    if (plannerCloseTimer.current) clearTimeout(plannerCloseTimer.current);
    setCalcDesktopOpen(false);
    setPlannerDesktopOpen(true);
  };

  const scheduleClosePlanner = () => {
    if (plannerCloseTimer.current) clearTimeout(plannerCloseTimer.current);
    plannerCloseTimer.current = setTimeout(() => setPlannerDesktopOpen(false), 160);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (calcRef.current && !calcRef.current.contains(e.target)) setCalcDesktopOpen(false);
      if (plannerRef.current && !plannerRef.current.contains(e.target)) setPlannerDesktopOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      if (calcCloseTimer.current) clearTimeout(calcCloseTimer.current);
      if (plannerCloseTimer.current) clearTimeout(plannerCloseTimer.current);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      {/* Slim brand strip */}
      <div className="border-b border-white/10 bg-[#071a2e] text-[10px] text-sky-100/90 min-[360px]:text-[11px]">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-between gap-2 px-2.5 min-[360px]:px-3 sm:px-5 lg:px-6">
          <p className="min-w-0 truncate font-medium tracking-wide">
            <span className="sm:hidden">Pioneer Wealth</span>
            <span className="hidden sm:inline">Pioneer Wealth Solutions · Goal-based advisory</span>
          </p>
          <a
            href="tel:+919876543210"
            className="shrink-0 font-semibold text-amber-300 hover:text-amber-200"
          >
            <span className="min-[380px]:hidden">Call</span>
            <span className="hidden min-[380px]:inline">+91 98765 43210</span>
          </a>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_-18px_rgba(7,26,46,0.35)] backdrop-blur-xl">
        <nav className="relative mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-2.5 min-[360px]:px-3 sm:h-16 sm:px-5 lg:px-6">
          <Link
            href="/"
            className="flex min-w-0 max-w-[58%] items-center gap-2 overflow-hidden sm:max-w-none"
            onClick={closeAll}
          >
            <Image
              src="/newlogo.png"
              alt="Pioneer Wealth Solutions logo — financial advisor India"
              width={148}
              height={40}
              priority
              sizes="(max-width: 360px) 108px, (max-width: 640px) 128px, 148px"
              className="!h-8 !w-auto !max-h-8 max-w-[108px] object-contain object-left min-[360px]:max-w-[124px] sm:!h-10 sm:!max-h-10 sm:max-w-[148px]"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 xl:gap-2.5 lg:flex">
            {MAIN_LINKS.map(([url, label]) => (
              <Link key={url} href={url} className={navLink(normalizedPath === url.toLowerCase())}>
                {label}
              </Link>
            ))}

            <div
              ref={calcRef}
              className="relative"
              onMouseEnter={openCalcDesktop}
              onMouseLeave={scheduleCloseCalc}
            >
              <button
                type="button"
                className={`${navLink(calcSectionActive || calcDesktopOpen)} cursor-pointer gap-0.5 border-0 bg-transparent`}
                aria-haspopup="true"
                aria-expanded={calcDesktopOpen}
                onClick={() => {
                  setPlannerDesktopOpen(false);
                  setCalcDesktopOpen((v) => !v);
                }}
              >
                Calculators
                <ChevronDown
                  size={14}
                  className={`opacity-60 transition-transform ${calcDesktopOpen ? "rotate-180" : ""}`}
                />
              </button>
              {calcDesktopOpen && (
                <div className="absolute right-0 top-full z-[70] pt-2">
                  <div className="w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#071a2e] text-white">
                        <Calculator size={15} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Calculators</p>
                        <p className="text-[11px] text-slate-500">SIP · EMI · goals · lumpsum</p>
                      </div>
                    </div>
                    <ul className="grid max-h-[min(22rem,60vh)] grid-cols-1 gap-0.5 overflow-y-auto p-2">
                      {CALCULATOR_LINKS.map(([url, text]) => {
                        const active = normalizedPath === `/calculators/${url}`.toLowerCase();
                        return (
                          <li key={url}>
                            <Link
                              href={`/Calculators/${url}`}
                              onClick={closeAll}
                              className={dropItem(active)}
                            >
                              {text}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div
              ref={plannerRef}
              className="relative"
              onMouseEnter={openPlannerDesktop}
              onMouseLeave={scheduleClosePlanner}
            >
              <button
                type="button"
                className={`${navLink(plannerSectionActive || plannerDesktopOpen)} cursor-pointer gap-0.5 border-0 bg-transparent`}
                aria-haspopup="true"
                aria-expanded={plannerDesktopOpen}
                onClick={() => {
                  setCalcDesktopOpen(false);
                  setPlannerDesktopOpen((v) => !v);
                }}
              >
                Goal Planners
                <ChevronDown
                  size={14}
                  className={`opacity-60 transition-transform ${plannerDesktopOpen ? "rotate-180" : ""}`}
                />
              </button>
              {plannerDesktopOpen && (
                <div className="absolute right-0 top-full z-[70] pt-2">
                  <div className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400 text-[#071a2e]">
                        <Target size={15} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Goal Planners</p>
                        <p className="text-[11px] text-slate-500">Home · education · retirement</p>
                      </div>
                    </div>
                    <ul className="space-y-0.5 p-2">
                      {PLANNER_LINKS.map(([url, text]) => {
                        const active = normalizedPath === `/goal_planners/${url}`.toLowerCase();
                        return (
                          <li key={url}>
                            <Link
                              href={`/Goal_Planners/${url}`}
                              onClick={closeAll}
                              className={dropItem(active)}
                            >
                              {text}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="ml-1 inline-flex h-9 items-center rounded-xl bg-[#071a2e] px-4 text-sm font-semibold !text-white shadow-md shadow-[#071a2e]/25 transition hover:bg-[#0a2744] hover:!text-white"
            >
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[#071a2e] transition hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile panel — under strip (h-7) + main bar (h-14 / sm:h-16) */}
      <div
        className={`fixed inset-x-0 top-[calc(1.75rem+3.5rem)] z-[55] max-h-[calc(100dvh-1.75rem-3.5rem)] border-b border-slate-200 bg-white shadow-xl transition-all duration-300 sm:top-[calc(1.75rem+4rem)] sm:max-h-[calc(100dvh-1.75rem-4rem)] lg:hidden ${
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="max-h-[inherit] space-y-1 overflow-y-auto overscroll-contain px-2.5 py-3 min-[360px]:px-3">
          {MAIN_LINKS.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              onClick={closeAll}
              className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                normalizedPath === url.toLowerCase()
                  ? "bg-[#071a2e] !text-white"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setCalcOpen((v) => !v);
              setPlannerOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
              calcSectionActive || calcOpen ? "bg-slate-100 text-[#071a2e]" : "text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Calculator size={15} className="opacity-70" />
              Calculators
            </span>
            <ChevronDown size={16} className={`transition-transform ${calcOpen ? "rotate-180" : ""}`} />
          </button>
          {calcOpen && (
            <div className="mb-1 space-y-0.5 rounded-xl border border-slate-100 bg-slate-50/80 p-1.5 pl-1">
              {CALCULATOR_LINKS.map(([url, text]) => {
                const active = normalizedPath === `/calculators/${url}`.toLowerCase();
                return (
                  <Link
                    key={url}
                    href={`/Calculators/${url}`}
                    onClick={closeAll}
                    className={dropItem(active, true)}
                  >
                    {text}
                  </Link>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setPlannerOpen((v) => !v);
              setCalcOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
              plannerSectionActive || plannerOpen
                ? "bg-slate-100 text-[#071a2e]"
                : "text-slate-800 hover:bg-slate-50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Target size={15} className="opacity-70" />
              Goal Planners
            </span>
            <ChevronDown size={16} className={`transition-transform ${plannerOpen ? "rotate-180" : ""}`} />
          </button>
          {plannerOpen && (
            <div className="mb-1 space-y-0.5 rounded-xl border border-slate-100 bg-slate-50/80 p-1.5">
              {PLANNER_LINKS.map(([url, text]) => {
                const active = normalizedPath === `/goal_planners/${url}`.toLowerCase();
                return (
                  <Link
                    key={url}
                    href={`/Goal_Planners/${url}`}
                    onClick={closeAll}
                    className={dropItem(active, true)}
                  >
                    {text}
                  </Link>
                );
              })}
            </div>
          )}

          <Link
            href="/login"
            onClick={closeAll}
            className="mt-2 block rounded-xl bg-[#071a2e] px-3 py-3 text-center text-sm font-semibold !text-white shadow-md transition hover:bg-[#0a2744] hover:!text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
