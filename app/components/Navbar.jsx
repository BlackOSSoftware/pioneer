"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
<<<<<<< HEAD
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const pathname = usePathname();
=======
  const [calcOpen, setCalcOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const rawPath = usePathname();
  const pathname = (rawPath ?? "/").toLowerCase();

  const handleCloseAll = () => {
    setMenuOpen(false);
    setCalcOpen(false);
    setPlannerOpen(false);
  };
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3

  return (
   <>
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 text-gray-900">
      <div className="max-w-7xl mx-auto flex items-center px-6 py-3">

<<<<<<< HEAD
        <div className="flex-shrink-0 -ml-5">
          <Link href="/" className="flex items-center gap-2">
=======
        {/* LOGO */}
        <div className="flex-shrink-0 -ml-20 ml-2">
          <Link href="/" className="flex items-center gap-2" onClick={handleCloseAll}>
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
            <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-lg flex items-center justify-center text-lg">
              P
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Pioneer Wealth
            </span>
          </Link>
        </div>

<<<<<<< HEAD
        <div className="flex-grow" />


        <div className="hidden lg:flex items-center space-x-8 -mr-20">
          {[
            ["", "Home"],
            ["about", "About"],
            ["Services", "Services"],
            ["Product", "Products"],
            ["Insurance", "Insurance"],
            ["financial-planning", "Financial Planning"],
          ].map(([url, label], i) => (
            <Link
              key={i}
              href={`/${url}`}
              className={`relative pb-1 ${pathname === `/${url}` ? "text-blue-600 after:w-full" : "after:w-0"
                } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}
            >
              {label}
            </Link>
          ))}


          <div className="relative group">
            <div className="flex items-center cursor-pointer text-gray-700 group-hover:text-blue-600">
              Calculators <ChevronDown size={18} className="ml-1" />
            </div>


            <div className="absolute left-0 top-full h-3 w-full"></div>

            <div className="
    absolute left-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-xl
    opacity-0 scale-95 translate-y-2 transition-all duration-200
    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
    pointer-events-auto z-50
  ">
              <ul className="py-2 text-[15px] max-h-[300px] overflow-y-auto">
=======
        <div className="flex-grow"></div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center space-x-8 -mr-20 text-gray-900">

          {/* TOP LINKS FIXED COLORS */}
          <Link href="/" 
            className={`relative pb-1 ${
              pathname === "/" 
                ? "text-blue-600 after:w-full" 
                : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Home
          </Link>

          <Link href="/about"
            className={`relative pb-1 ${
              pathname === "/about" 
                ? "text-blue-600 after:w-full" 
                : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            About
          </Link>

          <Link href="/Services"
            className={`relative pb-1 ${
              pathname === "/services" || pathname === "/services/" || pathname === "/Services" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Services
          </Link>

          <Link href="/Product"
            className={`relative pb-1 ${
              pathname === "/product" || pathname === "/product/" || pathname === "/Product" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Products
          </Link>

          <Link href="/Insurance"
            className={`relative pb-1 ${
              pathname === "/insurance" || pathname === "/insurance/" || pathname === "/Insurance" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Insurance
          </Link>

          <Link href="/financial-planning"
            className={`relative pb-1 ${
              pathname === "/financial-planning" || pathname === "/financial-planning/" ? "text-blue-600 after:w-full" : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Financial Planning
          </Link>

          {/* DROPDOWN — ONLY COLOR FIX */}
          <div className="relative group">
            <div className="flex items-center cursor-pointer text-gray-900 hover:text-blue-600">
              Calculators <ChevronDown size={18} className="ml-1" />
            </div>

            <div className="absolute left-0 top-full h-2 w-full"></div>

            <div className="absolute hidden group-hover:block bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">
              <ul className="py-2 text-[15px]">
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
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
                ].map(([url, label], i) => (
<<<<<<< HEAD
                  <li
                    key={i}
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200"
                  >
=======
                  <li key={i} 
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200">
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
                    <Link
                      href={`/Calculators/${url}`}
                      className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-gray-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

<<<<<<< HEAD



          <div className="relative group">
            <div className="flex items-center cursor-pointer text-gray-700 group-hover:text-blue-600">
              Goal Planners <ChevronDown size={18} className="ml-1" />
            </div>


            <div className="absolute left-0 top-full h-3 w-full"></div>

            <div
              className="absolute left-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-xl 
    opacity-0 scale-95 translate-y-2 transition-all duration-200 
    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 
    pointer-events-auto z-50"
            >
=======
          {/* GOAL PLANNER DROPDOWN COLOR FIX */}
          <div className="relative group">
            <div className="flex items-center cursor-pointer text-gray-900 hover:text-blue-600">
              Goal Planners <ChevronDown size={18} className="ml-1" />
            </div>

            <div className="absolute left-0 top-full h-2 w-full"></div>

            <div className="absolute hidden group-hover:block bg-white shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
              <ul className="py-2 text-[15px]">
                {[
                  ["Dream-home", "Dream Home"],
                  ["Wealth-Creation", "Wealth Creation"],
                  ["Retiremen", "Retirement"],
                  ["Child-Education", "Child's Education"],
                  ["Child-Wedding", "Child's Wedding"],
                  ["Emergency", "Emergency"],
                ].map(([url, label], i) => (
<<<<<<< HEAD
                  <li
                    key={i}
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200"
                  >
=======
                  <li key={i}
                    className="border-l-4 border-transparent hover:border-blue-600 border-b border-gray-200">
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
                    <Link
                      href={`/Goal_Planners/${url}`}
                      className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-gray-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

<<<<<<< HEAD


          <Link
            href="/contact"
            className={`relative pb-1 hover:text-blue-600 ${pathname === "/contact" ? "text-blue-600 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}
          >
            Contact
          </Link>

          <Link
            href="/login"
            className={`relative pb-1 hover:text-blue-600 ${pathname === "/login" ? "text-blue-600 after:w-full" : "after:w-0"
              } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300`}
          >
            Login
          </Link>
        </div>


        <button className="lg:hidden text-gray-700 ml-4" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu FIXED WITH SCROLL */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t animate-fadeIn max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col items-center py-4 space-y-3">

            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/Services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/Product" onClick={() => setMenuOpen(false)}>Products</Link>

            {/* Mobile Calculators */}
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "calc" ? null : "calc")}
              className=" flex items-center gap-1"
            >
              Calculators <ChevronDown size={18} />
            </button>

            {dropdownOpen === "calc" && (
              <div className="w-full px-4 space-y-2 animate-fadeIn">
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
                ].map(([url, label], i) => (
                  <Link key={i} href={`/Calculators/${url}`} onClick={() => setMenuOpen(false)}>
                    <p className="bg-gray-100 p-2 rounded-md text-center">{label}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Goal Planners */}
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "goal" ? null : "goal")}
              className=" flex items-center gap-1"
            >
              Goal Planners <ChevronDown size={18} />
            </button>

            {dropdownOpen === "goal" && (
              <div className="w-full px-4 space-y-2 animate-fadeIn">
                {[
                  ["Dream-home", "Dream Home"],
                  ["Wealth-Creation", "Wealth Creation"],
                  ["Retiremen", "Retirement"],
                  ["Child-Education", "Child's Education"],
                  ["Child-Wedding", "Child's Wedding"],
                  ["Emergency", "Emergency"],
                ].map(([url, label], i) => (
                  <Link key={i} href={`/Goal_Planners/${url}`} onClick={() => setMenuOpen(false)}>
                    <p className="bg-gray-100 p-2 rounded-md text-center">{label}</p>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/Insurance" onClick={() => setMenuOpen(false)}>Insurance</Link>
            <Link href="/financial-planning" onClick={() => setMenuOpen(false)}>Financial Planning</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</button>
            </Link>
          </div>
        </div>
      )}
=======
          <Link href="/contact"
            className={`relative pb-1 ${
              pathname === "/contact" || pathname === "/contact/" 
                ? "text-blue-600 after:w-full"
                : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Contact
          </Link>

          <Link href="/login"
            className={`relative pb-1 ${
              pathname === "/login" || pathname === "/login/" 
                ? "text-blue-600 after:w-full"
                : "text-gray-900 after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all`}>
            Login
          </Link>
        </div>

        {/* MOBILE ICON SAME */}
        <button className="lg:hidden text-gray-900 ml-4" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
>>>>>>> 3797b16022b2d11d256888619a30abb5d32106b3
    </nav>

    {/* MOBILE MENU - responsive behavior only, UI classes preserved */}
    {menuOpen && (
      <div className="lg:hidden bg-white shadow-md border-t animate-fadeIn" style={{ marginTop: 64 }}>
        <div className="flex flex-col items-center py-4 space-y-3 px-4 max-h-[calc(100vh-64px)] overflow-auto text-black">
          <Link href="/" onClick={handleCloseAll}>Home</Link>
          <Link href="/about" onClick={handleCloseAll}>About</Link>
          <Link href="/Services" onClick={handleCloseAll}>Services</Link>
          <Link href="/Product" onClick={handleCloseAll}>Products</Link>

          {/* MOBILE DROPDOWN */}
          <button
            onClick={() => {
              setCalcOpen(!calcOpen);
              if (plannerOpen) setPlannerOpen(false);
            }}
            className="text-gray-700 flex items-center gap-1"
          >
            Calculators <ChevronDown size={18} />
          </button>

          {calcOpen && (
            <div className="w-full px-4 space-y-2 animate-fadeIn ">
              {[
                ["sip-return", "SIP Return Calculator"],
                ["crorepati", "Become a Crorepati Calculator"],
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
                <Link key={index} href={`/Calculators/${url}`} onClick={handleCloseAll}>
                  <p className="bg-gray-100 p-2 rounded-md text-center">{label}</p>
                </Link>
              ))}
            </div>
          )}

          <Link href="/Insurance" onClick={handleCloseAll}>Insurance</Link>
          <Link href="/financial-planning" onClick={handleCloseAll}>Financial Planning</Link>

          {/* MOBILE DROPDOWN — Goal Planners (restored) */}
          <button
            onClick={() => {
              setPlannerOpen(!plannerOpen);
              if (calcOpen) setCalcOpen(false);
            }}
            className="text-gray-700 flex items-center gap-1"
          >
            Goal Planners <ChevronDown size={18} />
          </button>

          {plannerOpen && (
            <div className="w-full px-4 space-y-2 animate-fadeIn">
              {[
                ["Dream-home", "Dream Home"],
                ["Wealth-Creation", "Wealth Creation"],
                ["Retiremen", "Retirement"],
                ["Child-Education", "Child's Education"],
                ["Child-Wedding", "Child's Wedding"],
                ["Emergency", "Emergency"],
              ].map(([url, label], index) => (
                <Link key={index} href={`/Goal_Planners/${url}`} onClick={handleCloseAll}>
                  <p className="bg-gray-100 p-2 rounded-md text-center">{label}</p>
                </Link>
              ))}
            </div>
          )}

          <Link href="/contact" onClick={handleCloseAll}>Contact</Link>

          <Link href="/login" onClick={handleCloseAll}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Login
            </button>
          </Link>
        </div>
      </div>
    )}
   </>
  );
}
