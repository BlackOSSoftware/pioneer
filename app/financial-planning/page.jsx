"use client";
import { useState, useEffect } from "react";
import { Target, Calculator } from "lucide-react";

export default function FinancialPlanningPage() {
  const [activeTab, setActiveTab] = useState("sip");
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, years, rate]);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const n = 12;
    const R = rate / 100;
    const t = years;
    const A =
      (P * ((Math.pow(1 + R / n, n * t) - 1) * (1 + R / n))) / (R / n);
    const total = P * n * t;
    const returns = A - total;
    setTotalInvestment(total);
    setEstimatedReturns(returns);
    setMaturityValue(A);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-16 shadow-md">
        <div className="flex justify-center mb-4">
          <Target size={42} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Financial Planning
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Plan your financial future with our expert guidance and powerful calculators.
        </p>
      </div>

      {/* Financial Calculators Section */}
      <section className="max-w-6xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Financial Calculators
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Use our interactive tools to plan your investments and understand your returns.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-xl p-1 flex space-x-2 border border-gray-200">
            {["sip", "retirement", "loan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {tab === "sip" && "SIP Calculator"}
                {tab === "retirement" && "Retirement"}
                {tab === "loan" && "Loan EMI"}
              </button>
            ))}
          </div>
        </div>

        {/* ====================== SIP Calculator ====================== */}
        {activeTab === "sip" && (
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Side - Sliders */}
              <div>
                {/* Monthly Investment */}
                <div className="mb-10">
                  <label className="block text-gray-800 font-semibold mb-2">
                    Monthly Investment
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value))
                    }
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-gray-500 text-sm mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                  </div>
                  <div className="text-right text-blue-600 font-semibold text-lg mt-1">
                    ₹{monthlyInvestment.toLocaleString()}
                  </div>
                </div>

                {/* Time Period */}
                <div className="mb-10">
                  <label className="block text-gray-800 font-semibold mb-2">
                    Time Period
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-gray-500 text-sm mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                  <div className="text-right text-blue-600 font-semibold text-lg mt-1">
                    {years} Years
                  </div>
                </div>

                {/* Expected Return */}
                <div className="mb-6">
                  <label className="block text-gray-800 font-semibold mb-2">
                    Expected Return (p.a.)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-gray-500 text-sm mt-1">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                  <div className="text-right text-blue-600 font-semibold text-lg mt-1">
                    {rate}% p.a.
                  </div>
                </div>
              </div>

              {/* Right Side - Results */}
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                  <p className="text-gray-500 text-sm">Total Investment</p>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    ₹{totalInvestment.toLocaleString()}
                  </h2>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                  <p className="text-gray-500 text-sm">Estimated Returns</p>
                  <h2 className="text-2xl font-semibold text-green-600">
                    ₹{estimatedReturns.toLocaleString()}
                  </h2>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md border border-blue-400">
                  <p className="text-blue-100 text-sm">Maturity Value</p>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    ₹{maturityValue.toLocaleString()}
                  </h2>
                </div>

                <p className="text-xs text-gray-400 mt-2 text-center md:text-left">
                  *Returns are indicative and subject to market conditions.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ====================== Talk to Our Experts Section ====================== */}
      <section className="max-w-6xl mx-auto mt-16 bg-white border border-gray-200 rounded-2xl shadow-lg p-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Info Side */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Talk to Our Experts
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Get personalized financial planning advice tailored to your unique goals
              and circumstances. Our certified financial planners are here to help you
              build a secure future.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Goal-Based Planning
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Achieve your dreams systematically
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <Calculator size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Wealth Optimization
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Maximize your returns efficiently
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-inner">
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 xxxxx xxxxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Financial Goals
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your financial objectives..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
              >
                Get Free Consultation →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
