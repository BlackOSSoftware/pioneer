"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function DreamSummaryPage() {
  const search = useSearchParams();
  const router = useRouter();

  const age = Number(search.get("age") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goal = search.get("goal") || "Dream Home";
  const risk = search.get("risk") || "Conservative";

  // basic calculations (approx)
  const futureValue = useMemo(() => {
    // compound inflation for `age` years
    if (!cost || !age) return 0;
    return Math.round(cost * Math.pow(1 + inflation / 100, age));
  }, [cost, age, inflation]);

  const monthlySIP = useMemo(() => {
    if (!futureValue || !age) return 0;
    // simple division over months (no returns considered) — you can replace with financial formula
    const months = age * 12;
    return Math.round(futureValue / months);
  }, [futureValue, age]);

  return (
    <div className="w-full">
      <section className="w-full bg-[#e9f4ff] pt-12 pb-8 shadow-sm mt-20">
        <h1 className="text-4xl font-semibold text-center text-gray-900">Goal Summary</h1>
      </section>

      <section className="w-full py-12 flex justify-center">
        <div className="max-w-6xl w-full p-8 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded shadow text-center">
              <div className="text-2xl font-bold">₹ {cost.toLocaleString()}</div>
              <div className="mt-4 text-sm text-slate-600">Your Targeted Amount (today's value)</div>
            </div>

            <div className="p-6 bg-white rounded shadow text-center">
              <div className="text-2xl font-bold">₹ {futureValue.toLocaleString()}</div>
              <div className="mt-4 text-sm text-slate-600">Future value (adjusted for {inflation}% inflation)</div>
            </div>

            <div className="p-6 bg-white rounded shadow text-center">
              <div className="text-2xl font-bold">{age}</div>
              <div className="mt-4 text-sm text-slate-600">Number of Years you need to save</div>
            </div>

            <div className="p-6 bg-white rounded shadow text-center">
              <div className="text-2xl font-bold">₹ {monthlySIP.toLocaleString()}</div>
              <div className="mt-4 text-sm text-slate-600">Monthly SIP Required (approx)</div>
            </div>
          </div>

          <div className="mt-8 flex gap-6 justify-center">
            <button onClick={() => router.back()} className="px-6 py-3 border rounded">Back</button>
            <button className="px-6 py-3 bg-blue-900 text-white rounded">Proceed to Plan</button>
          </div>
        </div>
      </section>
    </div>
  );
}
