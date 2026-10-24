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

export default function WeddingDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  // Support both new `years` and legacy `age` query key from older links
  const years = Number(search.get("years") || search.get("age") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const risk = search.get("risk") || "Moderate";
  const returnsParam = search.get("returns");
  const expectedReturn =
    returnsParam !== null && returnsParam !== ""
      ? Number(returnsParam)
      : riskReturn(risk);

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
      returns: String(expectedReturn),
    }).toString();
    router.push(`/Goal_Planners/Child-Wedding-Summary?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Child"
      highlight="Wedding"
      breadcrumb="Goal preview"
      description={`Inflation-adjusted wedding corpus and the monthly SIP at ~${expectedReturn}% p.a. (${risk} risk).`}
    >
      <div className="space-y-6">
        <GoalCard title="Goal snapshot">
          <GoalMetricGrid
            items={[
              ["Amount today", formatGoalINR(cost)],
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
              ["Inflation", `${inflation}% p.a.`],
              ["Risk profile", risk],
              ["Expected return", `${expectedReturn}% p.a.`],
              ["Investment type", "SIP"],
            ]}
          />
          <GoalCard title="Next step">
            <p className="text-sm leading-relaxed text-slate-600">
              Continue to your wedding plan summary and download a one-page branded PDF.
              Mapping of existing investments can be done with your Pioneer advisor.
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
