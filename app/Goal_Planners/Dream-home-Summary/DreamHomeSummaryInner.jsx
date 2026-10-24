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
  totalInvestedFromSip,
  formatGoalINR,
  riskReturn,
  sipGrowthSeries,
} from "@/lib/goal-planner-math";

const SAMPLE_FUNDS = [
  {
    id: 1,
    name: "Parag Parikh Conservative Hybrid Fund Reg Gr",
    category: "Hybrid: Conservative",
    allocation: 25,
  },
  {
    id: 2,
    name: "ICICI Pru Equity & Debt Gr",
    category: "Hybrid: Aggressive",
    allocation: 30,
  },
  {
    id: 3,
    name: "DSP Large Cap Fund Reg Gr",
    category: "Equity: Large Cap",
    allocation: 25,
  },
  {
    id: 4,
    name: "Nippon India Multi Cap Fund Gr",
    category: "Equity: Multi Cap",
    allocation: 20,
  },
];

export default function DreamHomeSummaryInner() {
  const search = useSearchParams();

  const investmentType = search.get("investmentType") || "SIP";
  const risk = search.get("risk") || "Moderate";
  const years = Number(search.get("years") || 0);
  const futureValue = Number(search.get("futureValue") || 0);
  const sip = Number(search.get("sip") || 0);
  const cost = Number(search.get("cost") || 0);
  const inflation = Number(search.get("inflation") || 0);
  const goal = search.get("goal") || "Dream Home";

  const expectedReturn = riskReturn(risk);
  const totalInvested = useMemo(() => totalInvestedFromSip(sip, years), [sip, years]);
  const growth = Math.max(0, futureValue - totalInvested);
  const growthSeries = useMemo(
    () => sipGrowthSeries(sip, years, expectedReturn),
    [sip, years, expectedReturn]
  );

  const pieData = useMemo(
    () => ({
      labels: ["Total invested", "Estimated growth"],
      datasets: [
        {
          data: [Math.max(totalInvested, 0), Math.max(growth, 0)],
          backgroundColor: ["#0ea5e9", "#071a2e"],
          borderWidth: 0,
        },
      ],
    }),
    [totalInvested, growth]
  );

  const fundRows = useMemo(
    () =>
      SAMPLE_FUNDS.map((f) => ({
        ...f,
        amount: Math.round((sip * f.allocation) / 100),
      })),
    [sip]
  );

  return (
    <GoalPlannerShell
      title="Dream"
      highlight="Home plan"
      breadcrumb="Dream Home"
      description={`SIP plan for “${goal}” — ${years} year horizon, ${risk.toLowerCase()} risk (~${expectedReturn}% p.a.).`}
    >
      <div className="space-y-6">
        <GoalCard
          title="Plan overview"
          action={
            <GoalPdfDownload
              calculatorType="Dream Home Goal Planner"
              reportTitle="Dream Home Goal Plan"
              summaryCards={[
                ["Goal", goal],
                ["Risk", risk],
                ["Horizon", `${years} years`],
                ["Investment type", investmentType],
              ]}
              metricRows={[
                ["Today’s house cost", cost],
                ["Inflation assumed", `${inflation}% p.a.`],
                ["Future value needed", futureValue],
                ["Expected return", `${expectedReturn}% p.a.`],
                ["Monthly SIP", sip],
                ["Total invested (SIP)", totalInvested],
                ["Estimated growth", growth],
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
              ["Target (future value)", formatGoalINR(futureValue)],
              ["Monthly SIP", formatGoalINR(sip)],
              ["Total invested (est.)", formatGoalINR(totalInvested)],
            ]}
          />
        </GoalCard>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GoalCard title="Invested vs growth">
            <div className="mx-auto max-w-xs">
              <Pie data={pieData} options={DISPLAY_PIE_OPTIONS} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-sky-500" />
                Invested {formatGoalINR(totalInvested)}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-[#071a2e]" />
                Growth {formatGoalINR(growth)}
              </span>
            </div>
          </GoalCard>

          <GoalResultPanel
            title="Corpus breakdown"
            rows={[
              ["Goal name", goal],
              ["Today’s cost", formatGoalINR(cost)],
              ["Inflation", `${inflation}% p.a.`],
              ["Future value needed", formatGoalINR(futureValue)],
              ["Total SIP invested", formatGoalINR(totalInvested)],
              ["Estimated growth", formatGoalINR(growth)],
            ]}
          />
        </div>

        <GoalCard title="Sample recommended funds">
          <p className="mb-4 text-sm text-slate-500">
            Illustrative allocation only. Final scheme selection should be done with your advisor.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3 font-semibold">Scheme</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Allocation</th>
                  <th className="px-3 py-3 font-semibold">SIP amount</th>
                </tr>
              </thead>
              <tbody>
                {fundRows.map((f) => (
                  <tr key={f.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-800">{f.name}</td>
                    <td className="px-3 py-3 text-slate-600">{f.category}</td>
                    <td className="px-3 py-3 tabular-nums text-slate-700">{f.allocation}%</td>
                    <td className="px-3 py-3 tabular-nums font-semibold text-[#071a2e]">
                      {formatGoalINR(f.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/Goal_Planners/Dream-home"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#071a2e] transition hover:bg-slate-50"
            >
              Back to Dream Home
            </Link>
            <p className="text-sm text-slate-500">
              Monthly SIP total:{" "}
              <span className="font-semibold text-[#071a2e]">{formatGoalINR(sip)}</span>
            </p>
          </div>
        </GoalCard>
      </div>
    </GoalPlannerShell>
  );
}
