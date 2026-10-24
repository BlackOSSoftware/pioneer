"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoalPlannerShell,
  GoalCard,
  GoalMetricGrid,
  GoalResultPanel,
  GoalPrimaryButton,
} from "@/components/goal-planners/GoalPlannerShell";
import GoalPdfDownload from "@/components/goal-planners/GoalPdfDownload";
import {
  inflateAmount,
  requiredMonthlySip,
  riskReturn,
  totalInvestedFromSip,
  formatGoalINR,
} from "@/lib/goal-planner-math";

export default function WealthDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  // Query uses age=afterYears (legacy param name)
  const afterYears = Number(search.get("age") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const returnsParam = search.get("returns");
  const risk = search.get("risk") || "Moderate";
  const currentAge = Number(search.get("currentAge") || 0);

  const expectedReturn = useMemo(() => {
    if (returnsParam !== null && returnsParam !== "" && Number.isFinite(Number(returnsParam))) {
      return Number(returnsParam);
    }
    return riskReturn(risk);
  }, [returnsParam, risk]);

  const futureValue = useMemo(
    () => inflateAmount(cost, inflation, afterYears),
    [cost, inflation, afterYears]
  );
  const monthlySip = useMemo(
    () => requiredMonthlySip(futureValue, afterYears, expectedReturn),
    [futureValue, afterYears, expectedReturn]
  );
  const invested = totalInvestedFromSip(monthlySip, afterYears);
  const growth = Math.max(futureValue - invested, 0);

  const continueToSummary = () => {
    const q = new URLSearchParams({
      investmentType: "SIP",
      risk,
      years: String(afterYears),
      futureValue: String(futureValue),
      sip: String(monthlySip),
      cost: String(cost),
      inflation: String(inflation),
      returns: String(expectedReturn),
      currentAge: String(currentAge),
    }).toString();
    router.push(`/Goal_Planners/Wealth_Summary?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Wealth"
      highlight="Summary"
      breadcrumb="Wealth Creation"
      description="Inflation-adjusted target and the monthly SIP needed to build your corpus."
    >
      <div className="space-y-6">
        <GoalCard
          title="Goal snapshot"
          action={
            <GoalPdfDownload
              calculatorType="Wealth Creation Goal Planner"
              reportTitle="Wealth Creation — Advisory Report"
              summaryCards={[
                ["Current age", currentAge ? `${currentAge} years` : "—"],
                ["Horizon", `${afterYears} years`],
                ["Target (today)", cost],
                ["Inflation", `${inflation}%`],
                ["Risk", risk],
              ]}
              metricRows={[
                ["Future value", futureValue],
                ["Expected return", `${expectedReturn}% p.a.`],
                ["Required monthly SIP", monthlySip],
                ["Total invested", invested],
                ["Estimated growth", growth],
              ]}
            />
          }
        >
          <GoalMetricGrid
            items={[
              ["Target (today's value)", formatGoalINR(cost)],
              [`Future value (${inflation}% inflation)`, formatGoalINR(futureValue)],
              ["Years to save", String(afterYears)],
              ["Monthly SIP required", formatGoalINR(monthlySip)],
            ]}
          />
        </GoalCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalResultPanel
            title="Plan summary"
            rows={[
              ["Risk profile", risk],
              ["Expected return", `${expectedReturn}% p.a.`],
              ["Total invested (est.)", formatGoalINR(invested)],
              ["Estimated growth", formatGoalINR(growth)],
              ["Required monthly SIP", formatGoalINR(monthlySip)],
            ]}
          />
          <GoalCard title="Next step">
            <p className="text-sm leading-relaxed text-slate-600">
              Continue to your plan view with invested-vs-growth breakdown. Existing investments can
              be mapped later with your advisor — no client login required here.
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
