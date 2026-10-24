"use client";

import "@/lib/chartjs-fix";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { DISPLAY_CHART_OPTIONS, DISPLAY_PIE_OPTIONS } from "@/lib/chart-pdf-options";
import { submitCalculatorLeadAndDownloadPdf } from "@/lib/calculator-pdf-submit";
import CalculatorDownloadForm from "@/components/calculators/CalculatorDownloadForm";
import {
  CalculatorShell,
  CalcCard,
  FieldLabel,
  MoneyInput,
  NumberField,
  RangeField,
  SliderMarks,
  ResultPanel,
  DownloadButton,
  ChartPanel,
  formatINR,
  clamp,
} from "@/components/calculators/CalculatorShell";
import {
  createPremiumCalculatorPdf,
  formatPdfMoney,
  getChartCanvas,
  canvasToPdfJpeg,
} from "@/lib/pdf-branded";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

const DEFAULT_GOALS = [
  { name: "Child education", amount: 3000000, years: 10 },
  { name: "Marriage", amount: 2000000, years: 15 },
];

export default function CompositeFinancialGoalCalculator() {
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Composite Financial Goal Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;

    let combinedSIP = 0;
    let combinedFutureValue = 0;
    let combinedInvested = 0;
    const goalDetails = [];

    goals.forEach((goal) => {
      const years = Math.max(1, Number(goal.years) || 1);
      const amount = Math.max(0, Number(goal.amount) || 0);
      const months = years * 12;

      let sip = 0;
      if (monthlyRate === 0) {
        sip = amount / months;
      } else {
        sip = (amount * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
      }

      const totalInvested = sip * months;
      combinedSIP += sip;
      combinedFutureValue += amount;
      combinedInvested += totalInvested;

      goalDetails.push({
        ...goal,
        years,
        amount,
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

  const pieData = useMemo(
    () => ({
      labels: ["Total invested", "Total future goal value"],
      datasets: [
        {
          data: [
            Math.max(simulation.combinedInvested, 0),
            Math.max(simulation.combinedFutureValue, 0),
          ],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [simulation.combinedInvested, simulation.combinedFutureValue]
  );

  const growthData = useMemo(
    () => ({
      labels: simulation.goalDetails.map((g) => g.name || "Goal"),
      datasets: [
        {
          label: "Required monthly SIP",
          data: simulation.goalDetails.map((g) => Math.round(g.sip)),
          backgroundColor: "#2563EB",
        },
      ],
    }),
    [simulation.goalDetails]
  );

  const updateGoal = (index, patch) => {
    setGoals((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const addGoal = () => {
    setGoals((prev) => [...prev, { name: `Goal ${prev.length + 1}`, amount: 1000000, years: 10 }]);
  };

  const removeGoal = (index) => {
    setGoals((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const downloadPDF = async () => {
    const pie = canvasToPdfJpeg(getChartCanvas(pieRef), 420);
    const bar = canvasToPdfJpeg(getChartCanvas(barRef), 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "Financial Goals — Advisory Report",
      formData,
      summaryCards: [
        ["Number of goals", String(simulation.goalDetails.length)],
        ["Expected return", `${annualReturn}%`],
        ["Combined monthly SIP", formatPdfMoney(simulation.combinedSIP)],
      ],
      metricRows: [
        ...simulation.goalDetails.map((g) => [
          `${g.name} (${g.years} yrs)`,
          formatPdfMoney(g.sip),
        ]),
        ["Total monthly SIP required", formatPdfMoney(simulation.combinedSIP)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.goalDetails.map((g) => g.name),
      lineValues: simulation.goalDetails.map((g) => Math.round(g.sip)),
    });
    return true;
  };

  const handleSubmitForm = async () => {
    setPdfBusy(true);
    try {
      await submitCalculatorLeadAndDownloadPdf({
        formData,
        downloadPDF,
        onDone: () => setShowForm(false),
      });
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <CalculatorShell
      title="Financial Goals"
      highlight="Calculator"
      breadcrumb="Financial Goals"
      description="Combine multiple goals and estimate the total monthly SIP needed at your expected return rate."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">Plan multiple goals together</h2>
          <p>
            Add education, marriage, home, or any other targets. The calculator estimates the SIP for each
            goal and a combined monthly commitment.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            See how goals stack up side by side, then download a branded advisory PDF for discussion with
            your advisor.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard
            title="Goal inputs"
            action={
              <button
                type="button"
                onClick={addGoal}
                className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-100"
              >
                Add goal
              </button>
            }
          >
            <div className="space-y-6">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="space-y-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel>Goal {index + 1}</FieldLabel>
                    {goals.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div>
                    <FieldLabel>Goal name</FieldLabel>
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(e) => updateGoal(index, { name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Goal name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Target amount</FieldLabel>
                    <MoneyInput
                      value={goal.amount}
                      onChange={(v) => updateGoal(index, { amount: clamp(v, 0, 1e12) })}
                      placeholder="Target amount"
                    />
                  </div>
                  <div>
                    <FieldLabel>Years to goal</FieldLabel>
                    <NumberField
                      value={goal.years}
                      min={1}
                      max={50}
                      onChange={(v) => updateGoal(index, { years: clamp(v, 1, 50) })}
                    />
                    <RangeField
                      value={goal.years}
                      min={1}
                      max={50}
                      onChange={(v) => updateGoal(index, { years: clamp(v, 1, 50) })}
                    />
                    <SliderMarks marks={["1y", "10y", "20y", "30y", "40y", "50y"]} />
                  </div>
                </div>
              ))}

              <div>
                <FieldLabel>Expected return (% p.a.)</FieldLabel>
                <NumberField
                  value={annualReturn}
                  min={0}
                  max={30}
                  step={0.1}
                  onChange={(v) => setAnnualReturn(clamp(v, 0, 30))}
                />
                <RangeField
                  value={annualReturn}
                  min={0}
                  max={30}
                  step={0.1}
                  onChange={(v) => setAnnualReturn(clamp(v, 0, 30))}
                />
                <SliderMarks marks={["0%", "7%", "12%", "18%", "24%", "30%"]} />
              </div>
            </div>
          </CalcCard>

          <ChartPanel title="SIP by goal">
            <Bar ref={barRef} data={growthData} options={DISPLAY_CHART_OPTIONS} />
          </ChartPanel>
        </div>

        <div className="space-y-5">
          <CalcCard
            title="Breakdown"
            action={<DownloadButton busy={pdfBusy} onClick={() => setShowForm(true)} />}
          >
            <div className="mx-auto w-full max-w-[240px]">
              <Pie ref={pieRef} data={pieData} options={DISPLAY_PIE_OPTIONS} />
            </div>
          </CalcCard>

          <ResultPanel
            title="Combined summary"
            rows={[
              ...simulation.goalDetails.map((g) => [
                `${g.name || "Goal"} SIP`,
                formatINR(g.sip),
              ]),
              ["Combined monthly SIP", formatINR(simulation.combinedSIP)],
              ["Total invested (all goals)", formatINR(simulation.combinedInvested)],
              ["Total goal value", formatINR(simulation.combinedFutureValue)],
            ]}
          />
        </div>
      </div>

      <CalculatorDownloadForm
        open={showForm}
        onClose={() => setShowForm(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        busy={pdfBusy}
      />
    </CalculatorShell>
  );
}
