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

export default function CompoundingCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Compounding Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;

    let balance = initialInvestment;
    let totalInvested = initialInvestment;
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
  }, [initialInvestment, monthlyContribution, years, annualReturn]);

  const pieData = useMemo(
    () => ({
      labels: ["Total invested", "Total growth"],
      datasets: [
        {
          data: [Math.max(simulation.totalInvested, 0), Math.max(simulation.growth, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [simulation.totalInvested, simulation.growth]
  );

  const growthData = useMemo(
    () => ({
      labels: simulation.yearly.map((y) => `Y${y.year}`),
      datasets: [
        {
          label: "Invested",
          data: simulation.yearly.map((y) => Math.round(y.invested)),
          backgroundColor: "#93C5FD",
        },
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
      reportTitle: "Compounding — Advisory Report",
      formData,
      summaryCards: [
        ["Initial investment", formatPdfMoney(initialInvestment)],
        ["Monthly contribution", formatPdfMoney(monthlyContribution)],
        ["Duration", `${years} years`],
        ["Return (p.a.)", `${annualReturn}%`],
      ],
      metricRows: [
        ["Total invested", formatPdfMoney(simulation.totalInvested)],
        ["Total growth", formatPdfMoney(simulation.growth)],
        ["Future value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: growthData.labels,
      lineValues: growthData.datasets[1].data.map(Number),
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
      title="Compounding"
      highlight="Calculator"
      breadcrumb="Compounding"
      description="See how an initial investment plus monthly contributions can grow through the power of compounding."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is compounding?</h2>
          <p>
            Compounding means you earn returns on both your principal and the returns already earned. Adding
            regular contributions accelerates growth over long tenures.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Model combined lumpsum and SIP-style investing, compare scenarios, and download a branded
            advisory PDF.
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
                  value={initialInvestment}
                  onChange={(v) => setInitialInvestment(clamp(v, 0, 1e9))}
                  placeholder="Initial investment"
                />
              </div>
              <div>
                <FieldLabel>Monthly contribution</FieldLabel>
                <MoneyInput
                  value={monthlyContribution}
                  onChange={(v) => setMonthlyContribution(clamp(v, 0, 1e9))}
                  placeholder="Monthly contribution"
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

          <ChartPanel title="Projected compounding growth">
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
              ["Total invested", formatINR(simulation.totalInvested)],
              ["Estimated growth", formatINR(simulation.growth)],
              ["Future value", formatINR(simulation.totalValue)],
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
