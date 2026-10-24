"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "@/lib/chartjs-register";
import { DISPLAY_PIE_OPTIONS } from "@/lib/chart-pdf-options";
import {
  GoalPlannerShell,
  GoalCard,
  GoalMetricGrid,
  GoalResultPanel,
} from "@/components/goal-planners/GoalPlannerShell";
import GoalPdfDownload from "@/components/goal-planners/GoalPdfDownload";
import {
  formatGoalINR,
  riskReturn,
  totalInvestedFromSip,
  sipGrowthSeries,
} from "@/lib/goal-planner-math";

ChartJS.register(ArcElement, Tooltip, Legend);

const SAMPLE_FUNDS = [
  { name: "Parag Parikh Conservative Hybrid Fund Reg Gr", category: "Hybrid: Conservative", allocation: 25 },
  { name: "ICICI Pru Equity & Debt Gr", category: "Hybrid: Aggressive", allocation: 25 },
  { name: "DSP Large Cap Fund Reg Gr", category: "Equity: Large Cap", allocation: 25 },
  { name: "Nippon India Multi Cap Gr", category: "Equity: Multi Cap", allocation: 25 },
];

export default function ChildWeddingSummaryInner() {
  const search = useSearchParams();

  const investmentType = search.get("investmentType") || "SIP";
  const risk = search.get("risk") || "Moderate";
  const years = Number(search.get("years") || 0);
  const futureValue = Number(search.get("futureValue") || 0);
  const sip = Number(search.get("sip") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const returnsParam = search.get("returns");
  const expectedReturn =
    returnsParam !== null && returnsParam !== ""
      ? Number(returnsParam)
      : riskReturn(risk);

  const totalInvested = useMemo(
    () => totalInvestedFromSip(sip, years),
    [sip, years]
  );
  const growth = Math.max(0, futureValue - totalInvested);
  const growthSeries = useMemo(
    () => sipGrowthSeries(sip, years, expectedReturn),
    [sip, years, expectedReturn]
  );

  const pieData = useMemo(
    () => ({
      labels: ["SIP invested", "Estimated growth"],
      datasets: [
        {
          data: [Math.max(totalInvested, 0), Math.max(growth, 0)],
          backgroundColor: ["#7dd3fc", "#0ea5e9"],
          borderWidth: 0,
        },
      ],
    }),
    [totalInvested, growth]
  );

  return (
    <GoalPlannerShell
      title="Child"
      highlight="Wedding"
      breadcrumb="Plan summary"
      description="Your wedding SIP plan — review corpus, invested vs growth, and download a one-page PDF."
    >
      <div className="space-y-6">
        <GoalCard
          title="Plan overview"
          action={
            <GoalPdfDownload
              calculatorType="Child Wedding Goal"
              reportTitle="Child Wedding Goal Plan"
              summaryCards={[
                ["Risk", risk],
                ["Years", years],
                ["Monthly SIP", sip],
                ["Future value", futureValue],
              ]}
              metricRows={[
                ["Amount today", cost],
                ["Future value", futureValue],
                ["Total invested (est.)", totalInvested],
                ["Estimated growth", growth],
                ["Expected return %", `${expectedReturn}%`],
                ["Inflation %", `${inflation}%`],
              ]}
              lineLabels={growthSeries.labels}
              lineValues={growthSeries.values}
            />
          }
        >
          <GoalMetricGrid
            items={[
              ["Investment type", investmentType],
              ["Risk tolerance", risk],
              ["Time horizon", `${years} years`],
              ["Monthly SIP", formatGoalINR(sip)],
            ]}
          />
        </GoalCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalCard title="Invested vs growth">
            <div className="mx-auto max-w-[260px]">
              <Pie data={pieData} options={DISPLAY_PIE_OPTIONS} />
            </div>
          </GoalCard>
          <GoalResultPanel
            title="Plan summary"
            rows={[
              ["Amount today", formatGoalINR(cost)],
              ["Future value", formatGoalINR(futureValue)],
              ["Total invested (est.)", formatGoalINR(totalInvested)],
              ["Estimated growth", formatGoalINR(growth)],
              ["Required monthly SIP", formatGoalINR(sip)],
            ]}
          />
        </div>

        <GoalCard title="Illustrative fund mix">
          <p className="mb-4 text-sm text-slate-600">
            Sample allocation for a {risk.toLowerCase()} profile. Final schemes are selected with your advisor.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Scheme</th>
                  <th className="pb-3 pr-4 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_FUNDS.map((f) => (
                  <tr key={f.name} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-800">{f.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{f.category}</td>
                    <td className="py-3 tabular-nums text-slate-800">{f.allocation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link
              href="/Goal_Planners/Child-Wedding"
              className="text-sm font-semibold text-[#071a2e] underline-offset-2 hover:underline"
            >
              ← Back to Child Wedding planner
            </Link>
          </div>
        </GoalCard>
      </div>
    </GoalPlannerShell>
  );
}
