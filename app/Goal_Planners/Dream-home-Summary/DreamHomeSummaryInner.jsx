"use client";

import React, { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DreamHomeSummaryInner() {
  
 const search = useSearchParams();

const investmentType = search.get("investmentType") || "SIP";
const riskTolerance = search.get("risk") || "Conservative";
const timeHorizon = Number(search.get("years") || 0);
const targetAmount = Number(search.get("futureValue") || 0);
const sipAmount = Number(search.get("sip") || 0);



  const pieData = useMemo(() => {
    
    const invested = 57;
    const growth = 43;
    return {
      labels: ["SIP Invested Amount", "Growth Amount"],
      datasets: [
        {
          data: [invested, growth],
          backgroundColor: ["#93C5FD", "#3B82F6"]
        }
      ]
    };
  }, []);

  const pieOptions = {
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  
  const [funds, setFunds] = useState([
    {
      id: 1,
      name: "Parag Parikh Conservative Hybrid Fund Reg Gr",
      category: "Hybrid: Conservative",
      nav: 15.3916,
      returns: { y1: 1.7, y3: 8.03, y5: 6.2 },
      allocation: 18.75,
      amount: 8000
    },
    {
      id: 2,
      name: "ICICI Pru Equity & Debt Gr",
      category: "Hybrid: Aggressive",
      nav: 411.92,
      returns: { y1: 11.9, y3: 13.69, y5: 12.1 },
      allocation: 25,
      amount: 8000
    },
    {
      id: 3,
      name: "DSP Large Cap Fund Reg Gr",
      category: "Equity: Large Cap",
      nav: 488.318,
      returns: { y1: 4.1, y3: 8.68, y5: 9 },
      allocation: 31.25,
      amount: 8000
    },
    {
      id: 4,
      name: "Nippon India Multi Cap Gr Gr",
      category: "Equity: Multi Cap",
      nav: 305.2049,
      returns: { y1: 3.2, y3: 7.36, y5: 6.7 },
      allocation: 25,
      amount: 8000
    }
  ]);

  
  const [openModal, setOpenModal] = useState(false);
  const [selectedFundIndex, setSelectedFundIndex] = useState(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);

  // Modal scheme options (like website)
  const modalSchemes = [
    {
      id: 101,
      name: "HDFC Hybrid Debt Fund - Growth Plan",
      category: "Hybrid: Conservative",
      nav: 59.8404,
      y1: 6.15,
      y3: 10.09,
      y5: 10.56,
      allocation: 9.89,
      amount: 17500
    },
    {
      id: 102,
      name: "HSBC Conservative Hybrid Fund - Regular Growth",
      category: "Hybrid: Conservative",
      nav: 15.3916,
      y1: 5.62,
      y3: 9.92,
      y5: 8.23,
      allocation: 9.89,
      amount: 17500
    },
    {
      id: 103,
      name: "Parag Parikh Conservative Hybrid Fund - Regular Plan - Growth",
      category: "Hybrid: Conservative",
      nav: 27.9751,
      y1: 8.03,
      y3: 11.6,
      y5: "-",
      allocation: 12.43,
      amount: 22000
    }
  ];

  // update selected scheme id helper
  function chooseScheme(id) {
    setSelectedSchemeId(id);
  }

  function openChangeScheme(index) {
    setSelectedFundIndex(index);
    setSelectedSchemeId(null);
    setOpenModal(true);
  }

  function updateScheme() {
    if (selectedFundIndex === null) {
      alert("Please open a scheme row to change.");
      return;
    }
    if (!selectedSchemeId) {
      alert("Please select a scheme from the modal first.");
      return;
    }

    const scheme = modalSchemes.find((s) => s.id === selectedSchemeId);
    if (!scheme) {
      alert("Selected scheme not found.");
      return;
    }

    const updated = [...funds];
    updated[selectedFundIndex] = {
      ...updated[selectedFundIndex],
      name: scheme.name,
      category: scheme.category,
      nav: scheme.nav,
      allocation: scheme.allocation,
      amount: scheme.amount,
      returns: { y1: scheme.y1, y3: scheme.y3, y5: scheme.y5 }
    };

    setFunds(updated);
    setOpenModal(false);
    setSelectedFundIndex(null);
    setSelectedSchemeId(null);
  }

  // small helper for formatting numbers
  const fmt = (v) =>
    typeof v === "number" ? v.toLocaleString("en-IN") : String(v ?? "-");

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500  text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4 ">
                    <h1 className="text-4xl font-semibold text-white-900 mb-2">
                        Dream <span className="text-yellow-300">home </span>
                    </h1>
                    <div className="flex justify-center gap-2 text-sm text-white-600">
                        <Link href="/">Home</Link>

                        <span className="text-white-400">/</span>
                        <span>Goal</span>
                        <span className="text-white-400">/</span>
                        <span className="text-[white] font-medium">Dream home</span>
                    </div>
                </div>
      </section>

     
      <section className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 items-center text-center ">
            <div >
              <div className="text-sm text-white-500">Investment Type</div>
              <div className="text-[#3B82F6] font-semibold text-lg">{investmentType}</div>
            </div>

            <div >
              <div className="text-sm text-white-500">Risk Tolerance</div>
              <div className="text-[#3B82F6] font-semibold text-lg">{riskTolerance}</div>
            </div>

            <div >
              <div className="text-sm text-white-500">Time Horizon</div>
              <div className="text-[#3B82F6] font-semibold text-lg">{timeHorizon}</div>
            </div>

            <div >
              <div className="text-sm text-white-500">Target Amount</div>
              <div className="text-[#3B82F6] font-semibold text-lg">
                {fmt(targetAmount)}
              </div>
            </div>

            <div >
              <div className="text-sm text-white-500">SIP Amount</div>
              <div className="text-[#3B82F6] font-semibold text-lg">{fmt(sipAmount)}</div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="col-span-1">
              <div className="bg-white p-4">
                <div style={{ height: 200 }}>
                  <Pie data={pieData} options={pieOptions} />
                </div>

                <div className="flex gap-4 mt-3 items-center justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#93C5FD] inline-block rounded-sm" />
                    SIP Invested
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#3B82F6] inline-block rounded-sm" />
                    Growth Amount
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Objective</h3>
                <p className="text-gray-600 text-sm">
                  <strong className="text-[#3B82F6]">Conservative</strong> — Your primary concern is
                  capital preservation, portfolio stability and liquidity of your investments. Your
                  investment objective should be to get income or capital appreciation in line with
                  inflation expectations or slightly exceeding the inflation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Our Features</h3>
                <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                  <li>Zero Fee A/C - No Transaction Charges</li>
                  <li>Top AMCs under One Roof</li>
                  <li>Personalized Recommendation</li>
                  <li>One Account to Manage Family Members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="max-w-6xl mx-auto px-6 mt-4 pb-16">
        <div className="bg-white rounded-lg shadow-xl p-6 mt-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Recommended Funds</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#3B82F6]  border-b text-white">
                  <th className="p-3">Scheme Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">NAV</th>
                  <th className="p-3">Return (1Y)</th>
                  <th className="p-3">Return (3Y)</th>
                  <th className="p-3">Return (5Y)</th>
                  <th className="p-3">Allocation (%)</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>

              <tbody>
                {funds.map((f, idx) => (
                  <tr key={f.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center justify-between">
                        <div>{f.name}</div>
                        <div>
                          <button
                            onClick={() => openChangeScheme(idx)}
                            className="text-blue-600 underline text-sm ml-4"
                          >
                            Change Scheme
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">{f.category}</td>
                    <td className="p-4">{f.nav}</td>
                    <td className="p-4">{f.returns.y1}</td>
                    <td className="p-4">{f.returns.y3}</td>
                    <td className="p-4">{f.returns.y5}</td>
                    <td className="p-4">{f.allocation}%</td>
                    <td className="p-4">₹ {f.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* total amount & buttons */}
          <div className="flex items-center justify-end mt-6 gap-4">
            <div className="bg-gray-100 p-4 rounded text-right">
              <div className="text-sm">Total Amount</div>
              <div className="text-2xl font-semibold">
                ₹ {funds.reduce((s, it) => s + (it.amount || 0), 0).toLocaleString()}
              </div>
            </div>

            <div>
              <button className="px-4 py-2 border rounded mr-3">Back</button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded">Save Your Goal</button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Change the Scheme Name */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
          <div className="bg-white w-[90%] max-w-4xl rounded shadow-lg overflow-y-auto max-h-[85vh]">
            <div className="bg-[#3B82F6] text-white px-6 py-4 rounded-t">
              <h3 className="text-2xl">Change the Scheme Name</h3>
            </div>

            <div className="p-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Scheme Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">1 Yr</th>
                    <th className="p-3">3 Yrs</th>
                    <th className="p-3">5 Yrs</th>
                    <th className="p-3">Select</th>
                  </tr>
                </thead>

                <tbody>
                  {modalSchemes.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.category}</td>
                      <td className="p-3">{s.y1}</td>
                      <td className="p-3">{s.y3}</td>
                      <td className="p-3">{s.y5}</td>
                      <td className="p-3 text-center">
                        <input
                          type="radio"
                          name="modalScheme"
                          checked={selectedSchemeId === s.id}
                          onChange={() => chooseScheme(s.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* modal actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setOpenModal(false);
                    setSelectedSchemeId(null);
                    setSelectedFundIndex(null);
                  }}
                  className="px-5 py-2 bg-gray-300 rounded"
                >
                  Close
                </button>

                <button onClick={updateScheme} className="px-5 py-2 bg-blue-700 text-white rounded">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
