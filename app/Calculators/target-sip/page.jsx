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

export default function TargetAmountSIPCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Target Amount SIP Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;
    const target = targetAmount || 0;

    let sip = 0;
    if (months <= 0) {
      sip = 0;
    } else if (monthlyRate === 0) {
      sip = target / months;
    } else {
      sip = (target * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
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
      growth: Math.max(0, balance - totalInvested),
    };
  }, [targetAmount, years, annualReturn]);

  const pieData = useMemo(
    () => ({
      labels: ["Total Invested", "Total Growth"],
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
      reportTitle: "Target Amount SIP — Advisory Report",
      formData,
      summaryCards: [
        ["Target amount", formatPdfMoney(targetAmount)],
        ["Investment horizon", `${years} years`],
        ["Expected return (p.a.)", `${annualReturn}%`],
      ],
      metricRows: [
        ["Required monthly SIP", formatPdfMoney(simulation.sip)],
        ["Total invested", formatPdfMoney(simulation.totalInvested)],
        ["Total growth", formatPdfMoney(simulation.growth)],
        ["Projected future value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.yearly.map((row) => `Y${row.year}`),
      lineValues: simulation.yearly.map((row) => Math.round(row.value)),
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
      title="Target Amount SIP"
      highlight="Calculator"
      breadcrumb="Target Amount SIP"
      description="Work backwards from a goal corpus. Enter target amount, tenure, and expected return to find the monthly SIP you need."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is a target amount SIP?</h2>
          <p>
            Instead of starting with a contribution, you start with a goal — education, home, retirement — and
            calculate the monthly SIP required to reach that amount over time.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Convert vague goals into a clear monthly saving plan, review invested vs growth split, and download a
            branded advisory PDF.
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
                  placeholder="Target corpus"
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

          <ChartPanel title="Projected SIP growth">
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
              ["Required monthly SIP", formatINR(simulation.sip)],
              ["Total invested", formatINR(simulation.totalInvested)],
              ["Estimated growth", formatINR(simulation.growth)],
              ["Projected value", formatINR(simulation.totalValue)],
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
