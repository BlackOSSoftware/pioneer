"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pie } from "react-chartjs-2";
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
  riskReturn,
  totalInvestedFromSip,
  formatGoalINR,
} from "@/lib/goal-planner-math";

const SAMPLE_FUNDS = [
  {
    name: "Parag Parikh Flexi Cap Fund Reg Gr",
    category: "Equity: Flexi Cap",
    allocation: 35,
  },
  {
    name: "ICICI Pru Equity & Debt Gr",
    category: "Hybrid: Aggressive",
    allocation: 30,
  },
  {
    name: "DSP Large Cap Fund Reg Gr",
    category: "Equity: Large Cap",
    allocation: 20,
  },
  {
    name: "Nippon India Multi Cap Gr",
    category: "Equity: Multi Cap",
    allocation: 15,
  },
];

export default function WealthSummaryInner() {
  const search = useSearchParams();

  const investmentType = search.get("investmentType") || "SIP";
  const risk = search.get("risk") || "Moderate";
  const years = Number(search.get("years") || 0);
  const futureValue = Number(search.get("futureValue") || 0);
  const sip = Number(search.get("sip") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const returnsParam = search.get("returns");
  const currentAge = Number(search.get("currentAge") || 0);

  const expectedReturn =
    returnsParam !== null && returnsParam !== "" && Number.isFinite(Number(returnsParam))
      ? Number(returnsParam)
      : riskReturn(risk);

  const invested = totalInvestedFromSip(sip, years);
  const growth = Math.max(futureValue - invested, 0);

  const pieData = useMemo(
    () => ({
      labels: ["Total invested", "Estimated growth"],
      datasets: [
        {
          data: [Math.max(invested, 0), Math.max(growth, 0)],
          backgroundColor: ["#0ea5e9", "#071a2e"],
          borderWidth: 0,
        },
      ],
    }),
    [invested, growth]
  );

  return (
    <GoalPlannerShell
      title="Wealth"
      highlight="Plan"
      breadcrumb="Wealth Creation"
      description="Illustrative SIP plan and allocation for your wealth-creation goal."
    >
      <div className="space-y-6">
        <GoalCard
          title="Plan overview"
          action={
            <GoalPdfDownload
              calculatorType="Wealth Creation Goal Planner"
              reportTitle="Wealth Creation — Advisory Report"
              summaryCards={[
                ["Investment type", investmentType],
                ["Risk", risk],
                ["Horizon", `${years} years`],
                ["Target (today)", cost],
              ]}
              metricRows={[
                ["Current age", currentAge ? `${currentAge} years` : "—"],
                ["Inflation", `${inflation}%`],
                ["Expected return", `${expectedReturn}% p.a.`],
                ["Future value", futureValue],
                ["Monthly SIP", sip],
                ["Total invested", invested],
                ["Estimated growth", growth],
              ]}
            />
          }
        >
          <GoalMetricGrid
            items={[
              ["Investment type", investmentType],
              ["Risk tolerance", risk],
              ["Time horizon", `${years} years`],
              ["Target amount", formatGoalINR(futureValue)],
              ["Monthly SIP", formatGoalINR(sip)],
              ["Expected return", `${expectedReturn}% p.a.`],
            ]}
          />
        </GoalCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalCard title="Invested vs growth">
            <div className="mx-auto max-w-xs">
              <Pie data={pieData} options={DISPLAY_PIE_OPTIONS} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <span>
                Invested: <strong className="text-slate-900">{formatGoalINR(invested)}</strong>
              </span>
              <span>
                Growth: <strong className="text-slate-900">{formatGoalINR(growth)}</strong>
              </span>
            </div>
          </GoalCard>

          <GoalResultPanel
            title="Objective"
            rows={[
              ["Profile", risk],
              [
                "Focus",
                "Build long-term wealth through disciplined SIPs aligned to your horizon and risk.",
              ],
              ["Today's target", formatGoalINR(cost)],
              ["Inflation-adjusted", formatGoalINR(futureValue)],
              ["Required SIP", formatGoalINR(sip)],
            ]}
          />
        </div>

        <GoalCard title="Sample fund mix (illustrative)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3 font-semibold">Scheme</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Allocation</th>
                  <th className="px-3 py-3 font-semibold">SIP share</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_FUNDS.map((f) => (
                  <tr key={f.name} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-800">{f.name}</td>
                    <td className="px-3 py-3 text-slate-600">{f.category}</td>
                    <td className="px-3 py-3 tabular-nums text-slate-700">{f.allocation}%</td>
                    <td className="px-3 py-3 tabular-nums text-slate-700">
                      {formatGoalINR(Math.round((sip * f.allocation) / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Sample schemes for illustration only. Final selection should follow risk profile and
            scheme-related documents.
          </p>
        </GoalCard>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/Goal_Planners/Wealth-Creation"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to inputs
          </Link>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
