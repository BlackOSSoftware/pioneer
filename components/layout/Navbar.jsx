"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

const MAIN_LINKS = [
  ["/", "Home"],
  ["/about", "About"],
  ["/Services", "Services"],
  ["/Product", "Products"],
  ["/Insurance", "Insurance"],
  ["/financial-planning", "Financial Planning"],
  ["/contact", "Contact"],
];

const CALCULATOR_LINKS = [
  ["sip-return", "SIP Return Calculator"],
  ["crorepati", "Become A Crorepati Calculator"],
  ["sip-step-up", "SIP Step-Up Calculator"],
  ["emi", "EMI Calculator"],
  ["target-sip", "Target Amount SIP Calculator"],
  ["sip-annual", "SIP With Annual Increase"],
  ["retirement", "Retirement Planning Calculator"],
  ["goal-setting", "Goal Setting Calculator"],
  ["financial-goal", "Composite Financial Goal Calculator"],
  ["education", "Children Education Planner"],
  ["compounding", "Compounding Calculator"],
  ["future-value", "Future Value Calculator"],
  ["lumpsum-target", "Lumpsum Target Calculator"],
  ["lumpsum", "Lumpsum Calculator"],
];

const PLANNER_LINKS = [
  ["Dream-home", "Dream Home"],
  ["Wealth-Creation", "Wealth Creation"],
  ["Retiremen", "Retirement"],
  ["Child-Education", "Child's Education"],
  ["Child-Wedding", "Child's Wedding"],
  ["Emergency", "Emergency"],
];

/** Shared nav link style: underline aligned to text baseline */
const navItemClass = (active) =>
  `relative inline-flex items-center gap-1 pb-1.5 text-sm xl:text-[15px] font-medium transition-colors duration-200 ${
    active ? "text-sky-700" : "text-slate-800 hover:text-sky-700"
  } after:pointer-events-none after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-sm after:bg-sky-700 after:transition-all after:duration-200 ${
    active ? "after:w-full" : "after:w-0 hover:after:w-full"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  const pathname = usePathname() ?? "/";
  const normalizedPath = useMemo(() => pathname.toLowerCase(), [pathname]);

  const closeAll = () => {
    setMenuOpen(false);
    setCalcOpen(false);
    setPlannerOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-[70px] sm:px-4 lg:px-6">
        <Link href="/" className="flex items-center" onClick={closeAll}>
          <Image
            src="/newlogo.png"
            alt="Pioneer Wealth Solutions Logo"
            width={150}
            height={42}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          {MAIN_LINKS.map(([url, label]) => (
            <Link key={url} href={url} className={navItemClass(normalizedPath === url.toLowerCase())}>
              {label}
            </Link>
          ))}

          {/* Desktop: hover / focus-within — pointer-events so gap under trigger still receives hover */}
          <div className="group relative outline-none" tabIndex={0}>
            <button
              type="button"
              className={`${navItemClass(normalizedPath.includes("/calculators"))} cursor-default border-0 bg-transparent p-0`}
              aria-haspopup="true"
              aria-expanded={false}
              tabIndex={-1}
            >
              Calculators
              <ChevronDown size={16} className="opacity-70 shrink-0" aria-hidden />
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-50 pt-1.5 opacity-0 transition-opacity duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <ul className="max-h-80 w-80 overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {CALCULATOR_LINKS.map(([url, text]) => (
                  <li key={url}>
                    <Link
                      href={`/Calculators/${url}`}
                      onClick={closeAll}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group relative outline-none" tabIndex={0}>
            <button
              type="button"
              className={`${navItemClass(normalizedPath.includes("/goal_planners"))} cursor-default border-0 bg-transparent p-0`}
              aria-haspopup="true"
              aria-expanded={false}
              tabIndex={-1}
            >
              Goal Planners
              <ChevronDown size={16} className="opacity-70 shrink-0" aria-hidden />
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-50 pt-1.5 opacity-0 transition-opacity duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <ul className="w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {PLANNER_LINKS.map(([url, text]) => (
                  <li key={url}>
                    <Link
                      href={`/Goal_Planners/${url}`}
                      onClick={closeAll}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-sky-50 hover:text-sky-700"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/login"
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-800"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-800 transition-colors duration-200 hover:bg-slate-50 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        className={`fixed inset-x-0 top-16 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 sm:top-[70px] lg:hidden ${
          menuOpen ? "pointer-events-auto max-h-[calc(100dvh-70px)] translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        } overflow-y-auto`}
      >
        <div className="space-y-1 px-3 py-3">
          {MAIN_LINKS.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              onClick={closeAll}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                normalizedPath === url.toLowerCase() ? "bg-sky-50 text-sky-700" : "text-slate-800 hover:bg-slate-100"
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
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Calculators
            <ChevronDown size={16} className={`transition-transform duration-200 ${calcOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${calcOpen ? "max-h-[520px]" : "max-h-0"}`}>
            <div className="space-y-1 pb-2 pl-2">
              {CALCULATOR_LINKS.map(([url, text]) => (
                <Link
                  key={url}
                  href={`/Calculators/${url}`}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2 text-xs text-slate-700 transition-colors duration-150 hover:bg-sky-50 hover:text-sky-700"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPlannerOpen((v) => !v);
              setCalcOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Goal Planners
            <ChevronDown size={16} className={`transition-transform duration-200 ${plannerOpen ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${plannerOpen ? "max-h-72" : "max-h-0"}`}>
            <div className="space-y-1 pb-2 pl-2">
              {PLANNER_LINKS.map(([url, text]) => (
                <Link
                  key={url}
                  href={`/Goal_Planners/${url}`}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2 text-xs text-slate-700 transition-colors duration-150 hover:bg-sky-50 hover:text-sky-700"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            onClick={closeAll}
            className="mt-2 block rounded-lg bg-sky-700 px-3 py-2 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-800"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
