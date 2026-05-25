"use client";

import Image from "next/image";
import * as Lucide from "lucide-react";

function IconByName({ name, size = 22 }) {
  const Cmp = Lucide[name] || Lucide.Circle;
  return <Cmp size={size} />;
}

export default function AboutView({ about }) {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 to-blue-900 px-6 py-14 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{about.heroTag}</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{about.heroTitle}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-sky-100 sm:text-base">{about.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{about.missionTitle}</h2>
          {(about.missionParas || []).map((p, i) => (
            <p key={i} className="mt-4 text-base leading-7 text-slate-600">
              {p}
            </p>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
          <Image
            src={about.missionImage || "/neww.jpg"}
            alt="Pioneer Wealth team collaboration"
            width={1200}
            height={800}
            className="h-[360px] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">{about.valuesHeading || "Our core values"}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(about.values || []).map((item) => (
            <article key={item.id || item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <IconByName name={item.icon} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">{about.teamHeading || "Meet the team"}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(about.team || []).map((member) => (
            <article key={member.id || member.name} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <Image
                src={member.image}
                alt={member.name}
                width={180}
                height={180}
                className="mx-auto h-24 w-24 rounded-full border-4 border-sky-100 object-cover"
              />
              <h3 className="mt-4 text-base font-semibold text-slate-900">{member.name}</h3>
              <p className="text-sm text-slate-500">{member.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
