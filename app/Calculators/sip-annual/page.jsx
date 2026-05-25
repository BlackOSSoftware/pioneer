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

export default function SIPAnnualIncreaseCalculator() {

  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [annualIncrease, setAnnualIncrease] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "SIP Annual Increase Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const simulation = useMemo(() => {

    const monthlyRate = annualReturn / 100 / 12;
    let balance = 0;
    let totalInvested = 0;

    const yearlyData = [];

    for (let y = 1; y <= years; y++) {

      const increasedSIP =
        monthlySIP * Math.pow(1 + annualIncrease / 100, y - 1);

      let investedThisYear = 0;

      for (let m = 0; m < 12; m++) {
        balance += increasedSIP;
        investedThisYear += increasedSIP;
        totalInvested += increasedSIP;
        balance *= 1 + monthlyRate;
      }

      yearlyData.push({
        year: y,
        sip: increasedSIP,
        invested: totalInvested,
        value: balance,
      });
    }

    return {
      yearlyData,
      totalInvested,
      totalValue: balance,
      growth: balance - totalInvested,
    };

  }, [monthlySIP, years, annualReturn, annualIncrease]);

  const pieData = {
    labels: ["Total Invested", "Total Growth"],
    datasets: [
      {
        data: [simulation.totalInvested, simulation.growth],
        backgroundColor: ["#BFDBFE", "#2563EB"],
        borderWidth: 0,
      },
    ],
  };

  const growthData = {
    labels: simulation.yearlyData.map((y) => `Year ${y.year}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: simulation.yearlyData.map((y) =>
          Math.round(y.value)
        ),
        backgroundColor: "#2563EB",
        borderRadius: 6,
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

  // ===== HEADER =====
  pdf.setFillColor("#2563EB");
  pdf.rect(0, 0, W, 55, "F");

  pdf.setTextColor("#ffffff");
  pdf.setFontSize(18);
  pdf.text("Pioneer Wealth", 30, 35);

  pdf.setFontSize(9);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, W - 180, 35);

  y = 75;

  // ===== SUMMARY BOXES =====
  const summary = [
    ["Base Monthly SIP", formatNum(monthlySIP)],
    ["Duration", `${years} Years`],
    ["Expected Return", `${annualReturn}%`],
    ["Annual Increase", `${annualIncrease}%`],
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
    pdf.setFontSize(12);
    pdf.text(item[1], x + 8, y + 38);
  });

  y += 95;

  // ===== INVESTMENT BREAKDOWN =====
  pdf.setFontSize(14).setTextColor("#000");
  pdf.text("Investment Breakdown", 30, y);

  y += 15;

  pdf.addImage(pie, "PNG", 30, y, 180, 160);

  // ===== PROJECTION TABLE =====
  const tableX = 240;
  const tableW = W - tableX - 30;

  const rows = [
    ["Total Invested", formatNum(simulation.totalInvested)],
    ["Total Growth", formatNum(simulation.growth)],
    ["Future Value", formatNum(simulation.totalValue)],
  ];

  pdf.setFontSize(12).setTextColor("#000");
  pdf.text("Projection Summary", tableX, y);

  y += 25;

  rows.forEach((row, index) => {

    if (index % 2 === 0) {
      pdf.setFillColor("#F3F4F6");
      pdf.rect(tableX, y - 12, tableW, 22, "F");
    }

    pdf.setTextColor("#333");
    pdf.setFontSize(10);

    pdf.text(row[0], tableX + 10, y + 3);
    pdf.text(row[1], tableX + tableW - 10, y + 3, {
      align: "right",
    });

    y += 22;
  });

  // ===== YEARLY TABLE (NEW PAGE IF NEEDED) =====
  pdf.addPage();
  y = 40;

  pdf.setFontSize(14).setTextColor("#000");
  pdf.text("Year-wise SIP Growth Summary", 30, y);

  y += 20;

  const col1 = 40;
  const col2 = 150;
  const col3 = 260;
  const col4 = W - 40;

  pdf.setFillColor("#2563EB");
  pdf.rect(30, y - 12, W - 60, 22, "F");

  pdf.setTextColor("#fff");
  pdf.setFontSize(10);
  pdf.text("Year", col1, y + 3);
  pdf.text("SIP / Month", col2, y + 3);
  pdf.text("Total Invested", col3, y + 3);
  pdf.text("Portfolio Value", col4, y + 3, { align: "right" });

  y += 25;

  simulation.yearlyData.forEach((row, index) => {

    if (y > 760) {
      pdf.addPage();
      y = 40;
    }

    if (index % 2 === 0) {
      pdf.setFillColor("#F9FAFB");
      pdf.rect(30, y - 12, W - 60, 22, "F");
    }

    pdf.setTextColor("#000");
    pdf.setFontSize(9);

    pdf.text(String(row.year), col1, y + 3);
    pdf.text(formatNum(row.sip), col2, y + 3);
    pdf.text(formatNum(row.invested), col3, y + 3);
    pdf.text(formatNum(row.value), col4, y + 3, {
      align: "right",
    });

    y += 20;
  });

  // ===== BAR CHART =====
  pdf.addPage();
  y = 40;

  pdf.setFontSize(14).setTextColor("#000");
  pdf.text("Projected Portfolio Growth", 30, y);

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

      {/* Hero */}
      <section className="py-16 px-6 mx-6 md:mx-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg text-center text-white">
        <h1 className="text-4xl font-bold">
          SIP With Annual Increase Calculator
        </h1>
        <p className="mt-2 text-blue-100">
          Grow your SIP every year and maximize returns
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6 pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {[
              {
                label: "Monthly SIP (₹)",
                value: monthlySIP,
                setter: setMonthlySIP,
              },
              {
                label: "Duration (Years)",
                value: years,
                setter: setYears,
              },
              {
                label: "Expected Return (% p.a.)",
                value: annualReturn,
                setter: setAnnualReturn,
              },
              {
                label: "Annual Increase (%)",
                value: annualIncrease,
                setter: setAnnualIncrease,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow border border-gray-200"
              >
                <label className="block text-gray-700 font-semibold mb-2">
                  {item.label}
                </label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) =>
                    item.setter(Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-xl p-3
                             bg-white text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

          </div>

          {/* Result */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  Future Value
                </h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Download
                </button>
              </div>

              <div className="text-3xl font-bold text-center text-blue-700 mt-6">
                {formatNum(simulation.totalValue)}
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                Invested: {formatNum(simulation.totalInvested)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
              <Pie ref={pieRef} data={pieData} />
            </div>

          </div>
        </div>

        <section className="mt-10 bg-white p-6 rounded-2xl shadow border border-gray-200">
          <Bar ref={barRef} data={growthData} />
        </section>

      </main>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
              Fill Your Details
            </h2>

            {["name", "email", "mobile", "goal"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                className="border border-gray-300 p-2 rounded w-full mb-3 bg-white text-gray-900"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field]: e.target.value,
                  })
                }
              />
            ))}

            <button
              onClick={handleSubmitForm}
              className="bg-blue-600 text-white w-full p-2 rounded-md hover:bg-blue-700"
            >
              Submit & Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
