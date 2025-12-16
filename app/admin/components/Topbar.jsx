"use client";

import { Search, User, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Topbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = theme === "light";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
    setTheme(isDark ? "dark" : "light");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        h-16 z-50
        bg-white dark:bg-slate-900
        border-b border-gray-200 dark:border-slate-700
      "
    >
      <div className="flex items-center justify-between h-full px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3 -mt-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
              P
            </div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Admin Panel
            </h2>
          </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="relative hidden sm:block w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search..."
              className="
                w-full pl-9 pr-3 py-2 text-sm rounded-lg
                bg-gray-50 dark:bg-slate-800
                border border-gray-300 dark:border-slate-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

         
          

          {/* PROFILE */}
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <User size={16} />
          </div>

        </div>
      </div>
    </header>
  );
}
