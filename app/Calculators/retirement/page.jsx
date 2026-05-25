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

export default function RetirementPlanningCalculator() {

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(10);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Retirement Planning Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const simulation = useMemo(() => {

    const yearsToRetirement = retirementAge - currentAge;

    if (yearsToRetirement <= 0) {
      return {
        corpus: 0,
        futureMonthlyExpense: 0,
        yearly: [],
      };
    }

    const futureMonthlyExpense =
      monthlyExpense *
      Math.pow(1 + inflation / 100, yearsToRetirement);

    const annualExpense = futureMonthlyExpense * 12;

    // 4% withdrawal rule
    const corpus = annualExpense / 0.04;

    const yearly = [];

    for (let y = 1; y <= yearsToRetirement; y++) {
      yearly.push({
        year: y,
        expense:
          monthlyExpense *
          Math.pow(1 + inflation / 100, y),
      });
    }

    return {
      corpus,
      futureMonthlyExpense,
      annualExpense,
      yearly,
    };

  }, [currentAge, retirementAge, monthlyExpense, inflation]);

  const pieData = {
    labels: ["Annual Expense at Retirement", "Required Corpus"],
    datasets: [
      {
        data: [simulation.annualExpense, simulation.corpus],
        backgroundColor: ["#93C5FD", "#2563EB"],
      },
    ],
  };

  const growthData = {
    labels: simulation.yearly.map((y) => `Year ${y.year}`),
    datasets: [
      {
        label: "Inflated Monthly Expense",
        data: simulation.yearly.map((y) =>
          Math.round(y.expense)
        ),
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

    // HEADER
    pdf.setFillColor("#2563EB");
    pdf.rect(0, 0, W, 55, "F");

    pdf.setTextColor("#fff");
    pdf.setFontSize(18);
    pdf.text("Pioneer Wealth", 30, 35);

    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, W - 180, 35);

    y = 75;

    const summary = [
      ["Current Age", currentAge],
      ["Retirement Age", retirementAge],
      ["Monthly Expense Today", formatNum(monthlyExpense)],
      ["Inflation", `${inflation}%`],
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
      pdf.text(String(item[1]), x + 8, y + 38);
    });

    y += 95;

    pdf.setFontSize(14).setTextColor("#000");
    pdf.text("Retirement Corpus Summary", 30, y);

    y += 20;

    pdf.setFontSize(11);
    pdf.text(
      `Future Monthly Expense: ${formatNum(simulation.futureMonthlyExpense)}`,
      30,
      y
    );
    y += 20;
    pdf.text(
      `Required Retirement Corpus: ${formatNum(simulation.corpus)}`,
      30,
      y
    );

    y += 25;

    pdf.addImage(pie, "PNG", 30, y, 180, 160);

    pdf.addPage();
    y = 40;

    pdf.setFontSize(14).setTextColor("#000");
    pdf.text("Inflation Growth Until Retirement", 30, y);

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
          Retirement Planning Calculator
        </h1>
      </section>

      <main className="max-w-7xl mx-auto px-6 pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {[
              ["Current Age", currentAge, setCurrentAge],
              ["Retirement Age", retirementAge, setRetirementAge],
              ["Monthly Expense Today (₹)", monthlyExpense, setMonthlyExpense],
              ["Expected Inflation (%)", inflation, setInflation],
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border">
                <label className="block font-semibold text-gray-800 mb-2">
                  {item[0]}
                </label>
                <input
                  type="number"
                  value={item[1]}
                  onChange={(e) => item[2](Number(e.target.value))}
                  className="w-full border rounded-xl p-3 text-gray-900"
                />
              </div>
            ))}

          </div>

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  Required Corpus
                </h4>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Download
                </button>
              </div>

              <div className="text-3xl font-bold text-blue-700 text-center mt-6">
                {formatNum(simulation.corpus)}
              </div>
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
            <h2 className="text-lg font-bold mb-4 text-center">
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
