"use client";

import React, { useMemo, useRef, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import Link from "next/link";
import "@/lib/chartjs-fix";
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
    TimeScale,
    Title
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    TimeScale,
    Title
);

export default function HomeLoanEMIPage() {

    const [loan, setLoan] = useState();
    const [rate, setRate] = useState(12.5);
    const [tenure, setTenure] = useState(20);
    const [tenureMode, setTenureMode] = useState("years");
    const [showYearAccordion, setShowYearAccordion] = useState({});

    const pieContainerRef = useRef(null);
    const barContainerRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        goal: "",
        calculatorType: "EMI Calculator",
    });

    const months = useMemo(
        () =>
            tenureMode === "years"
                ? Math.max(1, Math.round(tenure)) * 12
                : Math.max(1, Math.round(tenure)),
        [tenure, tenureMode]
    );

    const monthlyRate = useMemo(() => rate / 12 / 100, [rate]);

    const EMI = useMemo(() => {
        if (monthlyRate <= 0) return loan / months;
        const x = Math.pow(1 + monthlyRate, months);
        return (loan * monthlyRate * x) / (x - 1);
    }, [loan, monthlyRate, months]);

    const totalPayment = EMI * months;
    const totalInterest = totalPayment - loan;


    const schedule = useMemo(() => {
        const rows = [];
        let balance = loan;

        for (let m = 1; m <= months; m++) {
            const interestPart = balance * monthlyRate;
            const principalPart = Math.min(Math.max(EMI - interestPart, 0), balance);
            const payment = principalPart + interestPart;
            balance = Math.max(balance - principalPart, 0);

            const date = new Date();
            date.setMonth(date.getMonth() + m - 1);
            const year = date.getFullYear();
            const monthName = date.toLocaleString("default", { month: "short" });

            rows.push({
                idx: m,
                year,
                monthName,
                principalPart,
                interestPart,
                payment,
                balance
            });
        }


        const yearsMap = {};
        rows.forEach((r) => {
            if (!yearsMap[r.year]) yearsMap[r.year] = [];
            yearsMap[r.year].push(r);
        });

        return Object.keys(yearsMap)
            .map((y) => parseInt(y))
            .sort((a, b) => a - b)
            .map((y) => ({
                year: y,
                months: yearsMap[y],
                totals: {
                    principal: yearsMap[y].reduce((s, it) => s + it.principalPart, 0),
                    interest: yearsMap[y].reduce((s, it) => s + it.interestPart, 0),
                    payment: yearsMap[y].reduce((s, it) => s + it.payment, 0),
                    endBalance: yearsMap[y][yearsMap[y].length - 1].balance
                }
            }));
    }, [loan, monthlyRate, EMI, months]);

    const handleSubmitForm = async () => {
        const { name, email, mobile, goal, calculatorType } = formData;


        if (!name.trim() || !email.trim() || !mobile.trim() || !goal.trim()) {
            alert("Please fill the form before downloading PDF.");
            return;
        }


        const res = await fetch("/api/sip-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                mobile,
                goal,
                calculatorType,
            }),
        });

        if (res.ok) {
            setShowForm(false);
            downloadPDF();
            alert("Your PDF has been successfully downloaded! 🎉");
        } else {
            alert("Something went wrong! Please try again.");
        }
    };
    const yearlyChartData = useMemo(() => {
        return {
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
                    backgroundColor: "#3B82F6",
                },
                {
                    label: "Balance",
                    type: "line",
                    data: schedule.map((s) => Math.round(s.totals.endBalance)),
                    borderColor: "#0b3b57",
                    borderWidth: 2,
                    pointRadius: 3,
                    yAxisID: "balanceAxis",
                    fill: false
                }
            ]
        };
    }, [schedule]);

    const yearlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `₹ ${Math.round(value).toLocaleString("en-IN")}`
                }
            },
            balanceAxis: {
                position: "right",
                beginAtZero: true,
                grid: { display: false },
                ticks: {
                    callback: (value) => `${Math.round(value / 1000).toLocaleString()}k`
                }
            }
        },
        plugins: {
            legend: { position: "top" },
            title: { display: false }
        }
    };

    const pieData = useMemo(() => {
        return {
            labels: ["Principal", "Interest"],
            datasets: [
                {
                    data: [loan, totalInterest],
                    backgroundColor: ["#93C5FD", "#3B82F6"],
                    borderWidth: 0
                }
            ]
        };
    }, [loan, totalInterest]);


    const fmt = (v) => `₹ ${Math.round(v).toLocaleString("en-IN")}`;

    const downloadPDF = () => {
        try {

            const pieCanvas = pieContainerRef.current?.querySelector("canvas");
            const barCanvas = barContainerRef.current?.querySelector("canvas");

            if (!pieCanvas || !barCanvas) {
                alert("Charts not ready — please wait a moment and try again.");
                return;
            }

            const pieImg = pieCanvas.toDataURL("image/png");
            const barImg = barCanvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "pt", "a4");
            const W = pdf.internal.pageSize.getWidth();
            let y = 35;


            pdf.setFillColor("#3B82F6");
            pdf.rect(0, 0, W, 55, "F");
            pdf.setFontSize(18).setTextColor("#fff");
            pdf.text("Pioneer Wealth - EMI Report", 30, 35);
            pdf.setFontSize(9).setTextColor("#fff");
            pdf.text(`Generated: ${new Date().toLocaleString()}`, W - 200, 35);

            y = 80;
            pdf.setFontSize(12).setTextColor("#000");
            pdf.text("Investment Breakdown", 30, y - 10);
            pdf.addImage(pieImg, "PNG", 30, y, 200, 200);


            const boxW = (W - 280) / 3;
            const summary = [
                ["Monthly EMI", fmt(EMI)],
                ["Tenure", `${months} months`],
                ["Total Interest", fmt(totalInterest)]
            ];
            summary.forEach((s, i) => {
                const x = 250 + i * (boxW + 10);
                pdf.roundedRect(x, 90, boxW, 50, 5, 5);
                pdf.setFontSize(10).setTextColor("#333").text(s[0], x + 8, 110);
                pdf.setFontSize(12).setTextColor("#000").text(s[1], x + 8, 130);
            });

            // bar chart
            y = 300;
            pdf.setFontSize(14).text("Yearly EMI Projection", 30, y - 10);
            pdf.addImage(barImg, "PNG", 30, y, W - 60, 220);

            const fileName = `${formData.name.replace(/\s+/g, "-")}-${formData.calculatorType.replace(/\s+/g, "-")}.pdf`;
pdf.save(fileName);
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF. See console for details.");
        }
    };

    function toggleYear(year) {
        setShowYearAccordion((prev) => ({ ...prev, [year]: !prev[year] }));
    }


    return (
        <div className="w-full bg-white ">
<section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

            <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
                <div className="max-w-6xl mx-auto text-center px-4">
                    <h1 className="text-4xl font-semibold text-white-900 mb-2">
                        EMI Home Loan <span className="text-yellow-300">Calculator </span>
                    </h1>
                    <div className="flex justify-center gap-2 text-sm text-white-600">
                        <Link href="/">Home</Link>

                        <span className="text-white-400">/</span>
                        <span>Tools & Calculators</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-[white] font-medium">EMI Home Loan Calculator</span>
                    </div>
                </div>
            </section>

            <section className="w-full mt-8 px-6 flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-7xl w-full">

                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md hover:bg-blue-700"
                        >
                            Download
                        </button>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">

                            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">

                                <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                                    Home Loan Amount (₹)
                                </label>


                                <input
                                    type="text"
                                    className="
        w-full border rounded-xl p-3 pr-12 text-gray-800 text-lg font-semibold
        shadow-sm outline-none transition-all duration-300
        group-hover:shadow-lg
      "
                                    value={loan ? loan.toLocaleString("en-IN") : ""}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
                                        setLoan(Number(raw || 0));
                                    }}
                                    placeholder="Enter Loan Amount"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    ₹
                                </span>




                            </div>


                            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                                <label className="block text-[15px] text-gray-800 mb-3 font-semibold">Interest Rate (% per annum)</label>
                                <input readOnly value={rate} className="w-full border rounded-xl p-3 pr-12 text-gray-800 text-lg font-semibold
        shadow-sm outline-none transition-all duration-300
        group-hover:shadow-lg" />
                                <input
                                    type="range"
                                    min={5}
                                    max={20}
                                    step={0.1}
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full "
                                />
                                <div className="flex justify-between text-xs text-gray-800 mt-2">
                                    <span>5</span>
                                    <span>7.5</span>
                                    <span>10</span>
                                    <span>12.5</span>
                                    <span>15</span>
                                    <span>17.5</span>
                                    <span>20</span>
                                </div>
                            </div>


                            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                                <label className="block text-[15px] text-gray-800 mb-3 font-semibold">Loan Tenure</label>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min={1}
                                        value={tenure}
                                        onChange={(e) => setTenure(Number(e.target.value))}
                                        className="p-3 rounded-md text-gray-800 text-lg font-semibold border w-32"
                                    />
                                    <div className="flex items-center gap-3 text-sm">
                                        <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                                            <input
                                                type="radio"
                                                checked={tenureMode === "years"}
                                                onChange={() => setTenureMode("years")}
                                                className="mr-2 "
                                            />
                                            Years
                                        </label>
                                        <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                                            <input
                                                type="radio"
                                                checked={tenureMode === "months"}
                                                onChange={() => setTenureMode("months")}
                                                className="mr-2"
                                            />
                                            Months
                                        </label>
                                    </div>
                                </div>
                                <p className="block text-[15px] text-gray-800 mt-2 font-semibold">Enter tenure in {tenureMode === "years" ? "years" : "months"}.</p>
                            </div>
                        </div>


                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                                <div className="flex justify-center">
                                    <div style={{ width: 250 }} ref={pieContainerRef}>
                                        <Pie data={pieData} />
                                        <div className="flex justify-center gap-4 mt-3 text-sm">
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-[#3B82F6] inline-block rounded-sm" /> Interest Amount
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-[#93C5FD] inline-block rounded-sm" /> Principal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md border border-blue-400">
                                <div className="space-y-4">
                                    <div className="text-center border-b pb-4">
                                        <p className="text-blue-100 text-sm mb-3">Monthly Payment (EMI)</p>
                                        <p className="text-2xl font-bold text-blue-100 mt-2">{fmt(EMI)}</p>
                                    </div>

                                    <div className="text-center border-b pb-4 pt-4">
                                        <p className="text-sm text-gray-100">Total Interest Payable</p>
                                        <p className="text-2xl font-bold text-blue-100 mt-2">{fmt(totalInterest)}</p>
                                    </div>

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-gray-100">Total Payment (Principal + Interest)</p>
                                        <p className="text-2xl font-bold text-blue-100 mt-2">{fmt(totalPayment)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-center text-lg  text-gray-800 font-semibold mb-4">(EMI) Chart</h3>

                        <div className="bg-white border rounded-lg p-4">
                            <div className="w-full h-[420px]" ref={barContainerRef}>
                                <Bar data={yearlyChartData} options={yearlyChartOptions} />
                            </div>
                        </div>


                        <div className="mt-8">
                            <div className="bg-white border rounded-lg">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left">
                                        <thead className="bg-[#3B82F6]">
                                            <tr className="bg-[#3B82F6] text-white p-4 rounded-bl-xl rounded-br-xl border-gray-300 border" >
                                                <th className="px-4  border py-3"></th>
                                                <th className="px-4 border  py-3">Year</th>
                                                <th className="px-4  border py-3">Principal (A)</th>
                                                <th className="px-4 border  py-3">Interest (B)</th>
                                                <th className="px-4 border py-3">Total Payment (A + B)</th>
                                                <th className="px-4  border py-3">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((y) => {
                                                const opened = !!showYearAccordion[y.year];

                                                return (
                                                    <React.Fragment key={y.year}>
                                                        <tr className="border-b bg-white text-gray-800 border border-gray-300 ">
                                                            <td className="px-4 py-4 align-top  text-gray-800">
                                                                <button
                                                                    onClick={() => toggleYear(y.year)}
                                                                    className="px-3 py-1 rounded-md border text-sm bg-white"
                                                                >
                                                                    {opened ? "−" : "+"}
                                                                </button>
                                                            </td>

                                                            <td className="px-4 py-4 text-gray-800 border  border-gray-300 font-semibold">{y.year}</td>
                                                            <td className="px-4 py-4 text-gray-800 border  border-gray-300 ">{fmt(y.totals.principal)}</td>
                                                            <td className="px-4 py-4 text-gray-800 border  border-gray-300 ">{fmt(y.totals.interest)}</td>
                                                            <td className="px-4 py-4 text-gray-800  border border-gray-300" >{fmt(y.totals.payment)}</td>
                                                            <td className="px-4 py-4 text-gray-800  border border-gray-300">{fmt(y.totals.endBalance)}</td>
                                                        </tr>

                                                        {opened && (
                                                            <tr className="bg-gray-50 text-gray-800">
                                                                <td colSpan={6} className="p-0">
                                                                    {y.months.map((m) => (
                                                                        <div key={m.idx} className="grid grid-cols-12 text-gray-800 gap-2 px-4 py-3 text-sm border-b">
                                                                            <div className="col-span-3">{m.monthName}</div>
                                                                            <div className="col-span-3">{fmt(m.principalPart)}</div>
                                                                            <div className="col-span-3">{fmt(m.interestPart)}</div>
                                                                            <div className="col-span-3">{fmt(m.balance)}</div>
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 "
                    onClick={() => setShowForm(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}>

                        <h2 className="text-lg font-bold mb-4  text-gray-800 text-center">Fill Your Details</h2>

                        <input type="text" placeholder="Your Name"
                            className="border p-2 rounded w-full mb-3 text-gray-800"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input type="email" placeholder="Email Address"
                            className="border p-2 rounded w-full mb-3 text-gray-800"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <input type="number" placeholder="Mobile Number"
                            className="border p-2 rounded w-full mb-3 text-gray-800"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />

                        <input type="text" placeholder="Your Goal (Ex: Retirement, Child Education)"
                            className="border p-2 rounded w-full mb-3 text-gray-800"
                            value={formData.goal}
                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        />

                        <button
                            onClick={handleSubmitForm}
                            className="bg-blue-600 text-white w-full p-2 rounded-md text-gray-800"
                        >
                            Submit & Download PDF
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
