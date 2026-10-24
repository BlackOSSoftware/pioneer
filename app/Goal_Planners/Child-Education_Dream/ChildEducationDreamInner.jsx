"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoalPlannerShell,
  GoalCard,
  GoalMetricGrid,
  GoalPrimaryButton,
  GoalResultPanel,
} from "@/components/goal-planners/GoalPlannerShell";
import {
  inflateAmount,
  requiredMonthlySip,
  riskReturn,
  formatGoalINR,
} from "@/lib/goal-planner-math";

export default function ChildEducationDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  const years = Number(search.get("years") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goalName = search.get("goal") || "Child Education";
  const risk = search.get("risk") || "Moderate";
  const expectedReturn = riskReturn(risk);

  const futureValue = useMemo(
    () => inflateAmount(cost, inflation, years),
    [cost, inflation, years]
  );

  const monthlySip = useMemo(
    () => requiredMonthlySip(futureValue, years, expectedReturn),
    [futureValue, years, expectedReturn]
  );

  const continueToSummary = () => {
    const q = new URLSearchParams({
      investmentType: "SIP",
      risk,
      years: String(years),
      futureValue: String(futureValue),
      sip: String(monthlySip),
      cost: String(cost),
      inflation: String(inflation),
      goal: goalName,
    }).toString();
    router.push(`/Goal_Planners/Child-Education-Summary?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Child's"
      highlight="Education"
      breadcrumb="Goal preview"
      description={`Preview for “${goalName}” — inflation-adjusted corpus and the monthly SIP needed at a ${risk.toLowerCase()} risk profile (~${expectedReturn}% p.a.).`}
    >
      <div className="space-y-6">
        <GoalCard title="Goal snapshot">
          <GoalMetricGrid
            items={[
              ["Cost today", formatGoalINR(cost)],
              ["Future value", formatGoalINR(futureValue)],
              ["Years to save", String(years || 0)],
              ["Monthly SIP required", formatGoalINR(monthlySip)],
            ]}
          />
        </GoalCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalResultPanel
            title="Assumptions"
            rows={[
              ["Goal name", goalName],
              ["Inflation", `${inflation}% p.a.`],
              ["Risk profile", risk],
              ["Expected return", `${expectedReturn}% p.a.`],
            ]}
          />
          <GoalCard title="Next step">
            <p className="text-sm leading-relaxed text-slate-600">
              Continue to your personalised plan summary and download a one-page branded PDF.
              To map existing investments, speak with your Pioneer advisor.
            </p>
            <div className="mt-6">
              <GoalPrimaryButton onClick={continueToSummary}>
                Continue to plan
              </GoalPrimaryButton>
            </div>
          </GoalCard>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
