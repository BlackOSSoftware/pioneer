"use client";

import { useMemo, useState } from "react";
import { showAppModal } from "@/lib/pioneer-modal-bus";
import {
  GoalPlannerShell,
  GoalCard,
  GoalField,
  GoalInput,
  GoalSelect,
  GoalPrimaryButton,
  GoalMetricGrid,
  GoalResultPanel,
} from "@/components/goal-planners/GoalPlannerShell";
import GoalPdfDownload from "@/components/goal-planners/GoalPdfDownload";
import {
  inflateAmount,
  requiredMonthlySip,
  riskReturn,
  totalInvestedFromSip,
  formatGoalINR,
  sipGrowthSeries,
} from "@/lib/goal-planner-math";

const RISK_OPTIONS = [
  { value: "Conservative", label: "Conservative" },
  { value: "Moderate", label: "Moderate" },
  { value: "Aggressive", label: "Aggressive" },
];

export default function RetirementGoalPage() {
  const [age, setAge] = useState("35");
  const [retireAge, setRetireAge] = useState("60");
  const [lifeExpectancy, setLifeExpectancy] = useState("85");
  const [expenses, setExpenses] = useState("50000");
  const [inflation, setInflation] = useState("6");
  const [returns, setReturns] = useState("");
  const [savedAmount, setSavedAmount] = useState("0");
  const [goalName, setGoalName] = useState("Retirement");
  const [risk, setRisk] = useState("Moderate");

  const plan = useMemo(() => {
    const currentAge = Number(age) || 0;
    const retire = Number(retireAge) || 0;
    const life = Number(lifeExpectancy) || 0;
    const monthlyExp = Number(expenses) || 0;
    const infl = Number(inflation) || 0;
    const saved = Number(savedAmount) || 0;
    const expectedReturn =
      returns !== "" && returns != null ? Number(returns) : riskReturn(risk);

    const yearsToRetire = Math.max(0, retire - currentAge);
    const yearsInRetirement = Math.max(0, life - retire);
    const futureMonthlyExpense = inflateAmount(monthlyExp, infl, yearsToRetire);
    const corpus = Math.round(futureMonthlyExpense * 12 * yearsInRetirement);
    const savedFuture = inflateAmount(saved, expectedReturn, yearsToRetire);
    const gap = Math.max(0, corpus - savedFuture);
    const sip = requiredMonthlySip(gap, yearsToRetire, expectedReturn);
    const totalInvested = totalInvestedFromSip(sip, yearsToRetire);
    const growthSeries = sipGrowthSeries(sip, yearsToRetire, expectedReturn);

    return {
      currentAge,
      retire,
      life,
      monthlyExp,
      infl,
      saved,
      expectedReturn,
      yearsToRetire,
      yearsInRetirement,
      futureMonthlyExpense,
      corpus,
      savedFuture,
      gap,
      sip,
      totalInvested,
      growthSeries,
    };
  }, [age, retireAge, lifeExpectancy, expenses, inflation, returns, savedAmount, risk]);

  const resultsReady =
    plan.yearsToRetire > 0 && plan.yearsInRetirement > 0 && plan.monthlyExp > 0;

  const handleBuild = () => {
    if (!age || !retireAge || !lifeExpectancy || !expenses || !inflation) {
      showAppModal("Please fill age, retirement age, life expectancy, expenses, and inflation.", {
        variant: "info",
        title: "Required fields",
      });
      return;
    }
    if (plan.yearsToRetire <= 0) {
      showAppModal("Retirement age must be greater than your current age.", {
        variant: "info",
        title: "Invalid ages",
      });
      return;
    }
    if (plan.yearsInRetirement <= 0) {
      showAppModal("Life expectancy must be greater than retirement age.", {
        variant: "info",
        title: "Invalid ages",
      });
      return;
    }
    document.getElementById("retirement-results")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <GoalPlannerShell
      title="Retirement"
      highlight="Planner"
      breadcrumb="Retirement"
      description="Build a conservative retirement corpus from today's expenses, inflate to retirement, net off existing savings, and see the SIP you need."
    >
      <div className="space-y-6">
        <GoalCard title="Retirement inputs">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <GoalField label="Current age">
              <GoalInput type="number" min={18} max={80} value={age} onChange={setAge} />
            </GoalField>
            <GoalField label="Retirement age">
              <GoalInput
                type="number"
                min={40}
                max={80}
                value={retireAge}
                onChange={setRetireAge}
              />
            </GoalField>
            <GoalField label="Life expectancy">
              <GoalInput
                type="number"
                min={60}
                max={110}
                value={lifeExpectancy}
                onChange={setLifeExpectancy}
              />
            </GoalField>
            <GoalField label="Monthly expenses today (₹)">
              <GoalInput
                type="number"
                min={0}
                value={expenses}
                onChange={setExpenses}
                placeholder="50000"
              />
            </GoalField>
            <GoalField label="Inflation (% p.a.)">
              <GoalInput
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={inflation}
                onChange={setInflation}
              />
            </GoalField>
            <GoalField
              label="Expected return (% p.a.)"
              hint="Optional — leave blank to use risk-based return"
            >
              <GoalInput
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={returns}
                onChange={setReturns}
                placeholder="Optional"
              />
            </GoalField>
            <GoalField label="Already saved (₹)">
              <GoalInput
                type="number"
                min={0}
                value={savedAmount}
                onChange={setSavedAmount}
                placeholder="0"
              />
            </GoalField>
            <GoalField label="Goal name">
              <GoalInput type="text" value={goalName} onChange={setGoalName} />
            </GoalField>
            <GoalField label="Risk profile">
              <GoalSelect value={risk} onChange={setRisk} options={RISK_OPTIONS} />
            </GoalField>
          </div>
          <div className="mt-8 flex justify-center sm:justify-start">
            <GoalPrimaryButton onClick={handleBuild}>Build My Goal</GoalPrimaryButton>
          </div>
        </GoalCard>

        {resultsReady ? (
          <div id="retirement-results" className="space-y-6">
            <GoalCard
              title={`Plan for “${goalName || "Retirement"}”`}
              action={
                <GoalPdfDownload
                  calculatorType="Retirement Goal"
                  reportTitle="Retirement Goal Plan"
                  summaryCards={[
                    ["Goal", goalName || "Retirement"],
                    ["Risk", risk],
                    ["Years to retire", plan.yearsToRetire],
                    ["Monthly SIP", plan.sip],
                  ]}
                  metricRows={[
                    ["Corpus needed", plan.corpus],
                    ["Savings at retirement", plan.savedFuture],
                    ["Funding gap", plan.gap],
                    ["Future monthly expense", plan.futureMonthlyExpense],
                    ["Years in retirement", plan.yearsInRetirement],
                    ["Expected return %", `${plan.expectedReturn}%`],
                    ["Total SIP invested (est.)", plan.totalInvested],
                  ]}
                  lineLabels={plan.growthSeries.labels}
                  lineValues={plan.growthSeries.values}
                />
              }
            >
              <GoalMetricGrid
                items={[
                  ["Years to retire", String(plan.yearsToRetire)],
                  ["Years in retirement", String(plan.yearsInRetirement)],
                  ["Future monthly expense", formatGoalINR(plan.futureMonthlyExpense)],
                  ["Corpus needed", formatGoalINR(plan.corpus)],
                ]}
              />
            </GoalCard>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <GoalResultPanel
                title="Funding plan"
                rows={[
                  ["Existing savings (today)", formatGoalINR(plan.saved)],
                  ["Savings at retirement", formatGoalINR(plan.savedFuture)],
                  ["Funding gap", formatGoalINR(plan.gap)],
                  ["Required monthly SIP", formatGoalINR(plan.sip)],
                ]}
              />
              <GoalResultPanel
                title="Assumptions"
                rows={[
                  ["Inflation", `${plan.infl}% p.a.`],
                  ["Expected return", `${plan.expectedReturn}% p.a.`],
                  ["Risk profile", risk],
                  ["Total SIP invested (est.)", formatGoalINR(plan.totalInvested)],
                ]}
              />
            </div>
          </div>
        ) : null}
      </div>
    </GoalPlannerShell>
  );
}
