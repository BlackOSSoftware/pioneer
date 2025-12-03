"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
export default function EmergencyDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  const age = Number(search.get("age") || 0);
  const expenses = Number(search.get("expenses") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goalName = search.get("goal") || "";
  const risk = search.get("risk") || "Conservative";

  const [showModal, setShowModal] = useState(false);

 

  
  const targetFund = useMemo(() => {
    if (!expenses) return 0;
    return expenses * 6; 
  }, [expenses]);

  
  const futureValue = useMemo(() => {
    if (!targetFund || !inflation) return targetFund;
    return Math.round(targetFund * Math.pow(1 + inflation / 100, 1)); 
  }, [targetFund, inflation]);

  
  const monthlySIP = useMemo(() => {
    return Math.round(futureValue / 12);
  }, [futureValue]);

  const fmt = (v) =>
    typeof v === "number" ? v.toLocaleString("en-IN") : String(v ?? "-");

  return (
    <div className="w-full bg-white">
<section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

     
      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <h1 className="text-4xl font-semibold text-white-900 mb-2">
          Emergency 
        </h1>
        <div className="flex justify-center gap-2 text-sm text-white-600">
                        <Link href="/">Home</Link>

                        <span className="text-white-400">/</span>
                        <span>Goal</span>
                        <span className="text-white-400">/</span>
                        <span className="text-[white] font-medium"> Emergency </span>
                    </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="w-full py-12 flex justify-center">
        <div className="max-w-6xl w-full p-8 bg-white rounded-xl shadow-lg">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Monthly expenses */}
            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold"> {fmt(expenses)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm">
                Monthly Expenses
              </div>
            </div>

            {/* Target emergency fund */}
            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold"> {fmt(targetFund)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm">
                Emergency Fund Required (6 Months)
              </div>
            </div>

            {/* Inflation Adjusted Value */}
            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold"> {fmt(futureValue)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm">
                Inflation Adjusted Amount ({inflation}%)
              </div>
            </div>

            {/* Monthly SIP Required */}
            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold"> {fmt(monthlySIP)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm">
                Monthly SIP Required (12 Months)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

            {/* Existing Client */}
            <div
              onClick={() => setShowModal(true)}
              className="bg-[#3B82F6] text-white rounded-xl shadow text-center py-8 cursor-pointer hover:opacity-90 transition"
            >
              <p className="font-bold text-lg">Are you an existing client?</p>
              <p className="mt-3 text-sm">
                Click here to map your existing investments to this goal
              </p>
            </div>

            {/* New Client */}
            <div
              onClick={() =>
                router.push(
                  `/Goal_Planners/Emergency-Summary?investmentType=SIP&risk=${risk}&futureValue=${futureValue}&sip=${monthlySIP}`
                )
              }
              className="border border-[#3B82F6] bg-[#F8FFF1] rounded-xl shadow text-center py-8 cursor-pointer hover:bg-[#eefbe0] transition"
            >
              <p className="font-bold text-lg text-[#3B82F6]">
                I am not an existing client
              </p>
              <p className="mt-3 text-sm text-gray-700">
                Proceed without mapping existing investments
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Login Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[420px] shadow-xl overflow-hidden">

            <div className="bg-[#00597A] text-white px-6 py-3 text-lg font-semibold">
              Login
            </div>

            <div className="p-6">
              <label className="text-gray-700 font-medium">PAN Number:</label>
              <input type="text" className="w-full border mt-1 mb-5 rounded px-3 py-2" />

              <label className="text-gray-700 font-medium">Password:</label>
              <input type="password" className="w-full border mt-1 rounded px-3 py-2" />
            </div>

            <hr />

            <div className="flex justify-end gap-3 px-6 py-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>

              <button className="px-5 py-2 bg-[#004F6E] text-white rounded hover:bg-[#003f58]">
                Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
