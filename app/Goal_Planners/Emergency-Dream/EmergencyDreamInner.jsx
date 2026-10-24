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

const YEARS = 1;

export default function EmergencyDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  const age = Number(search.get("age") || 0);
  const expenses = Number(search.get("expenses") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goalName = search.get("goal") || "Emergency Fund";
  const risk = search.get("risk") || "Conservative";

  const expectedReturn = riskReturn(risk);
  const targetFund = useMemo(() => Math.round((expenses || 0) * 6), [expenses]);
  const futureValue = useMemo(
    () => inflateAmount(targetFund, inflation, YEARS),
    [targetFund, inflation]
  );
  const monthlySip = useMemo(
    () => requiredMonthlySip(futureValue, YEARS, expectedReturn),
    [futureValue, expectedReturn]
  );
  const invested = totalInvestedFromSip(monthlySip, YEARS);
  const growth = Math.max(futureValue - invested, 0);

  const continueToSummary = () => {
    const q = new URLSearchParams({
      investmentType: "SIP",
      risk,
      years: String(YEARS),
      futureValue: String(futureValue),
      sip: String(monthlySip),
      expenses: String(expenses),
      inflation: String(inflation),
      goal: goalName,
      age: String(age),
      targetFund: String(targetFund),
    }).toString();
    router.push(`/Goal_Planners/Emergency-Summary?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Emergency"
      highlight="Summary"
      breadcrumb="Emergency"
      description={`Review the plan for “${goalName}” — a six-month safety cushion built over about one year.`}
    >
      <div className="space-y-6">
        <GoalCard
          title="Goal snapshot"
          action={
            <GoalPdfDownload
              calculatorType="Emergency Goal Planner"
              reportTitle="Emergency Fund — Advisory Report"
              summaryCards={[
                ["Goal", goalName],
                ["Current age", age ? `${age} years` : "—"],
                ["Monthly expenses", expenses],
                ["Inflation", `${inflation}%`],
                ["Risk", risk],
              ]}
              metricRows={[
                ["6-month target (today)", targetFund],
                ["Inflation-adjusted target", futureValue],
                ["Horizon", `${YEARS} year`],
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
              ["Monthly expenses", formatGoalINR(expenses)],
              ["Emergency fund (6 months)", formatGoalINR(targetFund)],
              [`Inflation-adjusted (${inflation}% / 1 yr)`, formatGoalINR(futureValue)],
              ["Monthly SIP required", formatGoalINR(monthlySip)],
            ]}
          />
        </GoalCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalResultPanel
            title="Plan summary"
            rows={[
              ["Goal name", goalName],
              ["Risk profile", risk],
              ["Expected return", `${expectedReturn}% p.a.`],
              ["Build horizon", `${YEARS} year`],
              ["Required monthly SIP", formatGoalINR(monthlySip)],
            ]}
          />
          <GoalCard title="Next step">
            <p className="text-sm leading-relaxed text-slate-600">
              Continue to your recommended allocation view. Mapping existing investments can be done
              with your advisor — this plan proceeds without client login.
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
