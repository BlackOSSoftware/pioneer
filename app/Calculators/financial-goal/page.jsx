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

export default function CompositeFinancialGoalCalculator() {

  const [goals, setGoals] = useState([
    { name: "Child Education", amount: 3000000, years: 10 },
    { name: "Marriage", amount: 2000000, years: 15 },
  ]);

  const [annualReturn, setAnnualReturn] = useState(12);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Composite Financial Goal Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  const simulation = useMemo(() => {

    const monthlyRate = annualReturn / 100 / 12;

    let combinedSIP = 0;
    let combinedFutureValue = 0;
    let combinedInvested = 0;

    const goalDetails = [];

    goals.forEach((goal) => {

      const months = goal.years * 12;

      let sip = 0;

      if (monthlyRate === 0) {
        sip = goal.amount / months;
      } else {
        sip =
          goal.amount *
          monthlyRate /
          (Math.pow(1 + monthlyRate, months) - 1);
      }

      const totalInvested = sip * months;

      combinedSIP += sip;
      combinedFutureValue += goal.amount;
      combinedInvested += totalInvested;

      goalDetails.push({
        ...goal,
        sip,
        totalInvested,
      });

    });

    return {
      goalDetails,
      combinedSIP,
      combinedFutureValue,
      combinedInvested,
      growth: combinedFutureValue - combinedInvested,
    };

  }, [goals, annualReturn]);

  const pieData = {
    labels: ["Total Invested", "Total Future Goal Value"],
    datasets: [
      {
        data: [
          simulation.combinedInvested,
          simulation.combinedFutureValue,
        ],
        backgroundColor: ["#93C5FD", "#2563EB"],
      },
    ],
  };

  const growthData = {
    labels: simulation.goalDetails.map((g) => g.name),
    datasets: [
      {
        label: "Required Monthly SIP",
        data: simulation.goalDetails.map((g) =>
          Math.round(g.sip)
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

    pdf.setFontSize(14).setTextColor("#000");
    pdf.text("Composite Financial Goals Summary", 30, y);

    y += 25;

    simulation.goalDetails.forEach((g) => {

      pdf.setFillColor("#F3F4F6");
      pdf.rect(30, y - 12, W - 60, 22, "F");

      pdf.setTextColor("#000");
      pdf.setFontSize(10);

      pdf.text(
        `${g.name} (${g.years} yrs)`,
        40,
        y + 3
      );

      pdf.text(
        formatNum(g.sip),
        W - 40,
        y + 3,
        { align: "right" }
      );

      y += 22;
    });

    y += 20;

    pdf.setFontSize(12);
    pdf.text(
      `Total Monthly SIP Required: ${formatNum(simulation.combinedSIP)}`,
      30,
      y
    );

    pdf.addPage();
    y = 40;

    pdf.setFontSize(14);
    pdf.text("Investment Breakdown", 30, y);

    y += 15;
    pdf.addImage(pie, "PNG", 30, y, 180, 160);

    pdf.addPage();
    y = 40;

    pdf.setFontSize(14);
    pdf.text("Goal-wise SIP Requirement", 30, y);

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
          Composite Financial Goal Calculator
        </h1>
      </section>

      <main className="max-w-7xl mx-auto px-6 pt-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6 text-black">

            {goals.map((goal, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow border">
                <label className="block font-semibold mb-2 text-gray-800">
                  Goal Name
                </label>
                <input
                  value={goal.name}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[index].name = e.target.value;
                    setGoals(updated);
                  }}
                  className="w-full border border-black p-2 rounded mb-2"
                />

                <label className="block font-semibold mb-2 text-gray-800">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={goal.amount}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[index].amount = Number(e.target.value);
                    setGoals(updated);
                  }}
                  className="w-full border border-black p-2 rounded mb-2"
                />

                <label className="block font-semibold mb-2 text-gray-800">
                  Years to Goal
                </label>
                <input
                  type="number"
                  value={goal.years}
                  onChange={(e) => {
                    const updated = [...goals];
                    updated[index].years = Number(e.target.value);
                    setGoals(updated);
                  }}
                  className="w-full border border-black p-2 rounded"
                />
              </div>
            ))}

          </div>

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <h4 className="font-semibold text-gray-800 mb-4">
                Total Monthly SIP Required
              </h4>

              <div className="text-3xl font-bold text-blue-700 text-center">
                {formatNum(simulation.combinedSIP)}
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
