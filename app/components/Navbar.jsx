"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  const rawPath = usePathname();
  const pathname = (rawPath ?? "/").toLowerCase();

  const handleCloseAll = () => {
    setMenuOpen(false);
    setCalcOpen(false);
    setPlannerOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 text-gray-900">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-3">

          {/* LOGO */}
          <div className="flex-shrink-0 ml-2">
            <Link href="/" onClick={handleCloseAll} className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                P
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Pioneer Wealth
              </span>
            </Link>
          </div>

          <div className="flex-grow"></div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8 -mr-20">

            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/services", "Services"],
              ["/product", "Products"],
              ["/insurance", "Insurance"],
              ["/financial-planning", "Financial Planning"],
            ].map(([url, label]) => (
              <Link
                key={url}
                href={url}
                className={`relative pb-1 ${
                  pathname === url ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"
                } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}
              >
                {label}
              </Link>
            ))}

            {/* DESKTOP - CALCULATORS (HOVER MENU) */}
            <div className="relative group">
              <div className="flex items-center cursor-pointer text-gray-900 group-hover:text-blue-600">
                Calculators <ChevronDown size={18} className="ml-1" />
              </div>

              {/* Hover bridge */}
              <div className="absolute left-0 top-full h-3 w-full"></div>

              <div className="absolute opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">
                <ul className="py-2 text-[15px] max-h-[300px] overflow-auto">
                  {[
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
                  ].map(([url, text]) => (
                    <li key={url} className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200">
                      <Link href={`/Calculators/${url}`} className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DESKTOP - GOAL PLANNERS */}
            <div className="relative group">
              <div className="flex items-center cursor-pointer text-gray-900 group-hover:text-blue-600">
                Goal Planners <ChevronDown size={18} className="ml-1" />
              </div>

              <div className="absolute left-0 top-full h-3 w-full"></div>

              <div className="absolute opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">
                <ul className="py-2 text-[15px]">
                  {[
                    ["Dream-home", "Dream Home"],
                    ["Wealth-Creation", "Wealth Creation"],
                    ["Retiremen", "Retirement"],
                    ["Child-Education", "Child's Education"],
                    ["Child-Wedding", "Child's Wedding"],
                    ["Emergency", "Emergency"],
                  ].map(([url, text]) => (
                    <li key={url} className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200">
                      <Link href={`/Goal_Planners/${url}`} className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/contact" className={`pb-1 ${pathname === "/contact" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"} relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>Contact</Link>

            <Link href="/login" className={`pb-1 ${pathname === "/login" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"} relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>Login</Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden text-gray-900 ml-4" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t animate-fadeIn max-h-[80vh] overflow-y-auto mt-[64px]">
          <div className="flex flex-col items-center py-4 space-y-3">
            <Link href="/" onClick={handleCloseAll}>Home</Link>
            <Link href="/about" onClick={handleCloseAll}>About</Link>
            <Link href="/Services" onClick={handleCloseAll}>Services</Link>
            <Link href="/Product" onClick={handleCloseAll}>Products</Link>

            {/* MOBILE - CALCULATORS */}
            <button onClick={() => { setCalcOpen(!calcOpen); if (plannerOpen) setPlannerOpen(false); }} className="flex items-center gap-1">
              Calculators <ChevronDown size={18} />
            </button>

            {calcOpen && (
              <div className="w-full px-4 space-y-2">
                {[
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
                ].map(([url, text]) => (
                  <Link key={url} href={`/Calculators/${url}`} onClick={handleCloseAll}>
                    <p className="bg-gray-100 p-2 rounded-md text-center">{text}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* MOBILE - GOAL PLANNERS */}
            <button onClick={() => { setPlannerOpen(!plannerOpen); if (calcOpen) setCalcOpen(false); }} className="flex items-center gap-1">
              Goal Planners <ChevronDown size={18} />
            </button>

            {plannerOpen && (
              <div className="w-full px-4 space-y-2">
                {[
                  ["Dream-home", "Dream Home"],
                  ["Wealth-Creation", "Wealth Creation"],
                  ["Retiremen", "Retirement"],
                  ["Child-Education", "Child's Education"],
                  ["Child-Wedding", "Child's Wedding"],
                  ["Emergency", "Emergency"],
                ].map(([url, text]) => (
                  <Link key={url} href={`/Goal_Planners/${url}`} onClick={handleCloseAll}>
                    <p className="bg-gray-100 p-2 rounded-md text-center">{text}</p>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/contact" onClick={handleCloseAll}>Contact</Link>

            <Link href="/login" onClick={handleCloseAll}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
