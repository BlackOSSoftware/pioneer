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

export default function LumpsumCalculator() {
  const [investment, setInvestment] = useState(500000);
  const [years, setYears] = useState(15);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Lumpsum Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const rate = annualReturn / 100;
    const futureValue = investment * Math.pow(1 + rate, years);
    const growth = futureValue - investment;

    let balance = investment;
    const yearly = [];

    for (let y = 1; y <= years; y++) {
      balance *= 1 + rate;
      yearly.push({
        year: y,
        value: balance,
      });
    }

    return {
      futureValue,
      growth,
      yearly,
    };
  }, [investment, years, annualReturn]);

  const pieData = useMemo(
    () => ({
      labels: ["Initial investment", "Total growth"],
      datasets: [
        {
          data: [Math.max(investment, 0), Math.max(simulation.growth, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [investment, simulation.growth]
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
      reportTitle: "Lumpsum — Advisory Report",
      formData,
      summaryCards: [
        ["Initial investment", formatPdfMoney(investment)],
        ["Duration", `${years} years`],
        ["Return (p.a.)", `${annualReturn}%`],
      ],
      metricRows: [
        ["Initial investment", formatPdfMoney(investment)],
        ["Total growth", formatPdfMoney(simulation.growth)],
        ["Future value", formatPdfMoney(simulation.futureValue)],
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
      title="Lumpsum"
      highlight="Calculator"
      breadcrumb="Lumpsum"
      description="Project the future value of a one-time investment with expected annual returns. Adjust tenure and rate to plan your corpus."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is a lumpsum investment?</h2>
          <p>
            A lumpsum is a single investment made upfront. Compounding then grows that amount over the
            chosen tenure at the expected return rate.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Estimate corpus growth, compare return scenarios, and download a branded advisory PDF to share
            with your advisor or family.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Investment inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Initial investment</FieldLabel>
                <MoneyInput
                  value={investment}
                  onChange={(v) => setInvestment(clamp(v, 0, 1e9))}
                  placeholder="Initial investment"
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

          <ChartPanel title="Projected portfolio growth">
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
              ["Initial investment", formatINR(investment)],
              ["Estimated growth", formatINR(simulation.growth)],
              ["Future value", formatINR(simulation.futureValue)],
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
