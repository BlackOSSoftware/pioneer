"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center px-6 py-3">

        {/* LEFT — LOGO */}
        <div className="flex-shrink-0 -ml-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center text-lg">
              P
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Pioneer Wealth
            </span>
          </Link>
        </div>

        {/* CENTER FLEX GROW (keeps menu right aligned clean look) */}
        <div className="flex-grow"></div>

        {/* RIGHT — DESKTOP MENU */}
        <div className="hidden lg:flex items-center space-x-8 -mr-20">

          <Link href="/" className={`relative pb-1 ${pathname === "/" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Home</Link>
          <Link href="/about" className={`relative pb-1 ${pathname === "/about" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>About</Link>
          <Link href="/Services" className={`relative pb-1 ${pathname === "/Services" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Services</Link>
          <Link href="/Product" className={`relative pb-1 ${pathname === "/Product" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Products</Link>
          <Link href="/Insurance" className={`relative pb-1 ${pathname === "/Insurance" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Insurance</Link>
          <Link href="/financial-planning" className={`relative pb-1 ${pathname === "/financial-planning" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Financial Planning</Link>

          {/* DESKTOP DROPDOWN */}
          
          <div className="relative group">

            <div className="flex items-center cursor-pointer text-gray-700 hover:text-blue-600 group-hover:text-blue-600">
              Calculators <ChevronDown size={18} className="ml-1" />
            </div>

            {/* GAP FIX */}
            <div className="absolute left-0 top-full h-2 w-full"></div>

            {/* DROPDOWN BOX */}
            <div className="absolute hidden group-hover:block bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">

              <ul className="py-2 text-[15px]">

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
                ].map(([url, label], index) => (
                  <li
                    key={index}
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200"
                  >
                    <Link
                      href={`/Calculators/${url}`}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}

              </ul>
            </div>
          </div>
          <div className="relative group">

            <div className="flex items-center cursor-pointer text-gray-700 hover:text-blue-600 group-hover:text-blue-600">
              Goal Planners <ChevronDown size={18} className="ml-1" />
            </div>

            {/* GAP FIX */}
            <div className="absolute left-0 top-full h-2 w-full"></div>

            {/* DROPDOWN BOX */}
            <div className="absolute hidden group-hover:block bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">

              <ul className="py-2 text-[15px]">

                {[
                  ["Dream-home", "Dream Home"],
                  ["Wealth-Creation", "Wealth Creation"],
                  ["Retiremen", "Retirement"],
                  ["Child-Education", "Child's Education"],
                  ["Child-Wedding", "Child's Wedding"],
                  ["Emergency", "Emergency"],
                  
                ].map(([url, label], index) => (
                  <li
                    key={index}
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200"
                  >
                    <Link
                      href={`/Goal_Planners/${url}`}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}

              </ul>
            </div>
          </div>

          <Link href="/contact" className={`relative pb-1 ${pathname === "/contact" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}>Contact</Link>

          <Link
            href="/login"
           className={`relative pb-1 ${pathname === "/login" ? "text-blue-600 after:w-full" : "after:w-0"} after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}
          >
            Login
          </Link>

        </div>

        {/* MOBILE TOGGLE */}
        <button className="lg:hidden text-gray-700 ml-4" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t animate-fadeIn">
          <div className="flex flex-col items-center py-4 space-y-3">

            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/Services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/Product" onClick={() => setMenuOpen(false)}>Products</Link>

            {/* MOBILE DROPDOWN */}
            <button
              onClick={() => setCalcOpen(!calcOpen)}
              className="text-gray-700 flex items-center gap-1"
            >
              Calculators <ChevronDown size={18} />
            </button>

            {calcOpen && (
              <div className="w-full px-4 space-y-2 animate-fadeIn">
                {[
                  ["sip-return", "SIP Return Calculator"],
                  ["crorepati", "Become a Crorepati Calculator"],
                  ["sip-step-up", "SIP Step-Up Calculator"],
                  ["emi", "EMI Calculator"],
                  ["target-sip", "Target Amount SIP Calculator"],
                ].map(([url, label], index) => (
                  <Link key={index} href={`/${url}`} onClick={() => setMenuOpen(false)}>
                    <p className="bg-gray-100 p-2 rounded-md text-center">{label}</p>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/Insurance" onClick={() => setMenuOpen(false)}>Insurance</Link>
            <Link href="/financial-planning" onClick={() => setMenuOpen(false)}>Financial Planning</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Login
              </button>
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}
