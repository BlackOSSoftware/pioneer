"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import * as Lucide from "lucide-react";
import PublicInquiryModal from "@/components/public/PublicInquiryModal";

function ServiceIcon({ name }) {
  const Cmp = Lucide[name] || Lucide.Circle;
  return <Cmp size={22} />;
}

export default function ServicesView({ services }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [inqOpen, setInqOpen] = useState(false);
  const [inqItem, setInqItem] = useState(null);
  const categories = services.categories || ["All"];
  const items = services.items || [];

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((service) => service.category === activeCategory);
  }, [activeCategory, items]);

  const inquiryContext = inqItem
    ? {
        serviceId: inqItem.id,
        headline: `Service: ${inqItem.title}`,
        lines: [
          `Title: ${inqItem.title}`,
          `Category: ${inqItem.category || "—"}`,
          `Icon: ${inqItem.icon || "—"}`,
          `Description: ${inqItem.description || "—"}`,
        ],
      }
    : {};

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 to-blue-900 px-6 py-14 text-center text-white shadow-xl sm:px-10">
          <h1 className="text-3xl font-bold sm:text-5xl">{services.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-sky-100 sm:text-base">{services.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-sky-700 bg-sky-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <article key={service.id || service.title} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {service.imageUrl ? (
                <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl">
                  <Image src={service.imageUrl} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
              ) : (
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <ServiceIcon name={service.icon} />
                </div>
              )}
              <h2 className="text-lg font-semibold text-slate-900">{service.title}</h2>
              <p className="mt-2 flex-grow text-sm leading-6 text-slate-600">{service.description}</p>
              <button
                type="button"
                onClick={() => {
                  setInqItem(service);
                  setInqOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
              >
                Enquire Now
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <PublicInquiryModal
        open={inqOpen}
        onClose={() => {
          setInqOpen(false);
          setInqItem(null);
        }}
        title={inqItem ? `Enquiry — ${inqItem.title}` : "Service enquiry"}
        source="service"
        context={inquiryContext}
      />
    </div>
  );
}
