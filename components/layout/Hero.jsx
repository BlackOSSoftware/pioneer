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
      {/* First viewport banner — fits under navbar without scroll on 320px+ */}
      <section className="relative isolate flex h-[calc(100dvh-3.5rem)] max-h-[900px] min-h-[420px] overflow-hidden border-b border-slate-200 sm:h-[calc(100dvh-70px)]">
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.9)_0%,rgba(2,6,23,0.78)_42%,rgba(2,6,23,0.5)_70%,rgba(2,6,23,0.28)_100%)]" />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-4 px-3 py-4 min-[380px]:px-4 min-[380px]:py-6 sm:gap-6 sm:px-6 sm:py-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:py-10">
          <div className="max-w-xl text-white lg:col-span-7">
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur min-[380px]:gap-2 min-[380px]:px-3.5 min-[380px]:text-xs">
              <BadgeCheck size={12} className="shrink-0 min-[380px]:size-[14px]" />
              <span className="truncate">Pioneer Wealth Solutions · {active.eyebrow}</span>
            </p>
            {/* One stable H1 for SEO; slide copy uses H2 */}
            <h1 className="mt-2.5 break-words text-[1.2rem] font-bold leading-snug text-white min-[380px]:mt-3 min-[380px]:text-2xl sm:mt-4 sm:text-3xl lg:text-4xl lg:leading-tight">
              Pioneer Wealth Solutions — Financial Advisor and Wealth Management in India
            </h1>
            <h2 className="mt-2 line-clamp-3 break-words text-[1.05rem] font-semibold leading-snug text-amber-200 min-[380px]:text-xl sm:mt-3 sm:line-clamp-none sm:text-2xl lg:text-3xl">
              {active.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-200 min-[380px]:mt-3 min-[380px]:line-clamp-3 min-[380px]:text-sm min-[380px]:leading-6 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-7">
              {active.description}
            </p>

            <div className="mt-4 flex flex-col items-stretch gap-2 min-[380px]:mt-5 min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:items-center min-[380px]:gap-3 sm:mt-6">
              <Link
                href={active.ctaHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-400 min-[380px]:w-auto min-[380px]:px-5 min-[380px]:py-3 min-[380px]:text-sm"
              >
                <span className="truncate">{active.ctaText}</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 min-[380px]:w-auto min-[380px]:px-5 min-[380px]:py-3 min-[380px]:text-sm"
              >
                Book Consultation
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-1.5 sm:mt-6 sm:gap-2">
              {HERO_SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all sm:h-2.5 ${dotIdx === index ? "w-6 bg-white sm:w-8" : "w-2 bg-white/45 sm:w-2.5"}`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 min-[380px]:gap-2 sm:gap-3 lg:col-span-5 lg:grid-cols-1 lg:justify-self-end lg:max-w-sm lg:gap-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/25 bg-white/10 px-2 py-2.5 text-center text-white backdrop-blur-md min-[380px]:rounded-2xl min-[380px]:px-3 min-[380px]:py-3 sm:p-4 lg:p-5 lg:text-left"
              >
                <p className="text-sm font-bold min-[380px]:text-base sm:text-2xl lg:text-3xl">{item.value}</p>
                <p className="mt-0.5 text-[9px] font-medium leading-tight tracking-wide text-slate-200 min-[380px]:text-[10px] sm:mt-1 sm:text-xs lg:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 min-[380px]:px-4 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">About Pioneer Wealth</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              Why families choose Pioneer Wealth Solutions
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              PioneerWS combines advisory discipline, data-backed planning, and clear communication so you can invest
              with confidence — from SIPs and mutual funds to insurance and retirement goals.
            </p>
            <div className="mt-5 space-y-3 sm:mt-6">
              <p className="flex items-center gap-2 text-sm text-slate-700"><Target size={16} className="shrink-0 text-sky-700" /> Goal-based investment roadmaps</p>
              <p className="flex items-center gap-2 text-sm text-slate-700"><GraduationCap size={16} className="shrink-0 text-sky-700" /> Family-focused education and retirement planning</p>
              <p className="flex items-center gap-2 text-sm text-slate-700"><Home size={16} className="shrink-0 text-sky-700" /> Milestone planning for home and legacy goals</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/about" className="text-sky-700 hover:underline">About PioneerWS</Link>
              <Link href="/Calculators/sip-return" className="text-sky-700 hover:underline">SIP Calculator</Link>
              <Link href="/Goal_Planners/Dream-home" className="text-sky-700 hover:underline">Dream Home Planner</Link>
              <Link href="/Services" className="text-sky-700 hover:underline">Our Services</Link>
              <Link href="/contact" className="text-sky-700 hover:underline">Contact</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl sm:rounded-3xl sm:p-2">
            <Image src="/team1.jpg" alt="Pioneer Wealth Solutions advisory team helping clients with financial planning in India" width={1000} height={700} className="h-[220px] w-full rounded-xl object-cover min-[380px]:h-[280px] sm:h-[360px] sm:rounded-2xl" />
            <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 shadow-lg backdrop-blur sm:bottom-5 sm:left-5 sm:px-4 sm:py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700 sm:text-xs">Advisory Excellence</p>
              <p className="text-xs font-semibold text-slate-900 sm:text-sm">Trusted by families and business owners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-3 py-10 min-[380px]:px-4 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Core Services</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">Professional financial solutions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {SERVICES.map((item) => (
              <ServiceCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 min-[380px]:px-4 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Client Feedback</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">What clients value most</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
