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
import { PDF_CHART_OPTIONS, PDF_PIE_OPTIONS } from "@/lib/chart-pdf-options";
import { drawBrandedPdfHeader, drawLineChartPdf } from "@/lib/pdf-branded";
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

export default function TargetAmountSIPCalculatorPage() {

  const [targetAmount, setTargetAmount] = useState(1000000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Target Amount SIP Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  // ===== CALCULATION =====
  const simulation = useMemo(() => {

    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;

    let sip = 0;

    if (monthlyRate === 0) {
      sip = targetAmount / months;
    } else {
      sip =
        targetAmount *
        monthlyRate /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    let balance = 0;
    let totalInvested = 0;
    const yearly = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        balance += sip;
        totalInvested += sip;
        balance *= 1 + monthlyRate;
      }

      yearly.push({
        year: y,
        invested: totalInvested,
        value: balance,
      });
    }

    return {
      sip,
      yearly,
      totalInvested,
      totalValue: balance,
      growth: balance - totalInvested,
    };

  }, [targetAmount, years, annualReturn]);

  // ===== CHART DATA =====
  const pieData = {
    labels: ["Total Invested", "Total Growth"],
    datasets: [
      {
        data: [simulation.totalInvested, simulation.growth],
        backgroundColor: ["#93C5FD", "#3B82F6"],
      },
    ],
  };

  const growthData = {
    labels: simulation.yearly.map((y) => `Year ${y.year}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: simulation.yearly.map((y) =>
          Math.round(y.value)
        ),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  // ===== GET CANVAS =====
  const getCanvas = (ref) =>
    ref.current?.canvas ||
    ref.current?.ctx?.canvas ||
    ref.current?.chart?.canvas ||
    null;

  // ===== PDF DOWNLOAD =====
  const downloadPDF = async () => {
    const pieCanvas = getCanvas(pieRef);
    const barCanvas = getCanvas(barRef);

    if (!pieCanvas || !barCanvas) {
      showAppModal("Charts are still rendering. Please wait a moment and try again.", { title: "Almost ready" });
      return;
    }

    const pie = pieCanvas.toDataURL("image/png");
    const bar = barCanvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const W = pdf.internal.pageSize.getWidth();

    const subtitle = `Client: ${formData.name} | Goal: ${formData.goal} | Email: ${formData.email} | Mobile: ${formData.mobile}`;
    let y = await drawBrandedPdfHeader(pdf, {
      reportTitle: "Target Amount SIP — Advisory Report",
      reportSubtitle: subtitle,
    });

    const summary = [
      ["Target amount", formatNum(targetAmount)],
      ["Investment horizon", `${years} years`],
      ["Expected return (p.a.)", `${annualReturn}%`],
    ];

    const boxW = (W - 80) / 3;
    summary.forEach((item, i) => {
      const x = 30 + i * (boxW + 10);
      pdf.setDrawColor("#93C5FD");
      pdf.roundedRect(x, y, boxW, 50, 6, 6);
      pdf.setTextColor("#555");
      pdf.setFontSize(10);
      pdf.text(item[0], x + 10, y + 18);
      pdf.setTextColor("#000");
      pdf.setFontSize(12);
      pdf.text(item[1], x + 10, y + 38);
    });

    y += 95;
    pdf.setFontSize(14).setTextColor("#000");
    pdf.text("Investment breakdown", 30, y);
    y += 15;
    pdf.addImage(pie, "PNG", 30, y, 180, 160);

    const tableX = 240;
    const tableW = W - tableX - 30;
    const rows = [
      ["Required monthly SIP", formatNum(simulation.sip)],
      ["Total invested", formatNum(simulation.totalInvested)],
      ["Total growth", formatNum(simulation.growth)],
      ["Projected future value", formatNum(simulation.totalValue)],
    ];

    y += 20;
    rows.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor("#f6f6f6");
        pdf.rect(tableX, y - 12, tableW, 22, "F");
      }
      pdf.setTextColor("#333");
      pdf.setFontSize(10);
      pdf.text(row[0], tableX + 10, y + 3);
      pdf.text(row[1], tableX + tableW - 10, y + 3, { align: "right" });
      y += 22;
    });

    pdf.addPage();
    y = 40;
    pdf.setFontSize(14).setTextColor("#000");
    pdf.text("Projected growth (bars)", 30, y);
    y += 15;
    pdf.addImage(bar, "PNG", 30, y, W - 60, 200);
    y += 220;

    const lineLabels = simulation.yearly.map((row) => `Y${row.year}`);
    const lineVals = simulation.yearly.map((row) => Math.round(row.value));
    y = drawLineChartPdf(pdf, 30, y, W - 60, 150, lineLabels, lineVals);

    if (y > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      y = 40;
    }
    pdf.setFontSize(8).setTextColor("#64748b");
    pdf.text(
      "Figures are illustrative estimates only. Mutual fund investments are subject to market risks; read all scheme related documents carefully.",
      30,
      Math.min(y + 24, pdf.internal.pageSize.getHeight() - 20),
      { maxWidth: W - 60 }
    );

    const fileName = `${formData.name.replace(/\s+/g, "-")}-${formData.calculatorType.replace(/\s+/g, "-")}.pdf`;
    pdf.save(fileName);
  };

  // ===== FORM SUBMIT =====
  const handleSubmitForm = async () => {

    const { name, email, mobile, goal } = formData;

    if (!name || !email || !mobile || !goal) {
      showAppModal("Please fill all details before downloading.", { title: "Missing information" });
      return;
    }

    await fetch("/api/sip-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    await downloadPDF();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 pt-16">

      <section className="py-16 px-6 mx-6 md:mx-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-lg text-center text-white">
        <h1 className="text-4xl font-bold">
          Target Amount SIP Calculator
        </h1>
      </section>

      <main className="max-w-6xl mx-auto px-6 pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <label className="font-semibold text-gray-800 block mb-2">
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full border rounded-xl p-3 text-gray-900"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <label className="font-semibold text-gray-800 block mb-2">
                Duration (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full border rounded-xl p-3 text-gray-900"
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <label className="font-semibold text-gray-800 block mb-2">
                Expected Return (% p.a.)
              </label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full border rounded-xl p-3 text-gray-900"
              />
            </div>

          </div>

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  Required Monthly SIP
                </h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>
              </div>

              <div className="text-3xl font-bold text-blue-700 text-center mt-6">
                {formatNum(simulation.sip)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <Pie ref={pieRef} data={pieData} options={PDF_PIE_OPTIONS} />
            </div>

          </div>

        </div>

        <div className="mt-10 bg-white p-6 rounded-xl shadow border">
          <Bar ref={barRef} data={growthData} options={PDF_CHART_OPTIONS} />
        </div>

      </main>

       {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 "
            onClick={() => setShowForm(false)}>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md  text-gray-800"
              onClick={(e) => e.stopPropagation()} >

              <h2 className="text-lg font-bold mb-4 text-center ">Fill Your Details</h2>

              <input type="text" placeholder="Your Name"
                className="border p-2 rounded w-full mb-3  text-gray-800"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input type="email" placeholder="Email Address"
                className="border p-2 rounded w-full mb-3  text-gray-800"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <input type="number" placeholder="Mobile Number"
                className="border p-2 rounded w-full mb-3  text-gray-800"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />

              <input type="text" placeholder="Your Goal (Ex: Retirement, Child Education)"
                className="border p-2 rounded w-full mb-3 text-gray-800"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />

              <button
                onClick={handleSubmitForm}
                className="bg-blue-600 text-white w-full p-2 rounded-md  text-gray-800"
              >
                Submit & Download PDF
              </button>

            </div>
          </div>
        )}

    </div>
  );
}
