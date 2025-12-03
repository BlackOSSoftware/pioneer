"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChildEducation() {
  const router = useRouter();

  const [years, setYears] = useState("");
  const [cost, setCost] = useState("");
  const [inflation, setInflation] = useState("");
  const [goalName, setGoalName] = useState("");
  const [risk, setRisk] = useState("Conservative");

  return (
    <div className="w-full bg-white">
      <section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      {/* ======== HEADER SECTION ======== */}
      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">
                    <h1 className="text-4xl font-semibold text-white-900 mb-2">
                        Child's <span className="text-yellow-300">Education</span>
                    </h1>
                    <div className="flex justify-center gap-2 text-sm text-white-600">
                        <Link href="/">Home</Link>

                        <span className="text-white-400">/</span>
                        <span>Goal</span>
                        <span className="text-white-400">/</span>
                        <span className="text-[white] font-medium">Child's Education</span>
                    </div>
                </div>
      </section>
      {/* ======== MAIN INPUT BOX ======== */}
      <section className="w-full py-16 flex  mt-3 justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-6xl w-full">
          <div className="text-gray-700 text-[18px] leading-relaxed space-y-14">

            {/* INPUT ROW 1 */}
            <p className="text-center">
              You are planning for your Child's Higher Education which is 
              <input
                type="number"
                placeholder="Years away"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-32 pb-1 text-center"
              />
              years away. 
              <br/><br/>
              The cost of which would be around 
              <input
                type="number"
                placeholder="Today's cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-40 pb-1 text-center"
              />
              in today's value.
            </p>

            {/* INPUT ROW 2 */}
            <p className="text-center">
              You assume the inflation to be
              <input
                type="number"
                placeholder="% "
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-20 pb-1 text-center"
              />
              % and You would like to name this goal as
              <input
                type="text"
                placeholder="Goal Name"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-40 pb-1 text-center"
              />
              .
            </p>

            {/* INPUT ROW 3 */}
            <p className="text-center">
              You can take
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="mx-2 border-b border-gray-400 outline-none bg-transparent pb-1"
              >
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Aggressive">Aggressive</option>
              </select>
              risk with your investments.
            </p>

            {/* BUTTON */}
            <div className="text-center pt-6">
              <button
                onClick={() =>
                  router.push(
                    `/Goal_Planners/Child-Education_Dream?years=${years}&cost=${cost}&inflation=${inflation}&goal=${goalName}&risk=${risk}`
                  )
                }
                className="px-12 py-3 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition"
              >
                Build My Goal
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
