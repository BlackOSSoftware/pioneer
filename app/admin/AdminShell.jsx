"use client";

import { useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

/**
 * Locks admin to a consistent light UI: removes document `dark` while mounted so
 * public-site dark mode does not mix with admin styling.
 */
export default function AdminShell({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (hadDark) root.classList.add("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:ml-64">
        <Topbar />
        <main className="flex-1 p-3 pt-16 sm:p-4 sm:pt-16 md:p-6 md:pt-16">{children}</main>
      </div>
    </div>
  );
}
