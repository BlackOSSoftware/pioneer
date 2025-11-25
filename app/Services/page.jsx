"use client";

import { useState } from "react";

export default function Services() {
  
  const [activeCategory, setActiveCategory] = useState("All");

  // ---------- SERVICE DATA ----------
  const services = [
    {
      id: 1,
      title: "Mutual Funds",
      description:
        "We help you invest smartly in top-rated mutual funds to grow your wealth with expert market insights.",
      icon: "fa-chart-line",
      color: "blue",
      category: "Investment",
    },
    {
      id: 2,
      title: "Life Insurance",
      description:
        "Secure your family's financial future with personalized life insurance plans that match your goals.",
      icon: "fa-shield-heart",
      color: "green",
      category: "Insurance",
    },
    {
      id: 3,
      title: "Health Insurance",
      description:
        "Protect yourself and your family with our comprehensive health insurance options.",
      icon: "fa-heart-pulse",
      color: "red",
      category: "Insurance",
    },
    {
      id: 4,
      title: "Tax Planning",
      description:
        "Strategic tax optimization to help you save more while staying compliant with regulations.",
      icon: "fa-file-invoice-dollar",
      color: "yellow",
      category: "Tax",
      features: [
        "Tax saving investments",
        "ITR filing assistance",
        "80C to 80U deductions",
        "Long-term tax strategy",
      ],
    },
    {
      id: 5,
      title: "Financial Advisory",
      description:
        "Personalized wealth management strategies aligned with your long-term financial goals.",
      icon: "fa-briefcase",
      color: "orange",
      category: "Advisory",
      features: [
        "Goal-based planning",
        "Risk assessment",
        "Portfolio diversification",
        "Regular monitoring",
      ],
    },
    {
      id: 6,
      title: "Retirement Planning",
      description:
        "Build a robust retirement corpus to enjoy your golden years without financial worries.",
      icon: "fa-piggy-bank",
      color: "green",
      category: "Advisory",
      features: [
        "NPS & EPF planning",
        "Pension schemes",
        "Retirement calculator",
        "Corpus building strategy",
      ],
    },
  ];

  // ---------- FILTER LOGIC ----------
  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);


  function ServiceCard({ icon, color, title, description, features }) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between">
      
        <div>
          <div
            className={`bg-${color}-100 text-${color}-600 w-14 h-14 flex items-center justify-center rounded-xl mb-5`}
          >
            <i className={`fa-solid ${icon} text-2xl`}></i>
          </div>
         
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-4">
            {description}
          </p>

       
          {features && (
            <ul className="text-gray-600 text-sm space-y-2 mb-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-blue-600 mt-1"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="mt-auto bg-blue-600 text-white w-full py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
          Enquire Now <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    );
  }

  // ---------- CATEGORY BUTTON COMPONENT ----------
  function CategoryButton({ label }) {
    const isActive = activeCategory === label;
    return (
      <button
        onClick={() => setActiveCategory(label)}
        className={`px-6 py-2 rounded-full font-medium border transition-all ${
          isActive
            ? "bg-blue-600 text-white border-blue-600 shadow-md"
            : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
        }`}
      >
        {label}
      </button>
    );
  }

  // ---------- PAGE RETURN ----------
  return (
    <>
     
      <section className="py-20 px-6 mx-6 md:mx-12 mt-17 bg-gradient-to-r from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg mb-16 pb-5 pt-5">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Our <span className="text-yellow-300">Services</span>
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto">
          Comprehensive financial solutions tailored to your unique needs and goals.
        </p>
      </section>

      {/* ---------- FILTER BUTTONS ---------- */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["All", "Investment", "Insurance", "Tax", "Advisory"].map((cat) => (
          <CategoryButton key={cat} label={cat} />
        ))}
      </div>

      
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            color={service.color}
            title={service.title}
            description={service.description}
            features={service.features}
          />
        ))}
      </section>
    </>
  );
}
