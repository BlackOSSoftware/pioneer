"use client";
import { useState } from "react";

export default function MutualFunds() {

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fundHouseFilter, setFundHouseFilter] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);

 
  const mutualFunds = [
    {
      id: 1,
      name: "HDFC Equity Fund",
      house: "HDFC MF",
      category: "Equity",
      returns: "18.5%",
      risk: "High",
      color: "blue",
    },
    {
      id: 2,
      name: "SBI Bluechip Fund",
      house: "SBI MF",
      category: "Large Cap",
      returns: "14.2%",
      risk: "Moderate",
      color: "green",
    },
    {
      id: 3,
      name: "Axis Small Cap Fund",
      house: "Axis MF",
      category: "Small Cap",
      returns: "22.1%",
      risk: "High",
      color: "indigo",
    },
  ];

  // ---------- FILTER LOGIC ----------
  const filteredFunds = mutualFunds.filter((fund) => {
    const matchesSearch = fund.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || fund.category === categoryFilter;
    const matchesHouse =
      fundHouseFilter === "All" || fund.house === fundHouseFilter;
    return matchesSearch && matchesCategory && matchesHouse;
  });

  // ---------- FUND CARD COMPONENT ----------
  function FundCard({ name, house, category, returns, risk, color }) {
    return (
      <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex items-center justify-between overflow-hidden">
        
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-b-2xl"></div>

       
        <div className="flex items-center gap-4 z-10">
          <div
            className={`bg-${color}-100 text-${color}-600 w-12 h-12 flex items-center justify-center rounded-xl`}
          >
            <i className="fa-solid fa-chart-line text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm">{house}</p>
          </div>
        </div>

       
        <div className="flex items-center gap-10 text-sm z-10">
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-semibold text-gray-800">{category}</p>
          </div>
          <div>
            <p className="text-gray-500">Returns (1Y)</p>
            <p className="font-semibold text-green-600">{returns}</p>
          </div>
          <div>
            <p className="text-gray-500">Risk</p>
            <p
              className={`font-semibold ${
                risk === "High"
                  ? "text-red-500"
                  : risk === "Moderate"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {risk}
            </p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md">
            Invest Now <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  }

  // ---------- FAQ DATA ----------
  const faqs = [
    {
      id: 1,
      question: "What are Mutual Funds?",
      answer:
        "Mutual funds are investment vehicles that pool money from multiple investors to invest in diversified portfolios like equities, bonds, and other securities, managed by professional fund managers.",
    },
    {
      id: 2,
      question: "Why should I invest in Mutual Funds?",
      answer:
        "They offer diversification, professional management, liquidity, and potential for better long-term returns compared to traditional savings instruments.",
    },
    {
      id: 3,
      question: "Are Mutual Funds risky?",
      answer:
        "All investments carry some risk, but mutual funds allow investors to manage risk by diversifying across multiple assets and selecting funds that align with their risk appetite.",
    },
  ];

  // ---------- MAIN RETURN ----------
  return (
    <div className="bg-white">
      <section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      <section className="py-20 px-6 mx-6 md:mx-12 mt-5 bg-gradient-to-r from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg mb-16 pb-5 pt-5">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Mutual <span className="text-yellow-300">Funds</span>
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto">
          Discover the best mutual fund options curated by our experts for optimal returns.
        </p>
      </section>

      
      <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-center gap-4 px-6">
        <input
          type="text"
          placeholder="Search mutual funds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl text-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Equity</option>
          <option>Large Cap</option>
          <option>Small Cap</option>
        </select>

        <select
          value={fundHouseFilter}
          onChange={(e) => setFundHouseFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>HDFC MF</option>
          <option>SBI MF</option>
          <option>Axis MF</option>
        </select>
      </div>

      
      <section className="max-w-6xl mx-auto px-6 pb-20 space-y-6">
        {filteredFunds.map((fund) => (
          <FundCard key={fund.id} {...fund} />
        ))}
        {filteredFunds.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-10">
            No mutual funds found matching your filters.
          </p>
        )}
      </section>

      
      <section className="max-w-5xl mx-auto text-center bg-blue-50 py-12 px-6 rounded-3xl shadow-inner mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Need Help Choosing?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Our experts can help you select the right mutual funds based on your goals and risk appetite.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 shadow-md transition-all duration-300">
          Request Consultation
        </button>
      </section>

      
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
          Understanding Mutual Funds
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() =>
                  setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                }
                className="w-full flex justify-between items-center text-left px-6 py-4 text-gray-800 font-medium"
              >
                {faq.question}
                <i
                  className={`fa-solid fa-chevron-${
                    openFAQ === faq.id ? "up" : "down"
                  } text-gray-500`}
                ></i>
              </button>

              {openFAQ === faq.id && (
                <p className="px-6 pb-4 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
