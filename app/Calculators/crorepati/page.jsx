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

export default function BecomeCrorepatiPage() {
  const [targetCrores, setTargetCrores] = useState(10000000);
  const [ageNow, setAgeNow] = useState(30);
  const [targetAge, setTargetAge] = useState(60);
  const [inflation, setInflation] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Crorepati Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const yearsToSave = Math.max(0, targetAge - ageNow);
  const savings = currentSavings || 0;
  const targetToday = targetCrores || 0;

  const inflationFactor = Math.pow(1 + inflation / 100, yearsToSave);
  const targetInflationAdjusted = targetToday * inflationFactor;

  const monthlyNeeded =
    yearsToSave === 0
      ? 0
      : Math.max(
          0,
          ((targetInflationAdjusted - savings * Math.pow(1 + expectedReturn / 100, yearsToSave)) *
            (expectedReturn / 100)) /
            (12 * (Math.pow(1 + expectedReturn / 100 / 12, yearsToSave * 12) - 1))
        );

  const futureValue = Math.max(0, targetInflationAdjusted);
  const totalInvestedApprox = monthlyNeeded * 12 * yearsToSave + savings;
  const totalGrowthApprox = Math.max(0, futureValue - totalInvestedApprox);
  const finalTargetNet = Math.max(0, targetInflationAdjusted - totalGrowthApprox);

  const pieData = useMemo(
    () => ({
      labels: ["Amount invested", "Total growth"],
      datasets: [
        {
          data: [Math.max(totalInvestedApprox, 0), Math.max(totalGrowthApprox, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [totalInvestedApprox, totalGrowthApprox]
  );

  const growthData = useMemo(() => {
    const months = 12;
    const investedSeries = Array.from({ length: months }, (_, i) =>
      Math.round((totalInvestedApprox / months) * (i + 1))
    );
    const valueSeries = Array.from({ length: months }, (_, i) =>
      Math.round((futureValue / months) * (i + 1))
    );
    return {
      labels: Array.from({ length: months }, (_, i) =>
        `${Math.round(((i + 1) / months) * Math.max(yearsToSave, 1))}y`
      ),
      datasets: [
        { label: "Invested", data: investedSeries, backgroundColor: "#93C5FD" },
        { label: "Portfolio value", data: valueSeries, backgroundColor: "#2563EB" },
      ],
    };
  }, [totalInvestedApprox, futureValue, yearsToSave]);

  const downloadPDF = async () => {
    const pie = canvasToPdfJpeg(getChartCanvas(pieRef), 420);
    const bar = canvasToPdfJpeg(getChartCanvas(barRef), 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "Crorepati — Advisory Report",
      formData,
      summaryCards: [
        ["Target today", formatPdfMoney(targetToday)],
        ["Your age", `${ageNow} years`],
        ["Target age", `${targetAge} years`],
      ],
      metricRows: [
        ["Monthly SIP (approx.)", formatPdfMoney(Math.round(monthlyNeeded || 0))],
        ["Total amount invested", formatPdfMoney(Math.round(totalInvestedApprox))],
        ["Total growth", formatPdfMoney(Math.round(totalGrowthApprox))],
        ["Target (inflation adj.)", formatPdfMoney(Math.round(targetInflationAdjusted))],
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
      title="Become a Crorepati"
      highlight="Calculator"
      breadcrumb="Crorepati"
      description="Estimate the monthly SIP you need to reach your wealth target, adjusted for inflation and existing savings."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">Build wealth with disciplined SIPs</h2>
          <p>
            This planner inflates your target wealth to your chosen age and estimates the monthly SIP required,
            given expected returns and current savings.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">What is an SIP?</h3>
          <p>
            A Systematic Investment Plan lets you invest a fixed sum regularly in mutual funds, benefiting from
            rupee-cost averaging and compounding over time.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Goal inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Target wealth (today&apos;s value)</FieldLabel>
                <MoneyInput
                  value={targetCrores}
                  onChange={(v) => setTargetCrores(clamp(v, 0, 1e12))}
                  placeholder="e.g. 1,00,00,000"
                />
              </div>
              <div>
                <FieldLabel>Your current age (years)</FieldLabel>
                <NumberField
                  value={ageNow}
                  min={10}
                  max={100}
                  onChange={(v) => {
                    const next = clamp(v, 10, 100);
                    setAgeNow(next);
                    if (targetAge < next) setTargetAge(next);
                  }}
                />
                <RangeField
                  value={ageNow}
                  min={10}
                  max={100}
                  onChange={(v) => {
                    setAgeNow(v);
                    if (targetAge < v) setTargetAge(v);
                  }}
                />
                <SliderMarks marks={["10", "25", "50", "75", "100"]} />
              </div>
              <div>
                <FieldLabel>Target age (years)</FieldLabel>
                <NumberField
                  value={targetAge}
                  min={ageNow}
                  max={100}
                  onChange={(v) => setTargetAge(clamp(v, ageNow, 100))}
                />
                <RangeField
                  value={targetAge}
                  min={ageNow}
                  max={100}
                  onChange={(v) => setTargetAge(clamp(v, ageNow, 100))}
                />
                <SliderMarks marks={["10", "25", "50", "75", "100"]} />
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
                <SliderMarks marks={["0%", "2.5%", "5%", "7.5%", "10%", "15%"]} />
              </div>
              <div>
                <FieldLabel>Expected SIP return (% p.a.)</FieldLabel>
                <NumberField
                  value={expectedReturn}
                  min={0}
                  max={25}
                  step={0.1}
                  onChange={(v) => setExpectedReturn(clamp(v, 0, 25))}
                />
                <RangeField
                  value={expectedReturn}
                  min={0}
                  max={25}
                  step={0.1}
                  onChange={(v) => setExpectedReturn(clamp(v, 0, 25))}
                />
                <SliderMarks marks={["0%", "7.5%", "12%", "17.5%", "25%"]} />
              </div>
              <div>
                <FieldLabel>Current savings</FieldLabel>
                <MoneyInput
                  value={currentSavings}
                  onChange={(v) => setCurrentSavings(clamp(v, 0, 1e12))}
                  placeholder="Existing corpus"
                />
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
              ["Years to save", String(yearsToSave)],
              ["Monthly SIP (approx.)", formatINR(monthlyNeeded)],
              ["Total invested", formatINR(totalInvestedApprox)],
              ["Total growth", formatINR(totalGrowthApprox)],
              ["Inflation-adjusted target", formatINR(targetInflationAdjusted)],
              ["Net target after growth", formatINR(finalTargetNet)],
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
