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

export default function ChildrenEducationPlanner() {
  const [childAge, setChildAge] = useState(5);
  const [educationAge, setEducationAge] = useState(18);
  const [currentCost, setCurrentCost] = useState(2000000);
  const [educationInflation, setEducationInflation] = useState(8);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "Children Education Planner",
  });

  const pieRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const simulation = useMemo(() => {
    const yearsToGoal = Math.max(0, educationAge - childAge);

    if (yearsToGoal <= 0) {
      return {
        yearsToGoal: 0,
        futureCost: currentCost,
        sip: 0,
        totalInvested: 0,
        totalValue: 0,
        growth: 0,
        yearly: [],
      };
    }

    const futureCost = currentCost * Math.pow(1 + educationInflation / 100, yearsToGoal);

    const months = yearsToGoal * 12;
    const monthlyRate = annualReturn / 100 / 12;

    let sip = 0;
    if (monthlyRate === 0) {
      sip = futureCost / months;
    } else {
      sip = (futureCost * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    let balance = 0;
    let totalInvested = 0;
    const yearly = [];

    for (let y = 1; y <= yearsToGoal; y++) {
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
      yearsToGoal,
      futureCost,
      sip,
      totalInvested,
      totalValue: balance,
      growth: balance - totalInvested,
      yearly,
    };
  }, [childAge, educationAge, currentCost, educationInflation, annualReturn]);

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
      reportTitle: "Education Goal — Advisory Report",
      formData,
      summaryCards: [
        ["Child current age", `${childAge} years`],
        ["Education start age", `${educationAge} years`],
        ["Future education cost", formatPdfMoney(simulation.futureCost)],
        ["Required monthly SIP", formatPdfMoney(simulation.sip)],
      ],
      metricRows: [
        ["Total invested", formatPdfMoney(simulation.totalInvested)],
        ["Total growth", formatPdfMoney(simulation.growth)],
        ["Final portfolio value", formatPdfMoney(simulation.totalValue)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: simulation.yearly.map((y) => `Year ${y.year}`),
      lineValues: simulation.yearly.map((y) => Math.round(y.value)),
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
      title="Children Education"
      highlight="Planner"
      breadcrumb="Education"
      description="Estimate the future cost of education and the monthly SIP needed to fund it, given inflation and expected returns."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">Plan for education costs</h2>
          <p>
            Education costs often rise faster than general inflation. This planner projects future fees and
            suggests a monthly SIP to reach that goal by the chosen start age.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Compare timelines and return assumptions, then download a branded advisory PDF to share with your
            family or advisor.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Education inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Child&apos;s current age (years)</FieldLabel>
                <NumberField
                  value={childAge}
                  min={0}
                  max={25}
                  onChange={(v) => {
                    const next = clamp(v, 0, 25);
                    setChildAge(next);
                    if (educationAge <= next) setEducationAge(Math.min(30, next + 1));
                  }}
                />
                <RangeField
                  value={childAge}
                  min={0}
                  max={25}
                  onChange={(v) => {
                    setChildAge(v);
                    if (educationAge <= v) setEducationAge(Math.min(30, v + 1));
                  }}
                />
                <SliderMarks marks={["0", "5", "10", "15", "20", "25"]} />
              </div>
              <div>
                <FieldLabel>Education start age (years)</FieldLabel>
                <NumberField
                  value={educationAge}
                  min={childAge + 1}
                  max={30}
                  onChange={(v) => setEducationAge(clamp(v, childAge + 1, 30))}
                />
                <RangeField
                  value={educationAge}
                  min={childAge + 1}
                  max={30}
                  onChange={(v) => setEducationAge(clamp(v, childAge + 1, 30))}
                />
                <SliderMarks marks={["10", "15", "18", "22", "25", "30"]} />
              </div>
              <div>
                <FieldLabel>Current education cost</FieldLabel>
                <MoneyInput
                  value={currentCost}
                  onChange={(v) => setCurrentCost(clamp(v, 0, 1e10))}
                  placeholder="Today's cost"
                />
              </div>
              <div>
                <FieldLabel>Education inflation (% p.a.)</FieldLabel>
                <NumberField
                  value={educationInflation}
                  min={0}
                  max={20}
                  step={0.1}
                  onChange={(v) => setEducationInflation(clamp(v, 0, 20))}
                />
                <RangeField
                  value={educationInflation}
                  min={0}
                  max={20}
                  step={0.1}
                  onChange={(v) => setEducationInflation(clamp(v, 0, 20))}
                />
                <SliderMarks marks={["0%", "5%", "8%", "12%", "16%", "20%"]} />
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
                <SliderMarks marks={["0%", "7%", "12%", "18%", "24%", "30%"]} />
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
              ["Years to goal", String(simulation.yearsToGoal)],
              ["Future education cost", formatINR(simulation.futureCost)],
              ["Required monthly SIP", formatINR(simulation.sip)],
              ["Total invested", formatINR(simulation.totalInvested)],
              ["Total growth", formatINR(simulation.growth)],
              ["Final portfolio value", formatINR(simulation.totalValue)],
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
