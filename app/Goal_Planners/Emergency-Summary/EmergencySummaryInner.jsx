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
    name: "Parag Parikh Conservative Hybrid Fund Reg Gr",
    category: "Hybrid: Conservative",
    allocation: 40,
  },
  {
    name: "ICICI Pru Equity & Debt Gr",
    category: "Hybrid: Aggressive",
    allocation: 30,
  },
  {
    name: "DSP Banking & PSU Debt Fund Reg Gr",
    category: "Debt: Banking & PSU",
    allocation: 30,
  },
];

export default function EmergencySummaryInner() {
  const search = useSearchParams();

  const investmentType = search.get("investmentType") || "SIP";
  const risk = search.get("risk") || "Conservative";
  const years = Number(search.get("years") || 1) || 1;
  const futureValue = Number(search.get("futureValue") || 0);
  const sip = Number(search.get("sip") || 0);
  const expenses = Number(search.get("expenses") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goalName = search.get("goal") || "Emergency Fund";
  const age = Number(search.get("age") || 0);
  const targetFund = Number(search.get("targetFund") || expenses * 6);

  const expectedReturn = riskReturn(risk);
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
      title="Emergency"
      highlight="Plan"
      breadcrumb="Emergency"
      description="Illustrative allocation and SIP plan for your emergency corpus."
    >
      <div className="space-y-6">
        <GoalCard
          title="Plan overview"
          action={
            <GoalPdfDownload
              calculatorType="Emergency Goal Planner"
              reportTitle="Emergency Fund — Advisory Report"
              summaryCards={[
                ["Goal", goalName],
                ["Investment type", investmentType],
                ["Risk", risk],
                ["Horizon", `${years} year`],
              ]}
              metricRows={[
                ["Current age", age ? `${age} years` : "—"],
                ["Monthly expenses", expenses],
                ["6-month target (today)", targetFund],
                ["Inflation", `${inflation}%`],
                ["Target corpus", futureValue],
                ["Monthly SIP", sip],
                ["Total invested", invested],
                ["Estimated growth", growth],
                ["Expected return", `${expectedReturn}% p.a.`],
              ]}
            />
          }
        >
          <GoalMetricGrid
            items={[
              ["Investment type", investmentType],
              ["Risk tolerance", risk],
              ["Time horizon", `${years} year`],
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
              ["Goal", goalName],
              ["Profile", risk],
              [
                "Focus",
                "Liquidity and capital stability for unexpected needs while building the corpus over ~12 months.",
              ],
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
            Sample schemes for illustration only. Final selection should follow risk profile, liquidity
            needs, and scheme documents.
          </p>
        </GoalCard>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/Goal_Planners/Emergency"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to inputs
          </Link>
        </div>
      </div>
    </GoalPlannerShell>
  );
}
