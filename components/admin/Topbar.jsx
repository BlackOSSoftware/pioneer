"use client";

import { Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white shadow-sm">
            P
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight text-slate-900">Admin</h2>
            <p className="text-xs text-slate-500">Pioneer Wealth Solutions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-56 sm:block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600" title="Profile">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
