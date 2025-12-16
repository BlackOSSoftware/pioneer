"use client";

import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Briefcase,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= METRICS DATA ================= */
const metrics = [
  { title: "Total Leads", value: "1,234", change: "+12.5%", trend: "up" },
  { title: "Active Users", value: "856", change: "+8.2%", trend: "up" },
  { title: "Blog Posts", value: "42", change: "+3", trend: "up" },
  { title: "Conversions", value: "89", change: "-2.1%", trend: "down" },
];

/* ================= RECENT LEADS ================= */
const recentLeads = [
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    plan: "Mutual Funds",
    time: "2 hours ago",
  },
  {
    name: "Priya Desai",
    email: "priya@example.com",
    plan: "Life Insurance",
    time: "5 hours ago",
  },
  {
    name: "Amit Kumar",
    email: "amit@example.com",
    plan: "Tax Planning",
    time: "1 day ago",
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      {/* ================= PAGE HEADING ================= */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Dashboard Overview
      </h1>

      {/* ================= METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="
              bg-white dark:bg-slate-900
              border border-gray-200 dark:border-slate-700
              rounded-xl p-6
              cursor-pointer
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </span>
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>

            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {metric.value}
            </div>

            <div
              className={`text-sm font-medium ${
                metric.trend === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* -------- RECENT LEADS -------- */}
        <div
          className="
            lg:col-span-2
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-700
            rounded-xl p-6
            transition-all duration-300
            hover:shadow-lg
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Leads
            </h3>
            <button
              onClick={() => router.push("/admin/leads")}
              className="
                text-sm text-blue-600
                hover:underline
                hover:text-blue-700
              "
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead, i) => (
              <div
                key={i}
                className="
                  flex justify-between items-center
                  border-b border-gray-200 dark:border-slate-700
                  pb-3 last:border-none
                  px-2 py-2 rounded-lg
                  transition
                  hover:bg-gray-50 dark:hover:bg-slate-800
                "
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    {lead.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {lead.plan}
                  </p>
                  <p className="text-xs text-gray-400">{lead.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------- QUICK ACTIONS -------- */}
        <div
          className="
            bg-white dark:bg-slate-900
            border border-gray-200 dark:border-slate-700
            rounded-xl p-6
            transition-all duration-300
            hover:shadow-lg
          "
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/blogs/new")}
              className="
                flex items-center justify-center w-full py-2
                bg-blue-600 text-white rounded-lg font-medium
                transition-all duration-300
                hover:bg-blue-700 hover:shadow-md hover:scale-[1.02]
              "
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Blog
            </button>

            <button
              onClick={() => router.push("/admin/services/new")}
              className="
                flex items-center justify-center w-full py-2
                border border-gray-300 dark:border-slate-600
                rounded-lg text-gray-700 dark:text-gray-200
                transition-all duration-300
                hover:bg-gray-50 dark:hover:bg-slate-800
                hover:shadow hover:scale-[1.02]
              "
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Add Service
            </button>

            <button
              onClick={() => router.push("/admin/products/new")}
              className="
                flex items-center justify-center w-full py-2
                border border-gray-300 dark:border-slate-600
                rounded-lg text-gray-700 dark:text-gray-200
                transition-all duration-300
                hover:bg-gray-50 dark:hover:bg-slate-800
                hover:shadow hover:scale-[1.02]
              "
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add Product
            </button>

            <button
              onClick={() => router.push("/admin/leads")}
              className="
                flex items-center justify-center w-full py-2
                border border-gray-300 dark:border-slate-600
                rounded-lg text-gray-700 dark:text-gray-200
                transition-all duration-300
                hover:bg-gray-50 dark:hover:bg-slate-800
                hover:shadow hover:scale-[1.02]
              "
            >
              <Users className="w-4 h-4 mr-2" />
              View All Leads
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
