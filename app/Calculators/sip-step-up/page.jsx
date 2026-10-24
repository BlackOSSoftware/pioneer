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

export default function StepUpSIPCalculatorPage() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "SIP Step up Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const monthlyAmt = monthly || 0;
    const monthlyRate = annualReturn / 100 / 12;
    let balance = 0;
    let totalInvested = 0;
    const yearly = [];

    const sipPerYear = [];
    for (let y = 1; y <= years; y++) {
      const factor = Math.pow(1 + stepUp / 100, y - 1);
      sipPerYear.push(monthlyAmt * factor);
    }

    for (let y = 0; y < years; y++) {
      const sipMonthlyThisYear = sipPerYear[y];
      let investedThisYear = 0;

      for (let m = 0; m < 12; m++) {
        balance += sipMonthlyThisYear;
        investedThisYear += sipMonthlyThisYear;
        totalInvested += sipMonthlyThisYear;
        balance *= 1 + monthlyRate;
      }

      yearly.push({
        year: y + 1,
        sipMonthly: sipMonthlyThisYear,
        investedYear: investedThisYear,
        valueAtYearEnd: balance,
        cumulativeInvested: totalInvested,
      });
    }

    const totalValue = balance;
    const totalGrowth = Math.max(0, totalValue - totalInvested);

    return { yearly, totalInvested, totalValue, totalGrowth };
  }, [monthly, years, annualReturn, stepUp]);

  const pieData = useMemo(
    () => ({
      labels: ["Total Invested", "Total Growth"],
      datasets: [
        {
          data: [Math.max(simulation.totalInvested, 0), Math.max(simulation.totalGrowth, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [simulation.totalInvested, simulation.totalGrowth]
  );

  const growthData = useMemo(
    () => ({
      labels: simulation.yearly.map((y) => `Y${y.year}`),
      datasets: [
        {
          label: "Invested",
          data: simulation.yearly.map((y) => Math.round(y.cumulativeInvested)),
          backgroundColor: "#93C5FD",
        },
        {
          label: "Portfolio value",
          data: simulation.yearly.map((y) => Math.round(y.valueAtYearEnd)),
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
      reportTitle: "SIP Step Up — Advisory Report",
      formData,
      summaryCards: [
        ["Base Monthly SIP", formatPdfMoney(monthly)],
        ["Duration", `${years} years`],
        ["Return (p.a.)", `${annualReturn}%`],
        ["Step-up (yr)", `${stepUp}%`],
      ],
      metricRows: [
        ["Total Invested", formatPdfMoney(simulation.totalInvested)],
        ["Total Growth", formatPdfMoney(simulation.totalGrowth)],
        ["Future Value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.yearly.map((row) => `Year ${row.year}`),
      lineValues: simulation.yearly.map((row) => Math.round(row.valueAtYearEnd)),
      extraTables: [
        {
          title: "Year-wise Summary",
          rows: simulation.yearly.map((row) => [
            `Year ${row.year} (SIP ${formatPdfMoney(Math.round(row.sipMonthly))})`,
            `Invested ${formatPdfMoney(Math.round(row.investedYear))} / Value ${formatPdfMoney(Math.round(row.valueAtYearEnd))}`,
          ]),
        },
      ],
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
      title="SIP Step-Up"
      highlight="Calculator"
      breadcrumb="SIP Step-Up"
      description="See how raising your SIP every year can grow your corpus faster. Set a base SIP, step-up rate, tenure, and expected return."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is a step-up SIP?</h2>
          <p>
            A step-up SIP increases your monthly investment by a fixed percentage each year. As income grows, so
            does your contribution — helping you build a larger corpus without starting at a high amount.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Compare a flat SIP with annual increases, project future value, and download a branded advisory PDF for
            planning discussions.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Investment inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Monthly SIP amount (base)</FieldLabel>
                <MoneyInput
                  value={monthly}
                  onChange={(v) => setMonthly(clamp(v, 0, 1e9))}
                  placeholder="Monthly SIP"
                />
              </div>
              <div>
                <FieldLabel>Investment tenure (years)</FieldLabel>
                <NumberField
                  value={years}
                  min={1}
                  max={40}
                  onChange={(v) => setYears(clamp(v, 1, 40))}
                />
                <RangeField value={years} min={1} max={40} onChange={(v) => setYears(clamp(v, 1, 40))} />
                <SliderMarks marks={["1y", "10y", "20y", "30y", "40y"]} />
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
              <div>
                <FieldLabel>Annual step-up (%)</FieldLabel>
                <NumberField
                  value={stepUp}
                  min={0}
                  max={60}
                  step={0.1}
                  onChange={(v) => setStepUp(clamp(v, 0, 60))}
                />
                <RangeField
                  value={stepUp}
                  min={0}
                  max={60}
                  step={0.1}
                  onChange={(v) => setStepUp(clamp(v, 0, 60))}
                />
                <SliderMarks marks={["0%", "15%", "30%", "45%", "60%"]} />
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
              ["Total invested", formatINR(simulation.totalInvested)],
              ["Estimated growth", formatINR(simulation.totalGrowth)],
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
