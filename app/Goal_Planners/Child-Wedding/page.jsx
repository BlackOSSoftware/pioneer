"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WealthCreationPage() {
  const router = useRouter();

  const [age, setAge] = useState("");
  const [amount, setAmount] = useState("");
  const [afterYears, setAfterYears] = useState("");
  const [inflation, setInflation] = useState("");
  const [returns, setReturns] = useState("");
  const [risk, setRisk] = useState("Conservative");

  const handleSubmit = () => {
    if (!age || !amount || !afterYears || !inflation || !returns) {
      alert("Please fill all fields");
      return;
    }

    router.push(
      `/Goal_Planners/Child-Wedding-Dream?age=${afterYears}&cost=${amount}&inflation=${inflation}&returns=${returns}&risk=${risk}`
    );
  };

  return (
    <div className="w-full">

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">

          <h1 className="text-4xl font-semibold text-white-900 mb-2">
            Child <span className="text-yellow-300">Wedding</span>
          </h1>

          <div className="flex justify-center gap-2 text-sm text-white-600">
            <Link href="/">Home</Link>
            <span className="text-white-400">/</span>
            <span>Goal</span>
            <span className="text-white-400">/</span>
            <span className="text-[white] font-medium">Wealth Creation</span>
          </div>

        </div>
      </section>

      <section className="w-full py-16 flex justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-6xl w-full">
          <div className="text-gray-700 text-[18px] leading-relaxed space-y-14">

            <p className="text-center">
              You are
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-24 text-center pb-1"
              />
              years old now you require Rs
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-40 text-center pb-1"
              />
              at today's value after
              <input
                type="number"
                value={afterYears}
                onChange={(e) => setAfterYears(e.target.value)}
                placeholder="Years"
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-20 text-center pb-1"
              />
              years
            </p>

            <p className="text-center">
              for becoming wealthy. You assume the inflation to be
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                placeholder="%"
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-20 text-center pb-1"
              />
              % and expect
              <input
                type="number"
                value={returns}
                onChange={(e) => setReturns(e.target.value)}
                placeholder="%"
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none w-20 text-center pb-1"
              />
              % return on your investments.
            </p>

            <p className="text-center">
              You can take
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="mx-2 border-b border-gray-400 focus:border-blue-600 outline-none pb-1 bg-transparent text-center"
              >
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Aggressive">Aggressive</option>
              </select>
              risk with your investments.
            </p>

            <div className="text-center pt-6">
              <button
                onClick={handleSubmit}
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
