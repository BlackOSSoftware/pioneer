"use client";

import React, { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { showAppModal } from "@/lib/pioneer-modal-bus";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const formatNum = (num) => {
  if (!num || isNaN(num)) return "₹ 0";
  return "₹ " + Math.round(num).toLocaleString("en-IN");
};

export default function FutureValueCalculator() {

  const [presentValue, setPresentValue] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Future Value Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const simulation = useMemo(() => {

    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;

    let balance = presentValue;
    let totalInvested = presentValue;

    const yearly = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance += monthlyContribution;
        totalInvested += monthlyContribution;
        balance *= 1 + monthlyRate;
      }

      yearly.push({
        year: y,
        invested: totalInvested,
        value: balance,
      });
    }

    return {
      totalInvested,
      totalValue: balance,
      growth: balance - totalInvested,
      yearly,
    };

  }, [presentValue, monthlyContribution, years, annualReturn]);

  const pieData = {
    labels: ["Total Invested", "Total Growth"],
    datasets: [
      {
        data: [simulation.totalInvested, simulation.growth],
        backgroundColor: ["#93C5FD", "#2563EB"],
      },
    ],
  };

  const growthData = {
    labels: simulation.yearly.map((y) => `Year ${y.year}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: simulation.yearly.map((y) => Math.round(y.value)),
        backgroundColor: "#2563EB",
      },
    ],
  };

  const getCanvas = (ref) =>
    ref.current?.canvas ||
    ref.current?.ctx?.canvas ||
    ref.current?.chart?.canvas ||
    null;

  const downloadPDF = () => {

    const pieCanvas = getCanvas(pieRef);
    const barCanvas = getCanvas(barRef);

    if (!pieCanvas || !barCanvas) {
      showAppModal("Please wait... charts not ready.");
      return;
    }

    const pie = pieCanvas.toDataURL("image/png");
    const bar = barCanvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const W = pdf.internal.pageSize.getWidth();
    let y = 35;

    // Header
    pdf.setFillColor("#2563EB");
    pdf.rect(0, 0, W, 55, "F");

    pdf.setTextColor("#fff");
    pdf.setFontSize(18);
    pdf.text("Pioneer Wealth", 30, 35);

    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, W - 180, 35);

    y = 75;

    // Summary Boxes
    const summary = [
      ["Present Investment", formatNum(presentValue)],
      ["Monthly Contribution", formatNum(monthlyContribution)],
      ["Duration", `${years} Years`],
      ["Expected Return", `${annualReturn}%`],
    ];

    const boxW = (W - 100) / 4;

    summary.forEach((item, i) => {
      const x = 30 + i * (boxW + 10);

      pdf.setDrawColor("#BFDBFE");
      pdf.roundedRect(x, y, boxW, 50, 6, 6);

      pdf.setTextColor("#555");
      pdf.setFontSize(10);
      pdf.text(item[0], x + 8, y + 18);

      pdf.setTextColor("#000");
      pdf.setFontSize(11);
      pdf.text(item[1], x + 8, y + 38);
    });

    y += 95;

    pdf.setFontSize(14);
    pdf.setTextColor("#000");
    pdf.text("Projection Summary", 30, y);

    y += 20;

    const rows = [
      ["Total Invested", formatNum(simulation.totalInvested)],
      ["Total Growth", formatNum(simulation.growth)],
      ["Final Portfolio Value", formatNum(simulation.totalValue)],
    ];

    rows.forEach((row, index) => {

      if (index % 2 === 0) {
        pdf.setFillColor("#F3F4F6");
        pdf.rect(30, y - 12, W - 60, 22, "F");
      }

      pdf.setFontSize(10);
      pdf.setTextColor("#000");

      pdf.text(row[0], 40, y + 3);
      pdf.text(row[1], W - 40, y + 3, { align: "right" });

      y += 22;
    });

    // Pie Page
    pdf.addPage();
    y = 40;
    pdf.setFontSize(14);
    pdf.text("Investment Breakdown", 30, y);
    y += 15;
    pdf.addImage(pie, "PNG", 30, y, 180, 160);

    // Bar Page
    pdf.addPage();
    y = 40;
    pdf.setFontSize(14);
    pdf.text("Year-wise Growth Projection", 30, y);
    y += 15;
    pdf.addImage(bar, "PNG", 30, y, W - 60, 220);

    const fileName = `${formData.name.replace(/\s+/g, "-")}-${formData.calculatorType.replace(/\s+/g, "-")}.pdf`;
    pdf.save(fileName);
  };

  const handleSubmitForm = async () => {

    const { name, email, mobile, goal } = formData;

    if (!name || !email || !mobile || !goal) {
      showAppModal("Please fill all details");
      return;
    }

    await fetch("/api/sip-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    downloadPDF();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-16">

      <section className="py-16 px-6 mx-6 md:mx-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg text-center text-white">
        <h1 className="text-4xl font-bold">
          Future Value Calculator
        </h1>
      </section>

      <main className="max-w-7xl mx-auto px-6 pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {[
              ["Present Investment (₹)", presentValue, setPresentValue],
              ["Monthly Contribution (₹)", monthlyContribution, setMonthlyContribution],
              ["Duration (Years)", years, setYears],
              ["Expected Return (% p.a.)", annualReturn, setAnnualReturn],
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border">
                <label className="block font-semibold mb-2 text-gray-800">
                  {item[0]}
                </label>
                <input
                  type="number"
                  value={item[1]}
                  onChange={(e) => item[2](Number(e.target.value))}
                  className="w-full border border-black rounded-xl p-3 text-gray-900"
                />
              </div>
            ))}

          </div>

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <h4 className="font-semibold text-gray-800 mb-4">
                Future Value
              </h4>

              <div className="text-3xl font-bold text-blue-700 text-center">
                {formatNum(simulation.totalValue)}
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                Download Report
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <Pie ref={pieRef} data={pieData} />
            </div>

          </div>
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow border">
          <Bar ref={barRef} data={growthData} />
        </div>

      </main>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
             onClick={() => setShowForm(false)}>
          <div className="bg-white p-6 rounded-lg w-full max-w-md"
               onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 text-center text-black">
              Fill Your Details
            </h2>

            {["name","email","mobile","goal"].map((field)=>(
              <input
                key={field}
                type="text"
                placeholder={field}
                className="border p-2 rounded w-full mb-3 text-gray-800"
                value={formData[field]}
                onChange={(e)=>
                  setFormData({...formData,[field]:e.target.value})
                }
              />
            ))}

            <button
              onClick={handleSubmitForm}
              className="bg-blue-600 text-white w-full p-2 rounded-md">
              Submit & Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
