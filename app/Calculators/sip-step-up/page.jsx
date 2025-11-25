"use client";


import React, { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);


const formatNum = (num) => {
  if (!isFinite(num)) return "₹ 0";
  if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
  if (num >= 1e3) return `₹ ${(num / 1e3).toFixed(2)} K`;
  return `₹ ${Number(num).toLocaleString("en-IN")}`;
};


export default function StepUpSIPCalculatorPage() {

  const [monthly, setMonthly] = useState(25000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [stepUp, setStepUp] = useState(10);

  const pieRef = useRef(null);
  const barRef = useRef(null);


  const simulation = useMemo(() => {
    const totalMonths = years * 12;
    const monthlyRate = annualReturn / 100 / 12;
    let balance = 0;
    let totalInvested = 0;
    const yearly = [];


    const sipPerYear = [];
    for (let y = 1; y <= years; y++) {
      const factor = Math.pow(1 + stepUp / 100, y - 1);
      sipPerYear.push(monthly * factor);
    }


    let monthIndex = 0;
    for (let y = 0; y < years; y++) {
      const sipMonthlyThisYear = sipPerYear[y];
      let investedThisYear = 0;

      for (let m = 0; m < 12; m++) {

        balance += sipMonthlyThisYear;
        investedThisYear += sipMonthlyThisYear;
        totalInvested += sipMonthlyThisYear;


        balance *= 1 + monthlyRate;
        monthIndex++;
      }
      yearly.push({
        year: y + 1,
        sipMonthly: sipMonthlyThisYear,
        investedYear: investedThisYear,
        valueAtYearEnd: balance,
      });
    }

    const totalValue = balance;
    const totalGrowth = totalValue - totalInvested;

    return {
      yearly,
      totalInvested,
      totalValue,
      totalGrowth,
    };
  }, [monthly, years, annualReturn, stepUp]);


  const pieData = {
    labels: ["Total Invested", "Total Growth"],
    datasets: [
      {
        data: [simulation.totalInvested, simulation.totalGrowth],
        backgroundColor: ["#93C5FD", "#3B82F6"],
      },
    ],
  };

  const growthData = {
    labels: simulation.yearly.map((y) => `Y${y.year}`),
    datasets: [
      {
        label: "Invested (cumulative)",
        data: simulation.yearly.map((y) => Number(y.investedYear)),
        backgroundColor: "#93C5FD",
      },
      {
        label: "Value at Year End",
        data: simulation.yearly.map((y) => Math.round(y.valueAtYearEnd)),
        backgroundColor: "#3B82F6",
      },
    ],
  };


  const getCanvas = (ref) =>
    ref.current?.canvas || ref.current?.ctx?.canvas || ref.current?.chart?.canvas || null;


  const downloadPDF = () => {
    const pieCanvas = getCanvas(pieRef);
    const barCanvas = getCanvas(barRef);
    if (!pieCanvas || !barCanvas) {
      alert("Please wait for charts to render.");
      return;
    }
    const pie = pieCanvas.toDataURL("image/png");
    const bar = barCanvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const W = pdf.internal.pageSize.getWidth();
    let y = 30;


    pdf.setFillColor("#3B82F6");
    pdf.rect(0, 0, W, 50, "F");
    pdf.setTextColor("#fff").setFontSize(18);
    pdf.text("Pioneer Wealth - SIP Step Up Report", 30, 35);
    pdf.setFontSize(9).text(`Generated: ${new Date().toLocaleString()}`, W - 170, 36);


    y = 70;
    const boxes = [
      ["Base Monthly SIP", formatNum(monthly)],
      ["Duration", `${years} years`],
      ["Return (p.a.)", `${annualReturn}%`],
      ["Step-up (yr)", `${stepUp}%`],
    ];
    const boxW = (W - 80) / 4;
    boxes.forEach((b, i) => {
      const x = 30 + i * (boxW + 8);
      pdf.roundedRect(x, y, boxW, 46, 6, 6);
      pdf.setFontSize(9).setTextColor("#555").text(b[0], x + 8, y + 16);
      pdf.setFontSize(12).setTextColor("#000").text(b[1], x + 8, y + 34);
    });


    y += 70;
    pdf.setFontSize(14).setTextColor("#000").text("Investment Breakdown", 30, y);
    y += 12;
    pdf.addImage(pie, "PNG", 30, y, 180, 160);


    const summaryX = 240;
    pdf.setFontSize(12).text("Totals", summaryX, y);
    pdf.setFontSize(10).text("Total Invested:", summaryX, y + 20);
    pdf.setFontSize(11).text(formatNum(simulation.totalInvested), summaryX + 180, y + 20, { align: "right" });
    pdf.setFontSize(10).text("Total Growth:", summaryX, y + 40);
    pdf.setFontSize(11).text(formatNum(simulation.totalGrowth), summaryX + 180, y + 40, { align: "right" });
    pdf.setFontSize(10).text("Future Value:", summaryX, y + 60);
    pdf.setFontSize(11).text(formatNum(simulation.totalValue), summaryX + 180, y + 60, { align: "right" });


    y += 180;
    pdf.setFontSize(14).text("Year-wise Summary", 30, y);
    y += 12;


    const tableX = 30;
    const tableW = W - 60;
    const col1 = tableX + 10;
    const col2 = tableX + tableW * 0.33;
    const col3 = tableX + tableW * 0.60;
    pdf.setFillColor("#3B82F6");
    pdf.rect(tableX, y, tableW, 24, "F");
    pdf.setFontSize(11).setTextColor("#fff");
    pdf.text("Year", col1, y + 16);
    pdf.text("SIP / month", col2, y + 16);
    pdf.text("Invested (year)", col3, y + 16);
    pdf.text("Value End", tableX + tableW - 10, y + 16, { align: "right" });

    y += 28;
    pdf.setFontSize(10).setTextColor("#000");


    const rowH = 20;
    for (let i = 0; i < simulation.yearly.length; i++) {
      if (y + rowH > pdf.internal.pageSize.getHeight() - 120) {

        pdf.addPage();
        y = 40;
        break;
      }
      const row = simulation.yearly[i];

      if (i % 2 === 0) {
        pdf.setFillColor("#f6f6f6");
        pdf.rect(tableX, y, tableW, rowH, "F");
      }
      pdf.setTextColor("#333");
      pdf.text(String(row.year), col1, y + 14);
      pdf.text(formatNum(Math.round(row.sipMonthly)), col2, y + 14);
      pdf.text(formatNum(Math.round(row.investedYear)), col3, y + 14);
      pdf.text(formatNum(Math.round(row.valueAtYearEnd)), tableX + tableW - 10, y + 14, { align: "right" });
      y += rowH;
    }


    if (y + 220 > pdf.internal.pageSize.getHeight()) {
      pdf.addPage();
      y = 40;
    } else {
      y += 20;
    }

    pdf.setFontSize(14).text("Projected SIP Growth (Yearly)", 30, y);
    y += 12;
    pdf.addImage(bar, "PNG", 30, y, W - 60, 220);

    pdf.save("Pioneer-SIP-StepUp-Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl font-semibold text-white-900 mb-2">
            Mutual Fund SIP <span className="text-yellow-300">Calculator </span> Step Up
          </h1>
          <div className="flex justify-center gap-2 text-sm text-white-600">
            <Link href="/">Home</Link>

            <span className="text-white-400">/</span>
            <span>Tools & Calculators</span>
            <span className="text-gray-400">/</span>
            <span className="text-[white] font-medium">Step Up Calculator</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-gray-700 mb-2 font-medium">How much you can invest through monthly SIP? (Rs)</label>
              <input type="number" className="w-full border rounded p-3 mb-3" value={monthly} onChange={(e) => setMonthly(Number(e.target.value || 0))} />
              <input type="range" min={0} max={10000000} step={100} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-gray-700 mb-2 font-medium">How many years will you continue the SIP?</label>
              <input type="number" className="w-full border rounded p-3 mb-3" value={years} onChange={(e) => setYears(Number(e.target.value || 0))} />
              <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-gray-700 mb-2 font-medium">What rate of return do you expect? (% p.a.)</label>
              <input type="number" className="w-full border rounded p-3 mb-3" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value || 0))} />
              <input type="range" min={0} max={30} step={0.1} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="block text-gray-700 mb-2 font-medium">What percentage step up monthly SIP? (% per year)</label>
              <input type="number" className="w-full border rounded p-3 mb-3" value={stepUp} onChange={(e) => setStepUp(Number(e.target.value || 0))} />
              <input type="range" min={0} max={60} step={0.1} value={stepUp} onChange={(e) => setStepUp(Number(e.target.value))} className="w-full" />
            </div>
          </div>


          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Break-up of Total Payment</h4>
                <button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm">Download</button>
              </div>
              <div className="mt-4">
                <Pie ref={pieRef} data={pieData} />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md border border-blue-400">
              <h4 className="font-semibold text-blue-100 mb-3 text-center">Monthly SIP Summary</h4>
              <div className="text-center text-xl font-semibold mb-2">{formatNum(Math.round(monthly))}</div>
              <div className="space-y-3">
                <div className="flex justify-between  border-t pt-3">
                  <span className="text-blue-100">Total Invested</span>
                  <b>{formatNum(Math.round(simulation.totalInvested))}</b>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-blue-100">Total Growth</span>
                  <b>{formatNum(Math.round(simulation.totalGrowth))}</b>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-blue-100">Future Value</span>
                  <b>{formatNum(Math.round(simulation.totalValue))}</b>
                </div>
              </div>
            </div>
          </div>
        </div>


        <section className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3 text-center">Projected SIP Growth</h3>
          <div className="max-w-4xl mx-auto">
            <Bar ref={barRef} data={growthData} />
          </div>
        </section>



        <section className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4 text-xl">
            SIP Calculator Step Up Amount Invested Summary
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">


              <thead>
                <tr className="bg-[#3B82F6] text-white border border-gray-300">
                  <th className="px-4 py-3 border border-gray-300">Year</th>
                  <th className="px-4 py-3 border border-gray-300">SIP Amount / Month</th>
                  <th className="px-4 py-3 border border-gray-300">Invested Amount / Year</th>
                  <th className="px-4 py-3 border border-gray-300">Total Invested Amount</th>
                  <th className="px-4 py-3 border border-gray-300">Value at Year End</th>
                </tr>
              </thead>


              <tbody>
                {simulation.yearly.map((row, index) => {
                  const cumulative = simulation.yearly
                    .slice(0, index + 1)
                    .reduce((s, x) => s + x.investedYear, 0);

                  return (
                    <tr
                      key={index}
                      className="border border-gray-300"
                    >
                      <td className="px-4 py-3 border border-gray-300">
                        {`Year${row.year}`}
                      </td>

                      <td className="px-4 py-3 border border-gray-300">
                        {formatNum(Math.round(row.sipMonthly))}
                      </td>

                      <td className="px-4 py-3 border border-gray-300">
                        {formatNum(Math.round(row.investedYear))}
                      </td>

                      <td className="px-4 py-3 border border-gray-300">
                        {formatNum(Math.round(cumulative))}
                      </td>

                      <td className="px-4 py-3 border border-gray-300">
                        {formatNum(Math.round(row.valueAtYearEnd))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            <section className="max-w-6xl mx-auto px-4 py-10 text-gray-700 leading-relaxed text-[13px]">

              <h3 className="text-[14px] font-semibold text-gray-900 mb-2">
                Disclaimer:
              </h3>

              <p className="mb-3">
                We have gathered all the data, information, statistics from the sources believed
                to be highly reliable and true. All necessary precautions have been taken to avoid
                any error, lapse or insufficiency; however, no representations or warranties are made
                (express or implied) as to the reliability, accuracy or completeness of such information.
                We cannot be held liable for any loss arising directly or indirectly from the use of, or
                any action taken in on, any information appearing herein. The user is advised to verify
                the contents of the report independently.
              </p>

              <p className="mb-3">
                Returns less than 1 year are in absolute (%) and greater than 1 year are compounded
                annualised (CAGR %). SIP returns are shown in XIRR (%).
              </p>

              <p className="mb-3">
                The Risk Level of any of the schemes must always be commensurate with the risk profile,
                investment objective or financial goals of the investor concerned. Mutual Fund Distributors
                (MFDs) or Registered Investment Advisors (RIAs) should assess the risk profile and investment
                needs of individual investors into consideration and make scheme(s) or asset allocation
                recommendations accordingly.
              </p>

              <p className="font-semibold text-gray-900">
                Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
                Past performance may or may not be sustained in the future. Investors should always invest
                according to their risk profile and consult with their mutual fund distributors or financial
                advisor before investing.
              </p>

            </section>

          </div>
        </section>



      </main>
    </div>
  );
}
