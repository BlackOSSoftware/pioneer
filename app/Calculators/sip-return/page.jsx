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

export default function SIPReturnPage() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "SIP Return Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const months = years * 12;
  const r = annualReturn / 100 / 12;
  const monthlyAmt = monthly || 0;

  const futureValue = useMemo(() => {
    if (monthlyAmt <= 0) return 0;
    if (r === 0) return monthlyAmt * months;
    const fv = monthlyAmt * ((Math.pow(1 + r, months) - 1) / r);
    return fv > 1e12 ? 1e12 : fv;
  }, [monthlyAmt, months, r]);

  const totalInvested = monthlyAmt * months;
  const totalGrowth = Math.max(0, futureValue - totalInvested);

  const pieData = useMemo(
    () => ({
      labels: ["Total Invested", "Total Growth"],
      datasets: [
        {
          data: [Math.max(totalInvested, 0), Math.max(totalGrowth, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [totalInvested, totalGrowth]
  );

  const growthData = useMemo(() => {
    const m = monthlyAmt;
    const rate = annualReturn / 100 / 12;
    const labels = [];
    const investedSeries = [];
    const valueSeries = [];
    let balance = 0;
    let invested = 0;
    for (let y = 1; y <= years; y++) {
      for (let mo = 0; mo < 12; mo++) {
        balance += m;
        invested += m;
        balance *= 1 + rate;
      }
      labels.push(`Y${y}`);
      investedSeries.push(Math.round(invested));
      valueSeries.push(Math.round(balance));
    }
    return {
      labels,
      datasets: [
        { label: "Invested", data: investedSeries, backgroundColor: "#93C5FD" },
        { label: "Portfolio value", data: valueSeries, backgroundColor: "#2563EB" },
      ],
    };
  }, [years, monthlyAmt, annualReturn]);

  const downloadPDF = async () => {
    const pie = canvasToPdfJpeg(getChartCanvas(pieRef), 420);
    const bar = canvasToPdfJpeg(getChartCanvas(barRef), 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "SIP Return — Advisory Report",
      formData,
      summaryCards: [
        ["Monthly SIP", formatPdfMoney(monthly)],
        ["Duration", `${years} years`],
        ["Return (p.a.)", `${annualReturn}%`],
      ],
      metricRows: [
        ["Total invested", formatPdfMoney(totalInvested)],
        ["Total growth", formatPdfMoney(totalGrowth)],
        ["Future value", formatPdfMoney(futureValue)],
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
      title="SIP Return"
      highlight="Calculator"
      breadcrumb="SIP Return"
      description="Estimate the future value of your monthly SIP with expected returns. Adjust tenure and rate to plan your goals."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is a Systematic Investment Plan?</h2>
          <p>
            An SIP lets you invest a fixed amount regularly in mutual funds. You buy more units when prices are
            lower and fewer when prices are higher — a disciplined way to average cost over time.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Project corpus growth, compare scenarios, and download a branded advisory PDF to share with your
            advisor or family.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Investment inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Monthly SIP amount</FieldLabel>
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
              ["Total invested", formatINR(totalInvested)],
              ["Estimated growth", formatINR(totalGrowth)],
              ["Future value", formatINR(futureValue)],
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
