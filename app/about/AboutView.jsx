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
      <section className="mx-auto max-w-7xl px-3 pb-6 pt-6 min-[380px]:px-4 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-700 to-blue-900 px-4 py-10 text-white shadow-xl min-[380px]:rounded-3xl min-[380px]:px-6 sm:px-10 sm:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200 sm:text-xs">{about.heroTag}</p>
          <h1 className="mt-2 text-2xl font-bold leading-snug min-[380px]:mt-3 min-[380px]:text-3xl sm:text-5xl">{about.heroTitle}</h1>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-sky-100 min-[380px]:text-sm min-[380px]:leading-6 sm:mt-4 sm:text-base sm:leading-7">{about.heroSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-3 py-8 min-[380px]:px-4 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 min-[380px]:text-2xl sm:text-3xl">{about.missionTitle}</h2>
          {(about.missionParas || []).map((p, i) => (
            <p key={i} className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              {p}
            </p>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg sm:rounded-3xl sm:p-2">
          <Image
            src={about.missionImage || "/neww.jpg"}
            alt="Pioneer Wealth team collaboration"
            width={1200}
            height={800}
            className="h-[220px] w-full rounded-xl object-cover min-[380px]:h-[280px] sm:h-[360px] sm:rounded-2xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          {about.missionVisionHeading || "Our mission and vision"}
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <IconByName name="Target" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{about.ourMissionTitle || "Our Mission"}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{about.ourMissionText}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <IconByName name="Eye" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{about.ourVisionTitle || "Our Vision"}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{about.ourVisionText}</p>
          </article>
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
