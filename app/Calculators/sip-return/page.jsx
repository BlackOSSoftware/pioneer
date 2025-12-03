"use client";
import Link from "next/link";

import "@/lib/chartjs-fix";
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


const formatNum = (num) => {
  if (!num || isNaN(num)) return "₹ 0";
  return "₹ " + num.toLocaleString("en-IN");
};

const SliderMarks = ({ marks }) => (
  <div className="flex justify-between text-xs text-gray-800 mt-2 px-1">
    {marks.map((m, i) => (
      <div key={i}>{m}</div>
    ))}
  </div>
);


export default function SIPReturnPage() {
  const [monthly, setMonthly] = useState();
  const [months, setMonths] = useState(120);
  const [annualReturn, setAnnualReturn] = useState(12);

  const pieRef = useRef(null);
  const barRef = useRef(null);


  const setMonthlySafe = (v) => setMonthly(Math.max(0, Math.min(v, 1000000000)));
  const setMonthsSafe = (v) => setMonths(Math.max(1, Math.min(v, 600)));
  const setReturnSafe = (v) => setAnnualReturn(Math.max(0, Math.min(v, 30)));
  const sipValues = [0, 1000, 10000, 100000, 1000000, 10000000, 100000000];

  <input
    type="number"
    className="w-full border rounded-lg p-3 text-gray-700 mb-4"
    value={monthly}
    onChange={(e) => setMonthlySafe(Number(e.target.value))}
  />

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    goal: "",
    calculatorType: "SIP Return Calculator",
  });

  const r = annualReturn / 100 / 12;
  const futureValue = useMemo(() => {
    if (r === 0) return monthly * months;
    const fv = monthly * ((Math.pow(1 + r, months) - 1) / r);
    return fv > 1e12 ? 1e12 : fv;
  }, [monthly, months, r]);

  const totalInvested = monthly * months;
  const totalGrowth = Math.max(0, futureValue - totalInvested);


  const pieData = {
    labels: ["Total Invested", "Total Growth"],
    datasets: [
      {
        data: [totalInvested, totalGrowth],
        backgroundColor: ["#93C5FD", "#3B82F6"],
      },
    ],
  };


  const growthData = {
    labels: Array.from(
      { length: 12 },
      (_, i) => `${(i + 1) * Math.floor(Math.max(1, months / 12))}m`
    ),
    datasets: [
      {
        label: "Invested",
        type: "bar",
        data: Array.from({ length: 12 }, (_, i) => totalInvested * ((i + 1) / 12)),
        backgroundColor: "#93C5FD",
      },
      {
        label: "Value",
        type: "bar",
        data: Array.from({ length: 12 }, (_, i) => futureValue * ((i + 1) / 12)),
        backgroundColor: "#3B82F6",
      },
    ],
  };

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


  const getCanvas = (ref) =>
    ref.current?.canvas || ref.current?.ctx?.canvas || ref.current?.chart?.canvas || null;

  const downloadPDF = () => {
    const pie = getCanvas(pieRef)?.toDataURL("image/png");
    const bar = getCanvas(barRef)?.toDataURL("image/png");

    if (!pie || !bar) return alert("Please wait… charts not ready.");

    const pdf = new jsPDF("p", "pt", "a4");
    const W = pdf.internal.pageSize.getWidth();
    let y = 35;


    pdf.setFillColor("#3B82F6");
    pdf.rect(0, 0, W, 55, "F");
    pdf.setFontSize(18).setTextColor("#93C5FD");
    pdf.text("Pioneer Wealth", 30, 35);

    pdf.setFontSize(9).setTextColor("#93C5FD");
    pdf.text(`Generated: ${new Date().toLocaleString()}`, W - 180, 35);


    y = 72;

    const summary = [
      ["Monthly SIP", formatNum(monthly)],
      ["Duration", `${months} months`],
      ["Return (p.a.)", `${annualReturn}%`],
    ];

    const boxW = (W - 80) / 3;

    summary.forEach((s, i) => {
      const x = 30 + i * (boxW + 10);
      pdf.setDrawColor("#93C5FD");
      pdf.roundedRect(x, y, boxW, 45, 5, 5);
      pdf.setFontSize(10).setTextColor("#333").text(s[0], x + 8, y + 15);
      pdf.setFontSize(12).setTextColor("#000").text(s[1], x + 8, y + 32);
    });


    y += 95;
    pdf.setFontSize(14).setTextColor("#000").text("Investment Breakdown", 30, y);

    y += 15;
    pdf.addImage(pie, "PNG", 30, y, 170, 160);


    y += 185;
    pdf.setFontSize(14).text("SIP Projection Values", 30, y);

    y += 10;

    const tableRows = [
      ["Total Invested", formatNum(totalInvested)],
      ["Total Growth", formatNum(totalGrowth)],
      ["Future Value", formatNum(futureValue)],
    ];

    const tableW = W - 60;

    pdf.setFillColor("#3B82F6");
    pdf.rect(30, y, tableW, 23, "F");
    pdf.setFontSize(11).setTextColor("#fff").text("Metric", 40, y + 16);
    pdf.text("Amount", 30 + tableW - 10, y + 16, { align: "right" });

    y += 30;

    tableRows.forEach((row) => {
      pdf.setFillColor("#f8f8f8").rect(30, y, tableW, 22, "F");
      pdf.setTextColor("#000").setFontSize(10);
      pdf.text(row[0], 40, y + 15);
      pdf.text(row[1], 30 + tableW - 10, y + 15, { align: "right" });
      y += 24;
    });


    y += 35;
    pdf.setFontSize(14).text("Projected SIP Growth", 30, y);

    y += 15;

    pdf.addImage(bar, "PNG", 30, y, tableW, 200);


    
const fileName = `${formData.name.replace(/\s+/g, "-")}-${formData.calculatorType.replace(/\s+/g, "-")}.pdf`;
pdf.save(fileName);

  };



  const moneyMarks = ["0", "1K", "10K", "1L", "10L", "50L", "1Cr", "10Cr", "100Cr"];
  const monthsMarks = ["0", "75", "150", "225", "300", "375", "450"];
  const returnMarks = ["0%", "7%", "15%", "22%", "30%"];


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
<section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            SIP Return<span className="text-yellow-300"> Calculator</span>
          </h1>

          <div className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            <Link href="/">Home</Link>

            <span className="text-white-400">/</span>
            <span>Tools & Calculators</span>
            <span className="text-white-400">/</span>
            <span >SIP Return Calculator</span>
          </div>

          <div className="flex justify-center">
            <div className="w-20 h-[3px] bg-black-900 rounded-full"></div>
          </div>

        </div>
      </section>



      <main className="max-w-6xl mx-auto px-4 pt-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 space-y-8">


            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100  ">
              <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                How much you can invest through monthly SIP? (Rs)
              </label>

              <input
                type="text"
                className="w-full border rounded-xl p-4 pr-16 text-gray-800 text-lg font-semibold shadow-sm   outline-none transition-all duration-300 group-hover:shadow-lg"
                value={
                  monthly
                    ? "₹ " + Number(monthly).toLocaleString("en-IN")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  setMonthlySafe(Number(raw));
                }}
                placeholder=" Enter Monthly SIP Amount"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                ₹
              </span>



            </div>


            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mt-2">
              <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                How many months will you continue the SIP?
              </label>

              <input
                type="number"
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-green-600 focus:outline-none mb-4"
                value={months}
                onChange={(e) => setMonthsSafe(Number(e.target.value || 0))}
              />

              <input
                type="range"
                min={1}
                max={600}
                step={1}
                value={months}
                onChange={(e) => setMonthsSafe(Number(e.target.value))}
                className="w-full accent-blue-600"
              />

              <SliderMarks marks={["0", "75", "150", "225", "300", "375", "450"]} />
            </div>


            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <label className="block text-[15px] text-gray-800 mb-3 font-semibold">
                What rate of return do you expect? (% per annum)
              </label>

              <input
                type="number"
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-green-600 focus:outline-none mb-4"
                value={annualReturn}
                onChange={(e) => setReturnSafe(Number(e.target.value || 0))}
              />

              <input
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={annualReturn}
                onChange={(e) => setReturnSafe(Number(e.target.value))}
                className="w-full accent-blue-600"
              />

              <SliderMarks marks={["0%", "7%", "15%", "22%", "30%"]} />
            </div>

          </div>



          <div className="space-y-8">


            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800 text-lg">Breakdown</h4>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md hover:bg-blue-700"
                >
                  Download
                </button>
              </div>

              <Pie ref={pieRef} data={pieData} />
            </div>


            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-md border border-blue-400">
              <h4 className="text-blue-100 text-sm mb-3">Totals</h4>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-blue-100 text-sm" >Total SIP Amount Invested</span>
                  <b>{formatNum(totalInvested)}</b>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-blue-100 text-sm" >Total Growth</span>
                  <b>{formatNum(totalGrowth)}</b>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-blue-100 text-sm" >Future Value</span>
                  <b>{formatNum(futureValue)}</b>
                </div>
              </div>
            </div>

          </div>

        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6">


          <section className="mt-12 bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold mb-4 text-xl text-gray-800">Projected SIP Growth</h3>
            <Bar ref={barRef} data={growthData} />
          </section>



          <section className="mt-16 max-w-5xl mx-auto text-gray-700 leading-relaxed text-[17px] space-y-6">

            <p>
              This is a simple strategy for accumulating wealth over a period of time by investing regularly
              in mutual fund schemes. This is similar to recurring deposits, but carries higher return potential.
            </p>

            <h2 className="text-2xl font-bold text-gray-800">What is Systematic Investment Plan?</h2>

            <p>
              An investor commits to invest a specific amount for a continuous period at regular intervals, this ensures that he gets more units when prices are lower and fewer units when prices are high, this works on the principle of rupee cost averaging when invested at different levels and automatically participate in the swing of the market.
            </p>

            <h2 className="text-2xl font-bold text-gray-800">Advantages of SIP</h2>

            <p>
              Power of Compounding, To avail the benefit of power of compounding one has to start early and invest regularly, a delayed investment will lead to greater financial burden to meet the required goals, at early stage a less investment needed where as more investment is needed at a later stage to accumulate the same planned corpus.
            </p>

            <h2 className="text-2xl font-bold text-gray-800">Rupee-Cost Averaging</h2>

            <ul className="list-decimal ml-6 space-y-2">
              <li>It means averaging the cost price of your investments.</li>
              <li>SIP helps in averaging the cost as equal amount is invested regularly every month at different NAVs. SIP works well in a volatile market as in the months where markets are down you get more number of units as the NAV is down and when the markets are up you get less number of units. But over all the prices gets averaged out.</li>
              <li>Let us see how: Say you make your first investment of Rs 1,000 at a NAV of Rs 10. In this case, the units acquired will be 100 (1,000/10). You make the next investment of Rs 1,000 at a NAV of Rs 12. Units acquired now will be 83.33333 (1,000/12). Now also suppose that you make the third investment of Rs 1,000 at a NAV of Rs 9 and the units acquired will be 111.1111 (1,000/9).</li>
              <li>The average purchase cost works out to Rs 10.19 (3,000/294.4444).</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800">Rupee-Cost Averaging</h2>
            <p>It is very easy to start an SIP, you need to plan your saving wisely and keep aside some amount of money every month for investing in funds, investment can be done either by post dated cheques or through ECS instructions in specific fund house scheme, its always better to start at an early age with small amount and increase the same from time to time. If you have not invested yet, start now without any delay, waiting for the right time to invest can lead to missed opportunity, a Systematic Investment Plan (SIP) is a smart way to achieve your various financial goals and ensures you with the required corpus which was initially planned for the specific requirement.</p>
            <ul className="list-decimal ml-6 space-y-2">
              <li>One can take the benefit of SIP only, when you choose the right schemes and be faithful and continue to stick to it, without any deviations.</li>
              <li>SIP investment in well diversified and good performing scheme that can provide financial solutions to your long term goals like child education, marriage and your retirement.</li>
              <li>An investment of Rs.2000 every month for the next 15 years at 15% return per annum can fetch you Rs.12,32,731 at the end of 15th year (solution for your child education).</li>
              <li>An investment of Rs.3768 every month in the next 20 years @ 15% return per annum can fetch Rs.50 lakhs at the end of 20th year. This could be the solution for your retirement.</li>
            </ul>
          </section>
        </div>
        <section className="max-w-5xl mx-auto mt-10 text-gray-700 text-[15px] leading-relaxed pb-20">

          <h3 className="font-bold text-xl text-gray-800 mb-4">Disclaimer:</h3>

          <p className="mb-3">
            Information is believed to be reliable but no guarantee is provided. Verify independently before investing.
          </p>

          <p className="mb-3">
            Returns &lt; 1 year = Absolute (%) • Returns &gt; 1 year = CAGR (%) • SIP results shown as XIRR (%)
          </p>


          <p className="mb-3">
            Choose schemes based on your risk profile and financial goals.
          </p>

          <p className="font-semibold">
            Mutual Fund investments are subject to market risks. Read all scheme documents carefully.
          </p>

        </section>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 "
            onClick={() => setShowForm(false)}>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
              onClick={(e) => e.stopPropagation()} >

              <h2 className="text-lg font-bold mb-4 text-center text-gray-800">Fill Your Details</h2>

              <input type="text" placeholder="Your Name"
                className="border p-2 rounded w-full mb-3 text-gray-800"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input type="email" placeholder="Email Address"
                className="border p-2 rounded w-full mb-3 text-gray-800 "
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





      </main>
    </div>
  );

}
