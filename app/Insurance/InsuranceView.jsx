"use client";

import { useState } from "react";
import { ArrowRight, Check, HeartPulse, Shield } from "lucide-react";
import PublicInquiryModal from "@/components/public/PublicInquiryModal";

export default function InsuranceView({ insurance }) {
  const [activeTab, setActiveTab] = useState("life");
  const [inqOpen, setInqOpen] = useState(false);
  const [inqPlan, setInqPlan] = useState(null);

  const lifePlans = Array.isArray(insurance.lifePlans) ? insurance.lifePlans : [];
  const healthPlans = Array.isArray(insurance.healthPlans) ? insurance.healthPlans : [];
  const plans = activeTab === "life" ? lifePlans : healthPlans;

  const inquiryContext = inqPlan
    ? {
        planType: activeTab,
        planId: inqPlan.id,
        headline: `${activeTab === "life" ? "Life" : "Health"} insurance: ${inqPlan.name}`,
        lines: [
          `Plan: ${inqPlan.name}`,
          `Company: ${inqPlan.company || "—"}`,
          `Coverage: ${inqPlan.coverage || "—"}`,
          `Premium: ${inqPlan.premium || "—"}`,
          ...(Array.isArray(inqPlan.features) ? inqPlan.features.map((f) => `• ${f}`) : []),
        ],
      }
    : {};

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 to-blue-900 px-6 py-14 text-center text-white shadow-xl sm:px-10">
          <h1 className="text-3xl font-bold sm:text-5xl">{insurance.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-sky-100 sm:text-base">{insurance.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("life")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "life" ? "bg-sky-700 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {insurance.lifeTabLabel || "Life Insurance"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("health")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "health" ? "bg-sky-700 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {insurance.healthTabLabel || "Health Insurance"}
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id || plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                {activeTab === "life" ? <Shield size={22} /> : <HeartPulse size={22} />}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
              <p className="text-sm text-slate-500">{plan.company}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Coverage</p>
                  <p className="font-semibold text-slate-800">{plan.coverage}</p>
                </div>
                <div>
                  <p className="text-slate-500">Premium</p>
                  <p className="font-semibold text-slate-800">{plan.premium}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                  <li key={`${plan.id || plan.name || "plan"}-feature-${index}`} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-sky-700" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setInqPlan(plan);
                  setInqOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
              >
                Get Quote
                <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <PublicInquiryModal
        open={inqOpen}
        onClose={() => {
          setInqOpen(false);
          setInqPlan(null);
        }}
        title={inqPlan ? `Quote — ${inqPlan.name}` : "Insurance quote"}
        source="insurance"
        context={inquiryContext}
      />
    </div>
  );
}
