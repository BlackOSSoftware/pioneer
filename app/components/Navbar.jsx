"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  const rawPath = usePathname();
  const pathname = (rawPath ?? "/");

  const handleCloseAll = () => {
    setMenuOpen(false);
    setCalcOpen(false);
    setPlannerOpen(false);
  };

  return (
    <div >
<nav className="
  fixed top-0 left-0 right-0 z-50
  bg-white/3
  backdrop-blur-md
  
  text-white
">





        <div className="max-w-7xl mx-auto flex items-center px-6 py-3 ml-2">

          {/* LOGO */}
          <div className="flex-shrink-0 -ml-3">
            <Link href="/" onClick={handleCloseAll} className="flex items-center gap-2">
              <Image
      src="/newlogo.png" // rename this uploaded image as logopo.png in /public
      alt="Pioneer Wealth Solutions Logo"
      width={180}
      height={190}
      priority
      className="object-contain drop-shadow-sm"
    
  />
              
            </Link>
          </div>

          <div className="flex-grow"></div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-6 -mr-40">

            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/Services", "Services"],
              ["/Product", "Products"],
              ["/Insurance", "Insurance"],
              ["/financial-planning", "Financial Planning"],
            ].map(([url, label]) => (
              <Link
  key={url}
  href={url}
  className={`
    relative flex items-center 
    transition-all duration-300 cursor-pointer

    ${pathname === url
      ? "text-blue-600  after:w-full"
      : "text-black hover:text-blue-600  after:w-0"
    }

    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all
    hover:after:w-full
  `}
>
  {label}
</Link>

            ))}

            {/* DESKTOP - CALCULATORS */}
            <div className="relative">
              <div
  className={`
    relative flex items-center cursor-pointer transition-all duration-300  space-x-6
    ${pathname.includes("calculators")
      ? "text-blue-600  after:w-full"
      : "text-black hover:text-blue-600  after:w-0"
    }
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full
  `}
  onClick={() => {
    setCalcOpen(!calcOpen);
    setPlannerOpen(false);  // close planner
  }}
>
  Calculators
  <ChevronDown
    size={18}
    className={`ml-1 transition ${calcOpen ? "rotate-180" : ""}`}
  />
</div>

  



              {calcOpen && (
                <div className="absolute bg-white text-black shadow-xl mt-2 w-80 border border-gray-300 rounded-md z-50">
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
                        <Link
                          href={`/Calculators/${url}`}
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600"
                          onClick={handleCloseAll}
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* DESKTOP - GOAL PLANNERS */}
            <div className="relative">
              <div
  className={`
    relative flex items-center cursor-pointer transition-all duration-300 space-x-6
    ${pathname.includes("goal_planners")
      ? "text-blue-600  after:w-full"
      : "text-black hover:text-blue-600  after:w-0"
    }
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full
  `}
  onClick={() => {
    setPlannerOpen(!plannerOpen);
    setCalcOpen(false); // close calculators
  }}
>
  Goal Planners
  <ChevronDown
    size={18}
    className={`ml-1 transition ${plannerOpen ? "rotate-180" : ""}`}
  />
</div>



              {plannerOpen && (
                <div className="absolute bg-white shadow-xl mt-2 w-80 border text-black border-gray-300 rounded-md z-50">
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
                        <Link
                          href={`/Goal_Planners/${url}`}
                          className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600"
                          onClick={handleCloseAll}
                        >
                          {text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link
  href="/contact"
  className={`
    relative flex items-center 
    transition-all duration-300 cursor-pointer space-x-6

    ${pathname === "/contact"
      ? "text-blue-600  after:w-full"
      : "text-black hover:text-blue-600  after:w-0"
    }

    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all
    hover:after:w-full
  `}
>
  Contact
</Link>


            <Link
              href="/login"
              className={`
    relative flex items-center 
    transition-all duration-300 cursor-pointer space-x-6

    ${pathname === "/login"
      ? "text-blue-600  after:w-full"
      : "text-black hover:text-blue-600  after:w-0"
    }

    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-600 after:transition-all
    hover:after:w-full
  `}
            >
              Login
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button className="lg:hidden text-gray-900 ml-4" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
      <div className="lg:hidden bg-white shadow-md border-t text-black animate-fadeIn max-h-[90vh] overflow-y-auto mt-22">

          <div className="flex flex-col items-center py-4 space-y-3">
            <Link href="/" onClick={handleCloseAll} className="text-black">Home</Link>
            <Link href="/about" onClick={handleCloseAll}>About</Link>
            <Link href="/Services" onClick={handleCloseAll}>Services</Link>
            <Link href="/Product" onClick={handleCloseAll}>Products</Link>

            {/* MOBILE - CALCULATORS */}
            <button
              onClick={() => { setCalcOpen(!calcOpen); if (plannerOpen) setPlannerOpen(false); }}
              className="flex items-center gap-1"
            >
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
            <button
              onClick={() => { setPlannerOpen(!plannerOpen); if (calcOpen) setCalcOpen(false); }}
              className="flex items-center gap-1"
            >
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
    </div>
  );
}
