"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

export default function DreamHomeDreamInner() {
  const search = useSearchParams();
  const router = useRouter();

  const years = Number(search.get("age") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goal = search.get("goal") || "Dream Home";
  const risk = search.get("risk") || "Moderate";

  const expectedReturn = riskReturn(risk);

  const futureValue = useMemo(
    () => inflateAmount(cost, inflation, years),
    [cost, inflation, years]
  );

  const sip = useMemo(
    () => requiredMonthlySip(futureValue, years, expectedReturn),
    [futureValue, years, expectedReturn]
  );

  const continueToSummary = () => {
    const q = new URLSearchParams({
      investmentType: "SIP",
      risk,
      years: String(years),
      futureValue: String(futureValue),
      sip: String(sip),
      cost: String(cost),
      inflation: String(inflation),
      goal,
    }).toString();

    router.push(`/Goal_Planners/Dream-home-Summary?${q}`);
  };

  return (
    <GoalPlannerShell
      title="Goal"
      highlight="summary"
      breadcrumb="Dream Home"
      description={`Projected corpus and SIP for “${goal}” over ${years || "—"} years at a ${risk.toLowerCase()} risk profile (~${expectedReturn}% p.a.).`}
    >
      <div className="space-y-6">
        <GoalCard title="Key projections">
          <GoalMetricGrid
            items={[
              ["Target (today’s value)", formatGoalINR(cost)],
              [`Future value (${inflation}% inflation)`, formatGoalINR(futureValue)],
              ["Years to save", String(years || 0)],
              ["Monthly SIP required", formatGoalINR(sip)],
            ]}
          />
        </GoalCard>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <GoalResultPanel
            title="Plan snapshot"
            rows={[
              ["Goal name", goal],
              ["Risk profile", `${risk} (~${expectedReturn}% p.a.)`],
              ["Inflation assumed", `${inflation}% p.a.`],
              ["Horizon", `${years} years`],
              ["Required monthly SIP", formatGoalINR(sip)],
            ]}
          />

          <GoalCard title="Continue">
            <p className="text-sm leading-relaxed text-slate-600">
              Continue to your dream home plan to see invested amount vs growth, a sample fund
              mix, and download a one-page PDF report. To map existing investments to this goal,
              please contact your Pioneer advisor.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <GoalPrimaryButton onClick={continueToSummary}>
                Continue without mapping investments
              </GoalPrimaryButton>
              <Link
                href="/Goal_Planners/Dream-home"
                className="text-sm font-semibold text-[#071a2e] underline-offset-2 hover:underline"
              >
                Edit inputs
              </Link>
            </div>
          </GoalCard>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
