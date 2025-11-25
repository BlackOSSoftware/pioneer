"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmergencyGoal() {
  const router = useRouter();

  const [age, setAge] = useState("");
  const [expenses, setExpenses] = useState("");
  const [inflation, setInflation] = useState("");
  const [goalName, setGoalName] = useState("");
  const [risk, setRisk] = useState("Conservative");

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    if (!age || !expenses || !inflation || !goalName) {
      setShowPopup(true);
      return;
    }

    router.push(
      `/Goal_Planners/Emergency-Dream?age=${age}&expenses=${expenses}&inflation=${inflation}&goal=${goalName}&risk=${risk}`
    );
  };

  return (
    <div className="w-full">

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">

          <h1 className="text-4xl font-semibold text-white-900 mb-2">
            Emergency
          </h1>

          <div className="flex justify-center gap-2 text-sm text-white-600">
            <Link href="/">Home</Link>
            <span className="text-white-400">/</span>
            <span>Goal</span>
            <span className="text-white-400">/</span>
            <span className="text-[white] font-medium">Emergency</span>
          </div>

        </div>
      </section>

      <section className="w-full py-16 flex justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-6xl w-full">
          
          <div className="text-gray-700 text-[18px] leading-relaxed space-y-10">

            <p className="text-center">
              You are 
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
                className="mx-2 border-b border-gray-400 w-28 text-center pb-1 outline-none"
              />
              years old now and your average monthly expenses are 
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="₹ Expenses"
                className="mx-2 border-b border-gray-400 w-40 text-center pb-1 outline-none"
              />
              .
            </p>

            <p className="text-center">
              You assume the inflation to be
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                placeholder="%"
                className="mx-2 border-b border-gray-400 w-24 text-center pb-1 outline-none"
              />
              % and You would like to name this goal as
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="Goal Name"
                className="mx-2 border-b border-gray-400 w-40 text-center pb-1 outline-none"
              />
              .
            </p>

            <p className="text-center">
              You can take
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="mx-2 border-b border-gray-400 pb-1 outline-none"
              >
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
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

            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                <div className="bg-white rounded-xl shadow-xl p-8 w-[380px] text-center">
                  <p className="text-gray-700 text-lg mb-6">
                    Please fill all fields correctly
                  </p>

                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
