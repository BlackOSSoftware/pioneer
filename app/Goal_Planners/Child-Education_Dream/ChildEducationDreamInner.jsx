"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ChildEducationDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  
  const years = Number(search.get("years") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goalName = search.get("goal") || "";
  const risk = search.get("risk") || "Conservative";

  
  const [showModal, setShowModal] = useState(false);

 
  const futureValue = useMemo(() => {
    if (!cost || !years) return 0;
   
    return Math.round(cost * Math.pow(1 + inflation / 100, years));
  }, [cost, years, inflation]);

  const monthlySIP = useMemo(() => {
    if (!futureValue || !years) return 0;
    return Math.round(futureValue / (years * 12));
  }, [futureValue, years]);

  
  const fmt = (v) => (typeof v === "number" ? v.toLocaleString("en-IN") : String(v ?? "-"));

  return (
    <div className="w-full bg-white">
      <section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      {/* HEADER - keeping design identical */}
      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl font-semibold text-white-900 mb-2">
            Child's <span className="text-yellow-300">Education</span>
          </h1>
          <div className="flex justify-center gap-2 text-sm text-white-600">
            <a href="/" className="underline">Home</a>
            <span className="text-white-400">/</span>
            <span>Goal</span>
            <span className="text-white-400">/</span>
            <span className="text-[white] font-medium">Child's Education</span>
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="w-full py-12 flex justify-center">
        <div className="max-w-6xl w-full p-8 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold">₹ {fmt(cost)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                Your Targeted Amount <br /> (in today's value)
              </div>
            </div>

            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold">₹ {fmt(futureValue)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                Future value of the Goal <br />
                (adjusting for {inflation}% inflation)
              </div>
            </div>

            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold">{years}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                Number of Years <br /> You Need To Save
              </div>
            </div>

            <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
              <div className="text-3xl font-bold">₹ {fmt(monthlySIP)}</div>
              <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                Monthly SIP Investment <br /> Required
              </div>
            </div>
          </div>

          {/* ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div
              onClick={() => setShowModal(true)}
              className="bg-[#3B82F6] text-white rounded-xl shadow text-center py-8 cursor-pointer hover:opacity-90 transition"
            >
              <p className="font-bold text-lg">Are you an existing client?</p>
              <p className="mt-3 text-sm">If yes, please click here and map your existing investments to this goal</p>
            </div>

            <div
              onClick={() =>
                router.push(
                  `/Goal_Planners/Child-Education-Summary?investmentType=SIP&risk=${encodeURIComponent(risk)}&years=${years}&futureValue=${futureValue}&sip=${monthlySIP}`
                )
              }
              className="border border-[#3B82F6] bg-[#F8FFF1] rounded-xl shadow text-center py-8 cursor-pointer hover:bg-[#eefbe0] transition"
            >
              <p className="font-bold text-lg text-[#3B82F6]">No, I do not have investments with you</p>
              <p className="mt-3 text-sm text-gray-700">Take me to the plan without mapping any existing investments</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[420px] shadow-xl overflow-hidden">
            <div className="bg-[#00597A] text-white px-6 py-3 text-lg font-semibold">Login</div>
            <div className="p-6">
              <label className="text-gray-700 font-medium">PAN Number:</label>
              <input type="text" className="w-full border mt-1 mb-5 rounded px-3 py-2 border-gray-300" />
              <label className="text-gray-700 font-medium">Password:</label>
              <input type="password" className="w-full border mt-1 rounded px-3 py-2 border-gray-300" />
            </div>
            <hr />
            <div className="flex justify-end gap-3 px-6 py-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
              <button className="px-5 py-2 bg-[#004F6E] text-white rounded hover:bg-[#003f58]">Login</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
