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
  LineController,
  PointElement,
  LineElement,
  Title,
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
  canvasToPdfJpeg,
} from "@/lib/pdf-branded";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  LineElement,
  Title
);

const EMI_CHART_OPTIONS = {
  ...DISPLAY_CHART_OPTIONS,
  interaction: { mode: "index", intersect: false },
  scales: {
    ...DISPLAY_CHART_OPTIONS.scales,
    balanceAxis: {
      position: "right",
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: (value) => {
          const n = Number(value);
          if (!Number.isFinite(n)) return value;
          if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
          if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
          return `${Math.round(n / 1000).toLocaleString("en-IN")}k`;
        },
      },
    },
  },
};

export default function HomeLoanEMIPage() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureMode, setTenureMode] = useState("years");
  const [showYearAccordion, setShowYearAccordion] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "EMI Calculator",
  });

  const pieContainerRef = useRef(null);
  const barContainerRef = useRef(null);

  useEffect(() => {
    import("@/lib/pdf-branded").then((m) => m.loadImageAsDataURL("/newlogo.png"));
  }, []);

  const months = useMemo(
    () =>
      tenureMode === "years"
        ? Math.max(1, Math.round(tenure)) * 12
        : Math.max(1, Math.round(tenure)),
    [tenure, tenureMode]
  );

  const monthlyRate = useMemo(() => rate / 12 / 100, [rate]);

  const EMI = useMemo(() => {
    const principal = Number(loan);
    if (!Number.isFinite(principal) || principal <= 0) return 0;
    if (monthlyRate <= 0) return principal / months;
    const x = Math.pow(1 + monthlyRate, months);
    if (!Number.isFinite(x) || x <= 1) return 0;
    return (principal * monthlyRate * x) / (x - 1);
  }, [loan, monthlyRate, months]);

  const principalNum = Number.isFinite(Number(loan)) ? Math.max(0, Number(loan)) : 0;
  const totalPayment = EMI * months;
  const totalInterest = Math.max(0, totalPayment - principalNum);

  const schedule = useMemo(() => {
    const rows = [];
    if (!Number.isFinite(principalNum) || principalNum <= 0) return [];
    let balance = principalNum;

    for (let m = 1; m <= months; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = Math.min(Math.max(EMI - interestPart, 0), balance);
      const payment = principalPart + interestPart;
      balance = Math.max(balance - principalPart, 0);

      const date = new Date();
      date.setMonth(date.getMonth() + m - 1);
      const year = date.getFullYear();
      const monthName = date.toLocaleString("en-IN", { month: "short" });

      rows.push({
        idx: m,
        year,
        monthName,
        principalPart,
        interestPart,
        payment,
        balance,
      });
    }

    const yearsMap = {};
    rows.forEach((r) => {
      if (!yearsMap[r.year]) yearsMap[r.year] = [];
      yearsMap[r.year].push(r);
    });

    return Object.keys(yearsMap)
      .map((y) => parseInt(y, 10))
      .sort((a, b) => a - b)
      .map((y) => ({
        year: y,
        months: yearsMap[y],
        totals: {
          principal: yearsMap[y].reduce((s, it) => s + it.principalPart, 0),
          interest: yearsMap[y].reduce((s, it) => s + it.interestPart, 0),
          payment: yearsMap[y].reduce((s, it) => s + it.payment, 0),
          endBalance: yearsMap[y][yearsMap[y].length - 1].balance,
        },
      }));
  }, [principalNum, monthlyRate, EMI, months]);

  const yearlyChartData = useMemo(
    () => ({
      labels: schedule.map((s) => s.year.toString()),
      datasets: [
        {
          label: "Principal",
          type: "bar",
          data: schedule.map((s) => Math.round(s.totals.principal)),
          backgroundColor: "#93C5FD",
        },
        {
          label: "Interest",
          type: "bar",
          data: schedule.map((s) => Math.round(s.totals.interest)),
          backgroundColor: "#2563EB",
        },
        {
          label: "Balance",
          type: "line",
          data: schedule.map((s) => Math.round(s.totals.endBalance)),
          borderColor: "#0b3b57",
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "balanceAxis",
          fill: false,
        },
      ],
    }),
    [schedule]
  );

  const pieData = useMemo(
    () => ({
      labels: ["Principal", "Interest"],
      datasets: [
        {
          data: [Math.max(principalNum, 0), Math.max(totalInterest, 0)],
          backgroundColor: ["#93C5FD", "#2563EB"],
          borderWidth: 0,
        },
      ],
    }),
    [principalNum, totalInterest]
  );

  const downloadPDF = async () => {
    const pieCanvas = pieContainerRef.current?.querySelector("canvas");
    const barCanvas = barContainerRef.current?.querySelector("canvas");
    const pie = canvasToPdfJpeg(pieCanvas, 420);
    const bar = canvasToPdfJpeg(barCanvas, 720);
    if (!pie || !bar) throw new Error("Charts not ready");
    await createPremiumCalculatorPdf({
      reportTitle: "EMI Home Loan — Advisory Report",
      formData,
      summaryCards: [
        ["Monthly EMI", formatPdfMoney(EMI)],
        ["Tenure", `${months} months`],
        ["Interest rate", `${rate}% p.a.`],
      ],
      metricRows: [
        ["Loan principal", formatPdfMoney(principalNum)],
        ["Monthly EMI", formatPdfMoney(EMI)],
        ["Total interest", formatPdfMoney(totalInterest)],
        ["Total payment", formatPdfMoney(totalPayment)],
      ],
      pieImage: pie,
      barImage: bar,
      lineLabels: yearlyChartData.labels,
      lineValues: yearlyChartData.datasets[2].data.map(Number),
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

  function toggleYear(year) {
    setShowYearAccordion((prev) => ({ ...prev, [year]: !prev[year] }));
  }

  return (
    <CalculatorShell
      title="EMI Home Loan"
      highlight="Calculator"
      breadcrumb="EMI Calculator"
      description="Estimate your monthly EMI, total interest, and year-wise repayment schedule for a home loan."
      about={
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          <h2 className="text-xl font-bold text-slate-900">What is an EMI?</h2>
          <p>
            An Equated Monthly Instalment (EMI) is a fixed payment you make each month toward a loan. It
            covers both principal and interest so the loan is repaid over the chosen tenure.
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Why use this calculator?</h3>
          <p>
            Compare loan amounts, rates, and tenures; see how interest stacks against principal; and download
            a branded advisory PDF for your records.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CalcCard title="Loan inputs">
            <div className="space-y-5">
              <div>
                <FieldLabel>Home loan amount</FieldLabel>
                <MoneyInput
                  value={loan}
                  onChange={(v) => setLoan(clamp(v, 0, 1e10))}
                  placeholder="Loan amount"
                />
              </div>
              <div>
                <FieldLabel>Interest rate (% p.a.)</FieldLabel>
                <NumberField
                  value={rate}
                  min={5}
                  max={20}
                  step={0.1}
                  onChange={(v) => setRate(clamp(v, 5, 20))}
                />
                <RangeField
                  value={rate}
                  min={5}
                  max={20}
                  step={0.1}
                  onChange={(v) => setRate(clamp(v, 5, 20))}
                />
                <SliderMarks marks={["5%", "7.5%", "10%", "12.5%", "15%", "17.5%", "20%"]} />
              </div>
              <div>
                <FieldLabel>Loan tenure</FieldLabel>
                <div className="mb-3 flex items-center gap-4 text-sm font-semibold text-slate-800">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={tenureMode === "years"}
                      onChange={() => setTenureMode("years")}
                      className="accent-sky-700"
                    />
                    Years
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={tenureMode === "months"}
                      onChange={() => setTenureMode("months")}
                      className="accent-sky-700"
                    />
                    Months
                  </label>
                </div>
                <NumberField
                  value={tenure}
                  min={1}
                  max={tenureMode === "years" ? 40 : 480}
                  onChange={(v) =>
                    setTenure(clamp(v, 1, tenureMode === "years" ? 40 : 480))
                  }
                />
                <p className="text-xs text-slate-500">
                  Enter tenure in {tenureMode === "years" ? "years" : "months"} ({months} months total).
                </p>
              </div>
            </div>
          </CalcCard>

          <div ref={barContainerRef}>
            <ChartPanel title="Principal, interest & balance by year">
              <Bar data={yearlyChartData} options={EMI_CHART_OPTIONS} />
            </ChartPanel>
          </div>
        </div>

        <div className="space-y-5">
          <CalcCard
            title="Breakdown"
            action={<DownloadButton busy={pdfBusy} onClick={() => setShowForm(true)} />}
          >
            <div className="mx-auto w-full max-w-[240px]" ref={pieContainerRef}>
              <Pie data={pieData} options={DISPLAY_PIE_OPTIONS} />
            </div>
          </CalcCard>

          <ResultPanel
            rows={[
              ["Monthly EMI", formatINR(EMI)],
              ["Total interest", formatINR(totalInterest)],
              ["Total payment", formatINR(totalPayment)],
            ]}
          />
        </div>
      </div>

      {schedule.length > 0 ? (
        <div className="mt-6">
          <CalcCard title="Amortization schedule">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-sky-700 text-white">
                    <th className="px-3 py-2.5 font-semibold" />
                    <th className="px-3 py-2.5 font-semibold">Year</th>
                    <th className="px-3 py-2.5 font-semibold">Principal</th>
                    <th className="px-3 py-2.5 font-semibold">Interest</th>
                    <th className="px-3 py-2.5 font-semibold">Total payment</th>
                    <th className="px-3 py-2.5 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((y) => {
                    const opened = !!showYearAccordion[y.year];
                    return (
                      <React.Fragment key={y.year}>
                        <tr className="border-b border-slate-200 text-slate-800">
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => toggleYear(y.year)}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium hover:bg-slate-50"
                            >
                              {opened ? "−" : "+"}
                            </button>
                          </td>
                          <td className="px-3 py-3 font-semibold">{y.year}</td>
                          <td className="px-3 py-3 tabular-nums">{formatINR(y.totals.principal)}</td>
                          <td className="px-3 py-3 tabular-nums">{formatINR(y.totals.interest)}</td>
                          <td className="px-3 py-3 tabular-nums">{formatINR(y.totals.payment)}</td>
                          <td className="px-3 py-3 tabular-nums">{formatINR(y.totals.endBalance)}</td>
                        </tr>
                        {opened ? (
                          <tr className="bg-slate-50">
                            <td colSpan={6} className="p-0">
                              {y.months.map((m) => (
                                <div
                                  key={m.idx}
                                  className="grid grid-cols-12 gap-2 border-b border-slate-100 px-4 py-2.5 text-xs text-slate-700 sm:text-sm"
                                >
                                  <div className="col-span-3">{m.monthName}</div>
                                  <div className="col-span-3 tabular-nums">{formatINR(m.principalPart)}</div>
                                  <div className="col-span-3 tabular-nums">{formatINR(m.interestPart)}</div>
                                  <div className="col-span-3 tabular-nums">{formatINR(m.balance)}</div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CalcCard>
        </div>
      ) : null}

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
