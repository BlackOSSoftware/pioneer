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
import { riskReturn } from "@/lib/goal-planner-math";

const RISK_OPTIONS = [
  { value: "Conservative", label: "Conservative" },
  { value: "Moderate", label: "Moderate" },
  { value: "Aggressive", label: "Aggressive" },
];

export default function WealthCreationPage() {
  const router = useRouter();
  const [currentAge, setCurrentAge] = useState("");
  const [amount, setAmount] = useState("");
  const [afterYears, setAfterYears] = useState("");
  const [inflation, setInflation] = useState("6");
  const [returns, setReturns] = useState("");
  const [risk, setRisk] = useState("Moderate");

  const handleBuild = () => {
    if (!currentAge || !amount || !afterYears || inflation === "") {
      showAppModal("Please fill age, target amount, years, and inflation.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }
    if (Number(amount) <= 0 || Number(afterYears) <= 0) {
      showAppModal("Target amount and years must be greater than zero.", {
        variant: "info",
        title: "Invalid values",
      });
      return;
    }

    const q = new URLSearchParams({
      age: String(afterYears),
      cost: String(amount),
      inflation: String(inflation),
      returns: returns === "" ? "" : String(returns),
      risk,
      currentAge: String(currentAge),
    }).toString();

    router.push(`/Goal_Planners/Wealth_Dream?${q}`);
  };

  const impliedReturn = returns === "" ? riskReturn(risk) : Number(returns);

  return (
    <GoalPlannerShell
      title="Wealth"
      highlight="Creation"
      breadcrumb="Wealth Creation"
      description="Plan a corpus in today’s value, inflate it to your horizon, and estimate the monthly SIP needed."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <GoalCard title="Your inputs">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <GoalField label="Current age">
                <GoalInput
                  type="number"
                  min={18}
                  max={100}
                  value={currentAge}
                  onChange={setCurrentAge}
                  placeholder="e.g. 32"
                />
              </GoalField>
              <GoalField label="Target amount today (₹)">
                <GoalInput
                  type="number"
                  min={0}
                  value={amount}
                  onChange={setAmount}
                  placeholder="e.g. 5000000"
                />
              </GoalField>
              <GoalField label="Years to goal">
                <GoalInput
                  type="number"
                  min={1}
                  max={50}
                  value={afterYears}
                  onChange={setAfterYears}
                  placeholder="e.g. 15"
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
              <GoalField
                label="Expected return (% p.a.)"
                hint={`Optional. Leave blank to use ${riskReturn(risk)}% from your risk profile.`}
              >
                <GoalInput
                  type="number"
                  min={0}
                  max={30}
                  step={0.1}
                  value={returns}
                  onChange={setReturns}
                  placeholder={`Default ${riskReturn(risk)}`}
                />
              </GoalField>
              <GoalField label="Risk profile">
                <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
              </GoalField>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Illustrative return used for SIP: <strong>{impliedReturn || 0}% p.a.</strong>
            </p>
            <div className="mt-6">
              <GoalPrimaryButton onClick={handleBuild}>Build my goal</GoalPrimaryButton>
            </div>
          </GoalCard>
        </div>

        <div className="lg:col-span-2">
          <GoalCard title="How it works">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>Enter the wealth target in today&apos;s rupees and your investment horizon.</li>
              <li>We inflate the target to a future value using your inflation assumption.</li>
              <li>
                Required SIP compounds at your expected return (or the return implied by risk
                profile).
              </li>
              <li>Download a branded one-page PDF after reviewing the plan.</li>
            </ul>
          </GoalCard>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
