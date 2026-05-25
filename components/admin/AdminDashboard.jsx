"use client";

import { PlusCircle, Briefcase, ShoppingBag, Users, MessageSquareText, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";

const metrics = [
  { title: "Total Leads", value: "—", change: "Live data in Leads", trend: "up" },
  { title: "Form enquiries", value: "—", change: "See Enquiries", trend: "up" },
  { title: "Site sections", value: "4", change: "About, Products, Services, Insurance", trend: "up" },
  { title: "Status", value: "OK", change: "Mongo-backed CMS", trend: "up" },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{metric.title}</span>
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="mb-1 text-3xl font-bold text-slate-900">{metric.value}</div>
            <div className={`text-sm font-medium ${metric.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Shortcuts</h3>
            <button type="button" onClick={() => router.push("/admin/leads")} className="text-sm font-medium text-sky-600 hover:underline">
              Leads
            </button>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Manage public site content from the sidebar: About (Who we are), Products, Services, and Insurance. All lists are stored in
            MongoDB and persist across reloads.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick actions</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products-manage")}
              className="flex w-full items-center justify-center rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/services-manage")}
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Services
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/inquiries")}
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Form enquiries
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/leads")}
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Users className="mr-2 h-4 w-4" />
              Calculator leads
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/about-snippet")}
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              About — Who we are
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
