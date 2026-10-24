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

export default function RetirementPlanningCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [inflation, setInflation] = useState(6);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Retirement Planning Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge;

    if (yearsToRetirement <= 0) {
      return {
        corpus: 0,
        futureMonthlyExpense: 0,
        annualExpense: 0,
        yearly: [],
      };
    }

    const futureMonthlyExpense =
      monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);

    const annualExpense = futureMonthlyExpense * 12;

    // 4% withdrawal rule
    const corpus = annualExpense / 0.04;

    const yearly = [];
    for (let y = 1; y <= yearsToRetirement; y++) {
      yearly.push({
        year: y,
        expense: monthlyExpense * Math.pow(1 + inflation / 100, y),
      });
    }

    return {
      corpus,
      futureMonthlyExpense,
      annualExpense,
      yearly,
    };
  }, [currentAge, retirementAge, monthlyExpense, inflation]);

  const pieData = useMemo(
    () => ({
      labels: ["Annual expense at retirement", "Required corpus"],
      datasets: [
        {
          data: [Math.max(simulation.annualExpense || 0, 0), Math.max(simulation.corpus || 0, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [simulation.annualExpense, simulation.corpus]
  );

  const growthData = useMemo(
    () => ({
      labels: simulation.yearly.map((y) => `Y${y.year}`),
      datasets: [
        {
          label: "Inflated monthly expense",
          data: simulation.yearly.map((y) => Math.round(y.expense)),
          backgroundColor: "#2563EB",
        },
      ],
    }),
    [simulation.yearly]
  );

  const downloadPDF = async () => {
    const pie = canvasToPdfJpeg(getChartCanvas(pieRef), 420);
    const bar = canvasToPdfJpeg(getChartCanvas(barRef), 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "Retirement — Advisory Report",
      formData,
      summaryCards: [
        ["Current age", `${currentAge}`],
        ["Retirement age", `${retirementAge}`],
        ["Monthly expense today", formatPdfMoney(monthlyExpense)],
        ["Inflation", `${inflation}%`],
      ],
      metricRows: [
        ["Future monthly expense", formatPdfMoney(simulation.futureMonthlyExpense)],
        ["Required retirement corpus", formatPdfMoney(simulation.corpus)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.yearly.map((y) => `Year ${y.year}`),
      lineValues: simulation.yearly.map((y) => Math.round(y.expense)),
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
      title="Retirement Planning"
      highlight="Calculator"
      breadcrumb="Retirement"
      description="Estimate the corpus you may need at retirement using today’s expenses, inflation, and a 4% withdrawal guideline."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">Plan your retirement corpus</h2>
          <p>
            This calculator inflates your current monthly spending to retirement age and applies a simple 4%
            withdrawal rule to estimate the nest egg you may need.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            See how inflation changes living costs over time, and download a branded advisory PDF to discuss
            with your advisor.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Retirement inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Current age (years)</FieldLabel>
                <NumberField
                  value={currentAge}
                  min={18}
                  max={80}
                  onChange={(v) => {
                    const next = clamp(v, 18, 80);
                    setCurrentAge(next);
                    if (retirementAge <= next) setRetirementAge(Math.min(90, next + 1));
                  }}
                />
                <RangeField
                  value={currentAge}
                  min={18}
                  max={80}
                  onChange={(v) => {
                    setCurrentAge(v);
                    if (retirementAge <= v) setRetirementAge(Math.min(90, v + 1));
                  }}
                />
                <SliderMarks marks={["18", "30", "45", "60", "80"]} />
              </div>
              <div>
                <FieldLabel>Retirement age (years)</FieldLabel>
                <NumberField
                  value={retirementAge}
                  min={currentAge + 1}
                  max={90}
                  onChange={(v) => setRetirementAge(clamp(v, currentAge + 1, 90))}
                />
                <RangeField
                  value={retirementAge}
                  min={currentAge + 1}
                  max={90}
                  onChange={(v) => setRetirementAge(clamp(v, currentAge + 1, 90))}
                />
                <SliderMarks marks={["40", "50", "60", "70", "90"]} />
              </div>
              <div>
                <FieldLabel>Monthly expense today</FieldLabel>
                <MoneyInput
                  value={monthlyExpense}
                  onChange={(v) => setMonthlyExpense(clamp(v, 0, 1e9))}
                  placeholder="Current monthly spend"
                />
              </div>
              <div>
                <FieldLabel>Expected inflation (% p.a.)</FieldLabel>
                <NumberField
                  value={inflation}
                  min={0}
                  max={15}
                  step={0.1}
                  onChange={(v) => setInflation(clamp(v, 0, 15))}
                />
                <RangeField
                  value={inflation}
                  min={0}
                  max={15}
                  step={0.1}
                  onChange={(v) => setInflation(clamp(v, 0, 15))}
                />
                <SliderMarks marks={["0%", "3%", "6%", "9%", "12%", "15%"]} />
              </div>
            </div>
          </CalcCard>

          <ChartPanel title="Inflated monthly expense over time">
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
            rows={[
              ["Future monthly expense", formatINR(simulation.futureMonthlyExpense)],
              ["Annual expense at retirement", formatINR(simulation.annualExpense)],
              ["Required corpus", formatINR(simulation.corpus)],
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
