"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarMenu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Contact List", href: "/admin/cotactlist", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="
        fixed left-0 top-16
        w-64
        h-[calc(100vh-4rem)]
        bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-700
        flex flex-col
        z-40
      "
    >
      {/* ===== ADMIN MENU TITLE ===== */}
      <div className="px-4 py-3 dark:border-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Admin Menu
        </p>
      </div>

      {/* ===== MENU ===== */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {sidebarMenu.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <item.icon
                className={`w-4 h-4 ${
                  active ? "text-white" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ===== LOGOUT ===== */}
      <button
        onClick={handleLogout}
        className="
          m-4 flex items-center gap-2
          px-4 py-2 rounded-lg text-sm
          text-red-600
          hover:bg-red-100 dark:hover:bg-red-500/10
        "
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
