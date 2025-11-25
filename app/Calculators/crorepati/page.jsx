"use client";


import React, { useMemo, useRef, useState } from "react";
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
import jsPDF from "jspdf";

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


const formatNum = (n) => {
    if (!isFinite(n)) return "—";
    if (n >= 1e7) return `₹ ${(n / 1e7).toFixed(2)} Cr`;
    if (n >= 1e5) return `₹ ${(n / 1e5).toFixed(2)} L`;
    if (n >= 1e3) return `₹ ${(n / 1e3).toFixed(2)} K`;
    return `₹ ${n.toLocaleString()}`;
};

const SliderMarks = ({ marks = [] }) => (
    <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
        {marks.map((m, i) => (
            <div key={i}>{m}</div>
        ))}
    </div>
);


export default function BecomeCrorepatiPage() {

    const [targetCrores, setTargetCrores] = useState(5_00_00_000);
    const [ageNow, setAgeNow] = useState(30);
    const [targetAge, setTargetAge] = useState(60);
    const [inflation, setInflation] = useState(5);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [currentSavings, setCurrentSavings] = useState(25_00_000);


    const pieRef = useRef(null);
    const barRef = useRef(null);


    const yearsToSave = Math.max(0, targetAge - ageNow);

    const inflationFactor = Math.pow(1 + inflation / 100, yearsToSave);
    const targetInflationAdjusted = targetCrores * inflationFactor;


    const monthlyNeeded =
        yearsToSave === 0
            ? 0
            : Math.max(
                0,
                ((targetInflationAdjusted - currentSavings * Math.pow(1 + expectedReturn / 100, yearsToSave)) *
                    (expectedReturn / 100)) /
                (12 * (Math.pow(1 + expectedReturn / 100 / 12, yearsToSave * 12) - 1))
            );


    const futureValue = Math.max(0, targetInflationAdjusted);
    const totalInvestedApprox = monthlyNeeded * 12 * yearsToSave + currentSavings;
    const totalGrowthApprox = Math.max(0, futureValue - totalInvestedApprox);


    const pieData = useMemo(
        () => ({
            labels: ["Amount Invested", "Total Growth"],
            datasets: [
                {
                    data: [totalInvestedApprox || 1, Math.max(totalGrowthApprox || 0, 0.01)],
                    backgroundColor: ["#93C5FD", "#3B82F6"],
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
            labels: Array.from({ length: months }, (_, i) => `${Math.round(((i + 1) / months) * yearsToSave)}y`),
            datasets: [
                { label: "Invested", data: investedSeries, backgroundColor: "#93C5FD" },
                { label: "Value", data: valueSeries, backgroundColor: "#3B82F6" },
            ],
        };
    }, [totalInvestedApprox, futureValue, yearsToSave]);


    const getCanvas = (ref) => ref.current?.canvas || ref.current?.ctx?.canvas || ref.current?.chart?.canvas || null;


    const downloadPDF = () => {
        const pieImg = getCanvas(pieRef)?.toDataURL("image/png");
        const barImg = getCanvas(barRef)?.toDataURL("image/png");


        if (!pieImg) return alert("Please wait until the chart renders.");

        const pdf = new jsPDF("p", "pt", "a4");
        const W = pdf.internal.pageSize.getWidth();
        const H = pdf.internal.pageSize.getHeight();
        let y = 30;


        pdf.setFillColor("#3B82F6");
        pdf.rect(0, 0, W, 50, "F");
        pdf.setFontSize(18).setTextColor("#93C5FD");
        pdf.text("Pioneer Wealth", 40, 36);
        pdf.setFontSize(9).text(`Generated: ${new Date().toLocaleString()}`, W - 170, 36);


        y = 70;
        const summaries = [
            ["Target Today", formatNum(targetCrores)],
            ["Your Age", `${ageNow} years`],
            ["Target Age", `${targetAge} years`],
        ];
        const boxW = (W - 100) / 3;
        summaries.forEach((s, i) => {
            const x = 40 + i * (boxW + 10);
            pdf.roundedRect(x, y, boxW, 45, 6, 6);
            pdf.setFontSize(10).setTextColor("#333").text(s[0], x + 10, y + 16);
            pdf.setFontSize(12).setTextColor("#000").text(s[1], x + 10, y + 34);
        });


        y += 70;
        pdf.setFontSize(14).setTextColor("#000").text("Investment Breakdown", 40, y);
        y += 12;
        pdf.addImage(pieImg, "PNG", 40, y, 160, 160);


        const tableX = 220;
        const tableW = W - tableX - 40;
        pdf.setFontSize(14).text("SIP Projection Values", tableX, y);
        y += 12;

        const rows = [
            ["Monthly SIP (approx.)", monthlyNeeded ? formatNum(Math.round(monthlyNeeded)) : "₹ 0"],
            ["Total Amount Invested", formatNum(Math.round(totalInvestedApprox))],
            ["Total Growth", formatNum(Math.round(totalGrowthApprox))],
            ["Target (inflation adj.)", formatNum(Math.round(targetInflationAdjusted))],
        ];


        y += 8;
        pdf.setFillColor("#3B82F6");
        pdf.rect(tableX, y, tableW, 24, "F");
        pdf.setFontSize(11).setTextColor("#fff");
        pdf.text("Metric", tableX + 12, y + 16);
        pdf.text("Amount", tableX + tableW - 12, y + 16, { align: "right" });
        y += 26;

        pdf.setFontSize(10).setTextColor("#000");
        rows.forEach((r) => {
            pdf.setFillColor("#fafafa");
            pdf.rect(tableX, y, tableW, 22, "F");
            pdf.text(r[0], tableX + 12, y + 15);
            pdf.text(r[1], tableX + tableW - 12, y + 15, { align: "right" });
            y += 24;
        });


        y = Math.max(y + 12, 260);

        pdf.setFontSize(14).text("Projected SIP Growth", 40, y);
        y += 12;
        if (barImg) {

            pdf.addImage(barImg, "PNG", 40, y, W - 80, 170);
            y += 170 + 8;
        } else {
            pdf.setFontSize(10).text("Growth chart not available.", 40, y);
            y += 30;
        }


        const desc =
            "This calculator gives a simple projection to help you plan how to become a crorepati. It adjusts the target for inflation up to your desired target age and estimates monthly SIP (approx.) required given an expected return. The projection is simplified — actual returns, taxes, costs and market risk will affect real outcomes. Consult a financial advisor before taking decisions.";

        pdf.setFontSize(11).setTextColor("#333");
        const leftMargin = 40;
        const contentWidth = W - leftMargin - 40;
        const split = pdf.splitTextToSize(desc, contentWidth);
        pdf.text(split, leftMargin, y);
        y += split.length * 12 + 10;


        const disc =
            "Disclaimer: We have gathered the data from sources believed reliable. This is for illustrative purposes only. Past performance is not indicative of future returns. Mutual fund investments are subject to market risk. Please consult your financial advisor.";

        const discSplit = pdf.splitTextToSize(disc, contentWidth);
        pdf.setFontSize(9).setTextColor("#666");
        pdf.text(discSplit, leftMargin, y);

        // Save
        pdf.save("Become-Crorepati-Report.pdf");
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-16">

           <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            Become A Crorepati<span className="text-yellow-300"> Calculator</span>
          </h1>

          <div className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            <Link href="/">Home</Link>

            <span className="text-white-400">/</span>
            <span>Tools & Calculators</span>
            <span className="text-white-400">/</span>
            <span >Become A Crorepati Calculators </span>
          </div>

          <div className="flex justify-center">
            <div className="w-20 h-[3px] bg-black-900 rounded-full"></div>
          </div>

        </div>
      </section> 


            <main className="max-w-7xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">
                                How many Crores (at current value) you would need to consider yourself wealthy (₹)
                            </label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={targetCrores}
                                onChange={(e) => setTargetCrores(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={0}
                                max={1_00_00_00_000}
                                step={1_00_000}
                                value={targetCrores}
                                onChange={(e) => setTargetCrores(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["0 Cr", "25 Cr", "50 Cr", "75 Cr", "100 Cr"]} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Your current age (years)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={ageNow}
                                onChange={(e) => setAgeNow(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={10}
                                max={100}
                                step={1}
                                value={ageNow}
                                onChange={(e) => setAgeNow(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["10", "25", "50", "75", "100"]} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">The age when you want to become a Crorepati (years)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={targetAge}
                                onChange={(e) => setTargetAge(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={ageNow}
                                max={100}
                                step={1}
                                value={targetAge}
                                onChange={(e) => setTargetAge(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["10", "25", "50", "75", "100"]} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">Expected rate of inflation (% per annum)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={inflation}
                                onChange={(e) => setInflation(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={0}
                                max={15}
                                step={0.1}
                                value={inflation}
                                onChange={(e) => setInflation(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["0", "2.5", "5", "7.5", "10"]} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">What rate of return would you expect your SIP to generate (% per annum)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={0}
                                max={25}
                                step={0.1}
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["0", "7.5", "12", "17.5", "25"]} />
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <label className="block text-sm text-gray-700 mb-2 font-medium">How much savings you have now (₹)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-3 mb-3"
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(Number(e.target.value || 0))}
                            />
                            <input
                                type="range"
                                min={0}
                                max={1_00_00_00_000}
                                step={1_00_000}
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                className="w-full"
                            />
                            <SliderMarks marks={["0 Cr", "25 Cr", "50 Cr", "75 Cr", "100 Cr"]} />
                        </div>
                    </div>


                    <div className="space-y-6">

                        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                            <div className="flex justify-end">
                                <button
                                    onClick={downloadPDF}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                                >
                                    Download
                                </button>
                            </div>

                            <h4 className="font-semibold text-gray-700 mb-3">Break-up of Total Payment</h4>
                            <Pie ref={pieRef} data={pieData} />
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md border border-blue-400">


                            <h4 className="font-bold  text-blue-100  text-center text-lg mb-4">
                                Monthly SIP Amount
                            </h4>


                            <p className="text-center text-[20px] font-semibold  mb-6">
                                {formatNum(Math.round(monthlyNeeded))}
                                <span className="text-sm text-blue-100"> (years you need to save)</span>
                            </p>


                            <div className="py-5 border-t border-b text-center">
                                <p className="font-semibold text-blue-100">
                                    Total Amount Invested through SIP in years
                                </p>
                                <p className="text-[20px] font-semibold mt-1">{formatNum(Math.round(totalInvestedApprox))}</p>
                            </div>


                            <div className="py-5 border-t border-b text-center">
                                <p className="font-semibold text-blue-100">Total Growth Amount</p>
                                <p className="text-[20px] font-semibold mt-1">{formatNum(Math.round(totalGrowthApprox))}</p>
                            </div>


                            <div className="py-5 border-t border-b text-center">
                                <p className="font-semibold text-blue-100">
                                    Your targeted Wealth Amount (Inflation adjusted)
                                </p>
                                <p className="text-[20px] font-semibold mt-1">{formatNum(Math.round(targetInflationAdjusted))}</p>
                            </div>




                            <div className="py-5 border-t border-b text-center">
                                <p className="font-semibold text-blue-100">
                                    Final Targeted Amount (Minus growth of your savings)
                                </p>
                                <p className="text-[20px] font-semibold mt-1">
                                    {formatNum(
                                        Math.max(0, Math.round(targetInflationAdjusted - totalGrowthApprox))
                                    )}
                                </p>
                            </div>

                        </div>


                    </div>

                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mt-14">
                    <h3 className="font-semibold mb-3">Projected SIP Growth</h3>
                    <Bar ref={barRef} data={growthData} />
                </div>

                <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 leading-relaxed text-gray-700">
                            <h3 className="text-xl font-semibold mb-2">About this calculator</h3>
                            <p>
                                This is a simple strategy for accumulating wealth over a period of time by investing regularly at a fixed interval of time in mutual fund schemes.
                                The calculator adjusts your target for inflation up to your chosen target age and gives an approximate monthly SIP amount required based on expected return assumptions.
                            </p>

                            <h4 className="mt-4 font-semibold">What is Systematic Investment Plan?</h4>
                            <p>
                                SIP is a way to invest a fixed sum regularly in mutual funds. It uses the principle of rupee-cost averaging and benefits from compounding.
                            </p>

                            <h4 className="mt-4 font-semibold">Important</h4>
                            <p className="text-sm text-gray-600">
                                The projection here is illustrative. It does not consider taxes, fees, changes to returns, or other real-world constraints. Please consult a financial advisor before acting on this information.
                            </p>
                        </div>


                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-sm">
                            <h4 className="font-semibold mb-3">Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Years to save</span><b>{yearsToSave}</b></div>
                                <div className="flex justify-between"><span>Inflation adj. target</span><b>{formatNum(Math.round(targetInflationAdjusted))}</b></div>
                                <div className="flex justify-between"><span>Current savings</span><b>{formatNum(currentSavings)}</b></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-xs text-gray-600">
                            <strong>Disclaimer:</strong> Mutual Fund investments are subject to market risks. Past performance may or may not be sustained. Consult your advisor.
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
