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

export default function SIPAnnualIncreaseCalculator() {
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [annualIncrease, setAnnualIncrease] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "SIP Annual Increase Calculator",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const baseSIP = monthlySIP || 0;
    const monthlyRate = annualReturn / 100 / 12;
    let balance = 0;
    let totalInvested = 0;
    const yearlyData = [];

    for (let y = 1; y <= years; y++) {
      const increasedSIP = baseSIP * Math.pow(1 + annualIncrease / 100, y - 1);
      let investedThisYear = 0;

      for (let m = 0; m < 12; m++) {
        balance += increasedSIP;
        investedThisYear += increasedSIP;
        totalInvested += increasedSIP;
        balance *= 1 + monthlyRate;
      }

      yearlyData.push({
        year: y,
        sip: increasedSIP,
        investedThisYear,
        invested: totalInvested,
        value: balance,
      });
    }

    return {
      yearlyData,
      totalInvested,
      totalValue: balance,
      growth: Math.max(0, balance - totalInvested),
    };
  }, [monthlySIP, years, annualReturn, annualIncrease]);

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
      labels: simulation.yearlyData.map((y) => `Y${y.year}`),
      datasets: [
        {
          label: "Invested",
          data: simulation.yearlyData.map((y) => Math.round(y.invested)),
          backgroundColor: "#93C5FD",
        },
        {
          label: "Portfolio value",
          data: simulation.yearlyData.map((y) => Math.round(y.value)),
          backgroundColor: "#2563EB",
        },
      ],
    }),
    [simulation.yearlyData]
  );

  const downloadPDF = async () => {
    const pie = canvasToPdfJpeg(getChartCanvas(pieRef), 420);
    const bar = canvasToPdfJpeg(getChartCanvas(barRef), 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "SIP Annual Increase — Advisory Report",
      formData,
      summaryCards: [
        ["Base Monthly SIP", formatPdfMoney(monthlySIP)],
        ["Duration", `${years} Years`],
        ["Expected Return", `${annualReturn}%`],
        ["Annual Increase", `${annualIncrease}%`],
      ],
      metricRows: [
        ["Total Invested", formatPdfMoney(simulation.totalInvested)],
        ["Total Growth", formatPdfMoney(simulation.growth)],
        ["Future Value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.yearlyData.map((row) => `Year ${row.year}`),
      lineValues: simulation.yearlyData.map((row) => Math.round(row.value)),
      extraTables: [
        {
          title: "Year-wise SIP Growth Summary",
          rows: simulation.yearlyData.map((row) => [
            `Year ${row.year} (SIP ${formatPdfMoney(row.sip)})`,
            `Invested ${formatPdfMoney(row.invested)} / Value ${formatPdfMoney(row.value)}`,
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
      title="SIP Annual Increase"
      highlight="Calculator"
      breadcrumb="SIP Annual Increase"
      description="Model a SIP that rises every year. Adjust base amount, annual increase, tenure, and expected return to project your corpus."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is an annual increase SIP?</h2>
          <p>
            An annual increase SIP raises your monthly contribution by a set percentage each year. It mirrors salary
            growth and can compound wealth more effectively than a fixed SIP.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Estimate how yearly top-ups change invested amount and future value, then download a branded PDF for
            advisory or personal planning.
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
                  value={monthlySIP}
                  onChange={(v) => setMonthlySIP(clamp(v, 0, 1e9))}
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
              <div>
                <FieldLabel>Annual increase (%)</FieldLabel>
                <NumberField
                  value={annualIncrease}
                  min={0}
                  max={60}
                  step={0.1}
                  onChange={(v) => setAnnualIncrease(clamp(v, 0, 60))}
                />
                <RangeField
                  value={annualIncrease}
                  min={0}
                  max={60}
                  step={0.1}
                  onChange={(v) => setAnnualIncrease(clamp(v, 0, 60))}
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
