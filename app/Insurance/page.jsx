"use client";
import { useState } from "react";
import { Shield, Check, ArrowRight, Heart, Umbrella } from "lucide-react";

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState("life");

  const plans = {
    life: [
      {
        name: "HDFC Life Click 2 Protect",
        company: "HDFC Life",
        coverage: "₹1 Cr",
        premium: "₹8,500/year",
        features: [
          "Pure term plan",
          "Online discount",
          "Return of premium option",
          "Critical illness rider",
        ],
      },
      {
        name: "ICICI Pru iProtect Smart",
        company: "ICICI Prudential",
        coverage: "₹1 Cr",
        premium: "₹9,200/year",
        features: [
          "Life cover",
          "Accidental death benefit",
          "Premium waiver",
          "Flexible payout options",
        ],
      },
      {
        name: "SBI Life eShield",
        company: "SBI Life",
        coverage: "₹1 Cr",
        premium: "₹8,800/year",
        features: [
          "Affordable premiums",
          "Tax benefits",
          "Terminal illness cover",
          "Income benefit option",
        ],
      },
    ],
    health: [
      {
        name: "Star Health Comprehensive",
        company: "Star Health",
        coverage: "₹25 Lakh",
        premium: "₹10,500/year",
        features: [
          "Cashless hospitalization",
          "Pre & post hospitalization cover",
          "No-claim bonus benefits",
          "Free health check-up",
        ],
      },
      {
        name: "HDFC ERGO Health Suraksha",
        company: "HDFC ERGO",
        coverage: "₹20 Lakh",
        premium: "₹9,800/year",
        features: [
          "Family floater plan",
          "Ambulance charges covered",
          "AYUSH treatment cover",
          "Unlimited restoration benefit",
        ],
      },
      {
        name: "Care Health Insurance",
        company: "Care Health",
        coverage: "₹15 Lakh",
        premium: "₹8,600/year",
        features: [
          "Cashless hospitals network",
          "Health checkups",
          "No room rent limit",
          "Tax saving under Section 80D",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      <div className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Insurance<span className="text-yellow-300"> Plans</span></h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Protect what matters most with comprehensive insurance coverage for you and your family.
        </p>
      </div>

     
      <div className="flex justify-center mt-8">
        <div className="bg-gray-100 rounded-xl p-1 flex space-x-2">
          <button
            onClick={() => setActiveTab("life")}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === "life"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Life Insurance
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === "health"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Health Insurance
          </button>
        </div>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10 pb-20 px-6">
        {plans[activeTab].map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Shield className="text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{plan.company}</p>

            <div className="flex justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">Coverage</p>
                <p className="text-blue-600 font-semibold">{plan.coverage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Premium</p>
                <p className="text-gray-800 font-semibold">{plan.premium}</p>
              </div>
            </div>

            <ul className="text-gray-600 text-sm mb-6 space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check size={16} className="text-blue-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
              <span>Get Quote</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Insurance Matters</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-10">
          Protect your family’s financial future against life’s uncertainties.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <Shield className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="font-semibold text-gray-800 mb-2">Financial Security</h3>
            <p className="text-gray-500 text-sm">
              Ensure your loved ones are financially protected even in your absence.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <Heart className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="font-semibold text-gray-800 mb-2">Health Protection</h3>
            <p className="text-gray-500 text-sm">
              Cover medical expenses without depleting your savings.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <Umbrella className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="font-semibold text-gray-800 mb-2">Peace of Mind</h3>
            <p className="text-gray-500 text-sm">
              Live worry-free knowing you’re prepared for emergencies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
