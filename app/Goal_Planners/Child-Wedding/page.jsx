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

export default function ChildWeddingPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [afterYears, setAfterYears] = useState("");
  const [inflation, setInflation] = useState("7");
  const [returns, setReturns] = useState("");
  const [risk, setRisk] = useState("Moderate");

  const handleSubmit = () => {
    if (!amount || !afterYears || !inflation) {
      showAppModal("Please fill wedding amount, years, and inflation.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }
    if (Number(amount) <= 0 || Number(afterYears) <= 0) {
      showAppModal("Amount and years must be greater than zero.", {
        variant: "info",
        title: "Invalid values",
      });
      return;
    }

    const q = new URLSearchParams({
      years: String(afterYears),
      cost: String(amount),
      inflation: String(inflation),
      risk,
    });
    if (returns !== "" && returns != null) {
      q.set("returns", String(returns));
    }

    router.push(`/Goal_Planners/Child-Wedding-Dream?${q.toString()}`);
  };

  return (
    <GoalPlannerShell
      title="Child"
      highlight="Wedding"
      breadcrumb="Child Wedding"
      description="Estimate the future cost of your child's wedding and the monthly SIP required, using inflation and your preferred return assumption."
    >
      <GoalCard title="Wedding goal inputs">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <GoalField label="Wedding amount today (₹)">
            <GoalInput
              type="number"
              min={0}
              value={amount}
              onChange={setAmount}
              placeholder="e.g. 1500000"
            />
          </GoalField>
          <GoalField label="Years until wedding">
            <GoalInput
              type="number"
              min={1}
              max={40}
              value={afterYears}
              onChange={setAfterYears}
              placeholder="e.g. 15"
            />
          </GoalField>
          <GoalField label="Inflation (% p.a.)">
            <GoalInput
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={inflation}
              onChange={setInflation}
              placeholder="7"
            />
          </GoalField>
          <GoalField
            label="Expected return (% p.a.)"
            hint="Optional — leave blank to use risk-based return"
          >
            <GoalInput
              type="number"
              min={0}
              max={30}
              step={0.1}
              value={returns}
              onChange={setReturns}
              placeholder="Optional"
            />
          </GoalField>
          <GoalField label="Risk profile">
            <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
          </GoalField>
        </div>
        <div className="mt-8 flex justify-center sm:justify-start">
          <GoalPrimaryButton onClick={handleSubmit}>Build My Goal</GoalPrimaryButton>
        </div>
      </GoalCard>
    </GoalPlannerShell>
  );
}
