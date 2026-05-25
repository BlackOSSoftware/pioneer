"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Share2,
  BookOpen,
  Package,
  Briefcase,
  Shield,
  MessageSquareText,
} from "lucide-react";

const sidebarMenu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "About — Who we are", href: "/admin/about-snippet", icon: BookOpen },
  { name: "Products", href: "/admin/products-manage", icon: Package },
  { name: "Services", href: "/admin/services-manage", icon: Briefcase },
  { name: "Insurance", href: "/admin/insurance-manage", icon: Shield },
  { name: "Enquiries (forms)", href: "/admin/inquiries", icon: MessageSquareText },
  { name: "Visiting Card Studio", href: "/admin/visiting-card-studio", icon: Share2 },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Contact List", href: "/admin/cotactlist", icon: FileText },
  { name: "Visiting Cards", href: "/admin/visiting-cards", icon: CreditCard },
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
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-200 bg-white shadow-sm md:flex">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Navigation</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
        {sidebarMenu.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-500"}`} strokeWidth={2} />
              <span className="leading-snug">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="m-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
      >
        <LogOut size={16} className="shrink-0" />
        Logout
      </button>
    </aside>
  );
}
