"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChartNoAxesCombined, Filter } from "lucide-react";
import PublicInquiryModal from "@/components/public/PublicInquiryModal";

export default function ProductView({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fundHouseFilter, setFundHouseFilter] = useState("All");
  const [openFaq, setOpenFaq] = useState(null);
  const [inqOpen, setInqOpen] = useState(false);
  const [inqFund, setInqFund] = useState(null);

  const funds = products.funds || [];
  const faqs = products.faqs || [];
  const filterCategories = products.filterCategories || ["All"];
  const filterHouses = products.filterHouses || ["All"];

  const filteredFunds = useMemo(() => {
    return funds.filter((fund) => {
      const matchesSearch = (fund.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || fund.category === categoryFilter;
      const matchesHouse = fundHouseFilter === "All" || fund.house === fundHouseFilter;
      return matchesSearch && matchesCategory && matchesHouse;
    });
  }, [funds, searchTerm, categoryFilter, fundHouseFilter]);

  const openInvest = (fund) => {
    setInqFund(fund);
    setInqOpen(true);
  };

  const inquiryContext = inqFund
    ? {
        fundId: inqFund.id,
        fundName: inqFund.name,
        house: inqFund.house,
        category: inqFund.category,
        returns: inqFund.returns,
        risk: inqFund.risk,
        headline: `Mutual fund: ${inqFund.name}`,
        lines: [
          `Fund / scheme: ${inqFund.name}`,
          `AMC / house: ${inqFund.house || "—"}`,
          `Category: ${inqFund.category || "—"}`,
          `1Y return: ${inqFund.returns || "—"}`,
          `Risk: ${inqFund.risk || "—"}`,
        ],
      }
    : {};

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 to-blue-900 px-6 py-14 text-center text-white shadow-xl sm:px-10">
          <h1 className="text-3xl font-bold sm:text-5xl">{products.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-sky-100 sm:text-base">{products.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <Filter size={16} />
            <p className="text-sm font-semibold">{products.fundsSectionEyebrow || "Search and filter"}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search fund name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {filterCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={fundHouseFilter}
              onChange={(e) => setFundHouseFilter(e.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {filterHouses.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredFunds.map((fund) => (
            <article key={fund.id || fund.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  {fund.imageUrl ? (
                    <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                      <Image src={fund.imageUrl} alt="" fill className="object-cover" sizes="44px" />
                    </div>
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700">
                      <ChartNoAxesCombined size={20} />
                    </div>
                  )}
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{fund.name}</h2>
                    <p className="text-sm text-slate-500">{fund.house}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm lg:min-w-[360px]">
                  <div>
                    <p className="text-slate-500">Category</p>
                    <p className="font-semibold text-slate-800">{fund.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">1Y Returns</p>
                    <p className="font-semibold text-emerald-600">{fund.returns}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Risk</p>
                    <p className="font-semibold text-slate-800">{fund.risk}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openInvest(fund)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
                >
                  Invest Now
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}

          {filteredFunds.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-600">
              No fund matched your selected filters.
            </p>
          ) : null}
        </div>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">{products.faqsHeading || "Mutual fund basics"}</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((faq) => {
              const faqKey = faq.id || faq.question;
              return (
              <div key={faqKey} className="rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === faqKey ? null : faqKey)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800"
                >
                  {faq.question}
                  <span>{openFaq === faqKey ? "-" : "+"}</span>
                </button>
                {openFaq === faqKey ? <p className="px-4 pb-4 text-sm leading-6 text-slate-600">{faq.answer}</p> : null}
              </div>
            );
            })}
          </div>
        </section>
      </section>

      <PublicInquiryModal
        open={inqOpen}
        onClose={() => {
          setInqOpen(false);
          setInqFund(null);
        }}
        title={inqFund ? `Invest — ${inqFund.name}` : "Invest"}
        source="product"
        context={inquiryContext}
      />
    </div>
  );
}
