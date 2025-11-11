"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FileText,
  Users,
  ShoppingBag,
  Briefcase,
  ClipboardList,
  Quote,
  CreditCard,
  TrendingUp,
  TrendingDown,
  PlusCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const sidebarMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Pages", icon: FileText },
    { name: "Services", icon: Briefcase },
    { name: "Products", icon: ShoppingBag },
    { name: "Insurance", icon: ClipboardList },
    { name: "Leads", icon: Users },
    { name: "Testimonials", icon: Quote },
    { name: "Visiting Cards", icon: CreditCard },
    { name: "Settings", icon: Settings },
  ];

  const metrics = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: "856",
      change: "+8.2%",
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Blog Posts",
      value: "42",
      change: "+3",
      trend: "up",
      color: "text-purple-600",
    },
    {
      title: "Conversions",
      value: "89",
      change: "-2.1%",
      trend: "down",
      color: "text-orange-600",
    },
  ];

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

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
        <div>
          {/* Logo Section */}
          <div className="flex items-center space-x-2 p-6 border-b border-gray-100">
            <div className="bg-blue-600 text-white rounded-lg w-9 h-9 flex items-center justify-center font-bold text-lg shadow-sm">
              P
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Panel
            </h2>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-6 space-y-1 px-3">
            {sidebarMenu.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeMenu === item.name
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    activeMenu === item.name ? "text-white" : "text-gray-500"
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center text-red-500 hover:bg-red-50 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mb-8">
          Welcome back! Here's what's happening with your platform.
        </p>

        {/* ---------- METRICS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${metric.color}`}>
                  {metric.title}
                </span>
                {metric.trend === "up" ? (
                  <TrendingUp className="text-green-500 w-4 h-4" />
                ) : (
                  <TrendingDown className="text-red-500 w-4 h-4" />
                )}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {metric.value}
              </div>
              <div
                className={`text-sm ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* ---------- BOTTOM SECTION ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Leads
              </h3>
              <button className="text-sm text-blue-600 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentLeads.map((lead, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-none last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center font-semibold rounded-full">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">
                        {lead.name}
                      </h4>
                      <p className="text-gray-500 text-xs">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 text-sm">{lead.plan}</p>
                    <p className="text-gray-400 text-xs">{lead.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm">
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Blog
              </button>
              <button className="flex items-center justify-center w-full py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                <Briefcase className="w-4 h-4 mr-2 text-gray-600" /> Add Service
              </button>
              <button className="flex items-center justify-center w-full py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                <ShoppingBag className="w-4 h-4 mr-2 text-gray-600" /> Add Product
              </button>
              <button className="flex items-center justify-center w-full py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                <Users className="w-4 h-4 mr-2 text-gray-600" /> View All Leads
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
