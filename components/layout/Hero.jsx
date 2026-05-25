"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  GraduationCap,
  HeartPulse,
  Home,
  ShieldCheck,
  Star,
  Target,
} from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/bg/bg1.jpg",
    eyebrow: "Trusted Since 2009",
    title: "Strategic Wealth Planning For Long-Term Growth",
    description:
      "Comprehensive investment and risk-planning strategies tailored to your family goals and life milestones.",
    ctaText: "Explore Wealth Planning",
    ctaHref: "/Goal_Planners/Wealth-Creation",
  },
  {
    image: "/bg/bg2.jpg",
    eyebrow: "Goal-Based Advisory",
    title: "Build The Home You Envision, Without Financial Stress",
    description:
      "Plan your down payment, debt strategy, and growth portfolio with a disciplined framework.",
    ctaText: "Start Dream Home Plan",
    ctaHref: "/Goal_Planners/Dream-home",
  },
  {
    image: "/bg/bg4.jpg",
    eyebrow: "Future-Ready Family Planning",
    title: "Secure Your Child's Education With Smart Investing",
    description:
      "Create inflation-aware funding plans with SIP and diversified allocation designed for education milestones.",
    ctaText: "Plan Child Education",
    ctaHref: "/Goal_Planners/Child-Education",
  },
];

const HIGHLIGHTS = [
  { value: "5000+", label: "Families Advised" },
  { value: "15+", label: "Years Experience" },
  { value: "INR 500Cr+", label: "Assets Guided" },
];

const SERVICES = [
  {
    icon: BarChart3,
    title: "Mutual Fund Advisory",
    description: "Portfolio design and rebalancing aligned to your risk profile and goals.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Planning",
    description: "Right cover mix across term, health, and critical risk protection.",
  },
  {
    icon: Target,
    title: "Goal Planning",
    description: "Dedicated strategies for retirement, home, education, and legacy goals.",
  },
  {
    icon: HeartPulse,
    title: "Family Security",
    description: "Long-term protection framework for financial continuity in every life stage.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    text: "Clear strategy, disciplined execution, and transparent advice. My portfolio is finally structured.",
  },
  {
    name: "Priya Sharma",
    role: "IT Professional",
    text: "They simplified insurance and investment decisions and gave me an actionable roadmap.",
  },
  {
    name: "Amit Patel",
    role: "Entrepreneur",
    text: "Professional and data-driven. Their tax and allocation guidance improved my yearly outcomes.",
  },
];

function ServiceCard({ icon: Icon, title, description }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-amber-400">
        {[...Array(5)].map((_, idx) => (
          <Star key={idx} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="text-sm leading-6 text-slate-600">&quot;{text}&quot;</p>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>
    </article>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const active = HERO_SLIDES[index];

  return (
    <div className="overflow-x-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_30%,#f8fafc_100%)]">
      <section className="relative isolate min-h-[100dvh] overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 min-h-[100dvh]">
          {HERO_SLIDES.map((slide, i) => (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={i === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.76)_44%,rgba(2,6,23,0.55)_72%,rgba(2,6,23,0.25)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center gap-10 px-3 py-20 min-[380px]:px-4 sm:px-6 sm:py-24 lg:grid lg:min-h-[100dvh] lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:py-0">
          <div className="max-w-xl text-white lg:col-span-7">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide backdrop-blur min-[380px]:px-4 min-[380px]:text-xs">
              <BadgeCheck size={14} />
              <span className="truncate">{active.eyebrow}</span>
            </p>
            <h1 className="mt-4 break-words text-2xl font-bold leading-tight min-[380px]:text-3xl sm:mt-5 sm:text-5xl">{active.title}</h1>
            <p className="mt-4 text-sm leading-6 text-slate-200 min-[380px]:text-base min-[380px]:leading-7">{active.description}</p>

            <div className="mt-7 flex flex-col items-stretch gap-3 min-[380px]:mt-8 min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:items-center">
              <Link
                href={active.ctaHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400 min-[380px]:w-auto"
              >
                {active.ctaText}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 min-[380px]:w-auto"
              >
                Book Consultation
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {HERO_SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setIndex(dotIdx)}
                  className={`h-2.5 rounded-full transition-all ${dotIdx === index ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[480px]:grid sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:justify-self-end lg:max-w-sm">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-md">
                <p className="text-2xl font-bold sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-slate-200 sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">About Pioneer Wealth</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Financial clarity with disciplined execution</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We combine advisory discipline, data-backed planning, and clear communication to help you make confident
              long-term financial decisions.
            </p>
            <div className="mt-6 space-y-3">
              <p className="flex items-center gap-2 text-sm text-slate-700"><Target size={16} className="text-sky-700" /> Goal-based investment roadmaps</p>
              <p className="flex items-center gap-2 text-sm text-slate-700"><GraduationCap size={16} className="text-sky-700" /> Family-focused education and retirement planning</p>
              <p className="flex items-center gap-2 text-sm text-slate-700"><Home size={16} className="text-sky-700" /> Milestone planning for home and legacy goals</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            <Image src="/team1.jpg" alt="Pioneer Wealth advisory team" width={1000} height={700} className="h-[360px] w-full rounded-2xl object-cover" />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Advisory Excellence</p>
              <p className="text-sm font-semibold text-slate-900">Trusted by families and business owners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Core Services</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Professional financial solutions</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((item) => (
              <ServiceCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Client Feedback</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">What clients value most</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
