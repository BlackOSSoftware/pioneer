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

export default function ChildEducationPage() {
  const router = useRouter();
  const [years, setYears] = useState("");
  const [cost, setCost] = useState("");
  const [inflation, setInflation] = useState("8");
  const [goalName, setGoalName] = useState("Child Education");
  const [risk, setRisk] = useState("Moderate");

  const handleBuild = () => {
    if (!years || !cost || !inflation) {
      showAppModal("Please fill years away, today's cost, and inflation.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }
    if (Number(years) <= 0 || Number(cost) <= 0) {
      showAppModal("Years and cost must be greater than zero.", {
        variant: "info",
        title: "Invalid values",
      });
      return;
    }

    const q = new URLSearchParams({
      years: String(years),
      cost: String(cost),
      inflation: String(inflation),
      goal: goalName || "Child Education",
      risk,
    }).toString();

    router.push(`/Goal_Planners/Child-Education_Dream?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Child's"
      highlight="Education"
      breadcrumb="Child Education"
      description="Plan the corpus and monthly SIP needed for your child's higher education, adjusted for inflation and your risk profile."
    >
      <GoalCard title="Education goal inputs">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <GoalField label="Years until education" hint="How many years from today">
            <GoalInput
              type="number"
              min={1}
              max={30}
              value={years}
              onChange={setYears}
              placeholder="e.g. 12"
            />
          </GoalField>
          <GoalField label="Cost today (₹)" hint="Estimated education cost in today's value">
            <GoalInput
              type="number"
              min={0}
              value={cost}
              onChange={setCost}
              placeholder="e.g. 2500000"
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
              placeholder="8"
            />
          </GoalField>
          <GoalField label="Goal name">
            <GoalInput
              type="text"
              value={goalName}
              onChange={setGoalName}
              placeholder="Child Education"
            />
          </GoalField>
          <GoalField label="Risk profile" hint="Used to assume expected investment return">
            <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
          </GoalField>
        </div>
        <div className="mt-8 flex justify-center sm:justify-start">
          <GoalPrimaryButton onClick={handleBuild}>Build My Goal</GoalPrimaryButton>
        </div>
      </GoalCard>
    </GoalPlannerShell>
  );
}
