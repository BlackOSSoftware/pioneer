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

export default function LumpsumTargetCalculator() {
  const [targetAmount, setTargetAmount] = useState(5000000);
  const [years, setYears] = useState(15);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Lumpsum Target Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const r = annualReturn / 100;
    const presentValue = targetAmount / Math.pow(1 + r, years);

    let balance = presentValue;
    const yearly = [];

    for (let y = 1; y <= years; y++) {
      balance = balance * (1 + r);
      yearly.push({
        year: y,
        value: balance,
      });
    }

    return {
      requiredInvestment: presentValue,
      totalValue: targetAmount,
      growth: targetAmount - presentValue,
      yearly,
    };
  }, [targetAmount, years, annualReturn]);

  const pieData = useMemo(
    () => ({
      labels: ["Required investment", "Total growth"],
      datasets: [
        {
          data: [
            Math.max(simulation.requiredInvestment, 0),
            Math.max(simulation.growth, 0),
          ],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [simulation.requiredInvestment, simulation.growth]
  );

  const growthData = useMemo(
    () => ({
      labels: simulation.yearly.map((y) => `Y${y.year}`),
      datasets: [
        {
          label: "Portfolio value",
          data: simulation.yearly.map((y) => Math.round(y.value)),
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
      reportTitle: "Lumpsum Target — Advisory Report",
      formData,
      summaryCards: [
        ["Target amount", formatPdfMoney(targetAmount)],
        ["Duration", `${years} years`],
        ["Return (p.a.)", `${annualReturn}%`],
      ],
      metricRows: [
        ["Required investment today", formatPdfMoney(simulation.requiredInvestment)],
        ["Total growth", formatPdfMoney(simulation.growth)],
        ["Target value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: growthData.labels,
      lineValues: growthData.datasets[0].data.map(Number),
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
      title="Lumpsum Target"
      highlight="Calculator"
      breadcrumb="Lumpsum Target"
      description="Find how much you need to invest today as a lumpsum to reach a future goal at your expected return."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is a lumpsum target?</h2>
          <p>
            This calculator works backwards from your goal amount. It estimates the present value you must
            invest today so compounding can grow it to your target.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Set a clear goal, see the required lumpsum, and download a branded advisory PDF for planning
            discussions.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Goal inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Target amount</FieldLabel>
                <MoneyInput
                  value={targetAmount}
                  onChange={(v) => setTargetAmount(clamp(v, 0, 1e12))}
                  placeholder="Target amount"
                />
              </div>
              <div>
                <FieldLabel>Investment tenure (years)</FieldLabel>
                <NumberField
                  value={years}
                  min={1}
                  max={50}
                  onChange={(v) => setYears(clamp(v, 1, 50))}
                />
                <RangeField value={years} min={1} max={50} onChange={(v) => setYears(clamp(v, 1, 50))} />
                <SliderMarks marks={["1y", "10y", "20y", "30y", "40y", "50y"]} />
              </div>
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
                <SliderMarks marks={["0%", "7%", "15%", "22%", "30%"]} />
              </div>
            </div>
          </CalcCard>

          <ChartPanel title="Path to target">
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
              ["Required lumpsum today", formatINR(simulation.requiredInvestment)],
              ["Estimated growth", formatINR(simulation.growth)],
              ["Target value", formatINR(simulation.totalValue)],
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
