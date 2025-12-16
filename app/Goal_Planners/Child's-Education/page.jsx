"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChildEducation() {
  const [years, setYears] = useState("");
  const [cost, setCost] = useState("");
  const [inflation, setInflation] = useState("");
  const [goalName, setGoalName] = useState("");
  const [risk, setRisk] = useState("Conservative");
const router = useRouter();

  return (
    <div className="w-full">

    
      
<section className="w-full bg-[#e9f4ff] pt-12 pb-8 shadow-sm mt-20">
        <h1 className="text-4xl font-semibold text-center text-gray-900">
          Child's Education
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Home / Goal / <span className="text-green-600 font-medium">Child's Education</span>
        </p>
      </section>
    
      <section className="w-full py-16 flex justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-6xl w-full">
          <div className="text-gray-700 text-[18px] leading-relaxed space-y-14">

            
            <p className="text-center">
              You are planning for your Child's Higher Education which is 
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-32 pb-1 text-center"
              />
              years away. The cost of which would be around 
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-40 pb-1 text-center"
              />
              in today's value.
            </p>

            
            <p className="text-center">
              You assume the inflation to be
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-20 pb-1 text-center"
              />
              % and You would like to name this goal as
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-40 pb-1 text-center"
              />
              .
            </p>

           
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

            
            <div className="text-center pt-6">
              <button
  onClick={() =>
    router.push(
      `/Goal_Planners/Child_summary?years=${years}&cost=${cost}&inflation=${inflation}&goalName=${goalName}&risk=${risk}`
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
