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

export default function DreamHomePage() {
  const router = useRouter();

  const [years, setYears] = useState("10");
  const [houseCost, setHouseCost] = useState("5000000");
  const [inflation, setInflation] = useState("6");
  const [goalName, setGoalName] = useState("Dream Home");
  const [risk, setRisk] = useState("Moderate");

  const handleBuild = () => {
    const y = Number(years);
    const cost = Number(houseCost);
    const inf = Number(inflation);

    if (!y || y <= 0 || !cost || cost <= 0 || inflation === "" || Number.isNaN(inf)) {
      showAppModal("Please fill years, house cost, and inflation with valid numbers.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }

    const q = new URLSearchParams({
      age: String(y),
      cost: String(cost),
      inflation: String(inf),
      goal: (goalName || "Dream Home").trim(),
      risk,
    }).toString();

    router.push(`/Goal_Planners/Dream-home-Dream?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Dream"
      highlight="Home"
      breadcrumb="Dream Home"
      description="Plan the corpus you need for your dream home — adjust for inflation and estimate the monthly SIP required for your risk profile."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GoalCard title="Your dream home goal">
          <div className="grid gap-5 sm:grid-cols-2">
            <GoalField label="Years until purchase" hint="How many years from now you plan to buy">
              <GoalInput
                type="number"
                min={1}
                max={40}
                value={years}
                onChange={setYears}
                placeholder="e.g. 10"
              />
            </GoalField>

            <GoalField label="House cost (today’s value)" hint="Estimated price in today’s rupees">
              <GoalInput
                type="number"
                min={0}
                value={houseCost}
                onChange={setHouseCost}
                placeholder="e.g. 5000000"
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

            <GoalField label="Risk appetite">
              <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
            </GoalField>

            <div className="sm:col-span-2">
              <GoalField label="Goal name">
                <GoalInput
                  type="text"
                  value={goalName}
                  onChange={setGoalName}
                  placeholder="Dream Home"
                />
              </GoalField>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <GoalPrimaryButton onClick={handleBuild}>Build my goal</GoalPrimaryButton>
            <p className="text-xs text-slate-500">
              Returns are illustrative based on risk profile (Conservative 8%, Moderate 10%,
              Aggressive 12%).
            </p>
          </div>
        </GoalCard>

        <GoalCard title="How it works">
          <ol className="space-y-4 text-sm leading-relaxed text-slate-600">
            <li>
              <span className="font-semibold text-[#071a2e]">1. Inflate the cost</span>
              <br />
              Future house price = today’s cost grown at your inflation rate.
            </li>
            <li>
              <span className="font-semibold text-[#071a2e]">2. Match expected return</span>
              <br />
              We map your risk appetite to an assumed annual return for SIP sizing.
            </li>
            <li>
              <span className="font-semibold text-[#071a2e]">3. Required monthly SIP</span>
              <br />
              We estimate the SIP needed to reach the inflated goal amount in time.
            </li>
          </ol>
        </GoalCard>
      </div>
    </GoalPlannerShell>
  );
}
