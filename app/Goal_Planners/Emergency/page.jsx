"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showAppModal } from "@/lib/pioneer-modal-bus";
import {
  GoalPlannerShell,
  GoalCard,
  GoalField,
  GoalInput,
  GoalSelect,
  GoalPrimaryButton,
} from "@/components/goal-planners/GoalPlannerShell";

const RISK_OPTIONS = [
  { value: "Conservative", label: "Conservative" },
  { value: "Moderate", label: "Moderate" },
  { value: "Aggressive", label: "Aggressive" },
];

export default function EmergencyGoalPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [expenses, setExpenses] = useState("");
  const [inflation, setInflation] = useState("6");
  const [goalName, setGoalName] = useState("Emergency Fund");
  const [risk, setRisk] = useState("Conservative");

  const handleBuild = () => {
    if (!age || !expenses || !inflation) {
      showAppModal("Please fill age, monthly expenses, and inflation.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }
    if (Number(expenses) <= 0) {
      showAppModal("Monthly expenses must be greater than zero.", {
        variant: "info",
        title: "Invalid amount",
      });
      return;
    }

    const q = new URLSearchParams({
      age: String(age),
      expenses: String(expenses),
      inflation: String(inflation),
      goal: goalName || "Emergency Fund",
      risk,
    }).toString();

    router.push(`/Goal_Planners/Emergency-Dream?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Emergency"
      highlight="Fund"
      breadcrumb="Emergency"
      description="Build a six-month emergency corpus so unexpected expenses do not disrupt your long-term investments."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <GoalCard title="Your inputs">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <GoalField label="Current age" hint="Informational — used on your plan summary.">
                <GoalInput
                  type="number"
                  min={18}
                  max={100}
                  value={age}
                  onChange={setAge}
                  placeholder="e.g. 35"
                />
              </GoalField>
              <GoalField label="Monthly expenses (₹)">
                <GoalInput
                  type="number"
                  min={0}
                  value={expenses}
                  onChange={setExpenses}
                  placeholder="e.g. 50000"
                />
              </GoalField>
              <GoalField label="Expected inflation (% p.a.)">
                <GoalInput
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={inflation}
                  onChange={setInflation}
                  placeholder="e.g. 6"
                />
              </GoalField>
              <GoalField label="Goal name">
                <GoalInput
                  type="text"
                  value={goalName}
                  onChange={setGoalName}
                  placeholder="Emergency Fund"
                />
              </GoalField>
              <GoalField label="Risk profile" hint="Maps to an illustrative expected return.">
                <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
              </GoalField>
            </div>
            <div className="mt-8">
              <GoalPrimaryButton onClick={handleBuild}>Build my goal</GoalPrimaryButton>
            </div>
          </GoalCard>
        </div>

        <div className="lg:col-span-2">
          <GoalCard title="How it works">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                Target corpus = <strong className="text-slate-800">6 × monthly expenses</strong>.
              </li>
              <li>We inflate that target over about one year for a near-term build plan.</li>
              <li>
                Required SIP uses your risk profile&apos;s illustrative return over a 12-month horizon.
              </li>
              <li>Download a branded one-page PDF from the next screens after you review numbers.</li>
            </ul>
          </GoalCard>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
