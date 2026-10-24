import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  ArrowUpRight,
} from "lucide-react";

const QUICK = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/Services", "Services"],
  ["/Product", "Products"],
  ["/Insurance", "Insurance"],
  ["/contact", "Contact"],
];

const TOOLS = [
  ["/Calculators/sip-return", "SIP Return"],
  ["/Calculators/emi", "EMI Calculator"],
  ["/Calculators/retirement", "Retirement"],
  ["/Goal_Planners/Dream-home", "Dream Home"],
  ["/Goal_Planners/Child-Education", "Child Education"],
  ["/Goal_Planners/Emergency", "Emergency Fund"],
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071a2e] text-slate-300">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 100% 0%, rgba(14,116,144,0.45), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(245,158,11,0.12), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-3 pb-8 pt-10 min-[360px]:px-4 sm:px-6 sm:pt-14 lg:px-8">
        {/* Top CTA band */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm min-[360px]:p-5 sm:mb-12 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300/90">
              Pioneer Wealth Solutions
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">
              Plan goals. Invest with clarity.
            </h2>
            <p className="mt-1 max-w-md text-sm text-sky-100/75">
              Calculators, goal planners, and advisory tools built for Indian families.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 min-[380px]:flex-row">
            <Link
              href="/Calculators/sip-return"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-[#071a2e] transition hover:bg-amber-300"
            >
              Try a calculator
              <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="min-[480px]:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex rounded-lg bg-white px-2.5 py-2">
              <Image
                src="/newlogo.png"
                alt="Pioneer Wealth Solutions logo"
                width={130}
                height={38}
                className="h-8 w-auto max-w-[130px] object-contain sm:h-9"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sky-100/70">
              Goal-based wealth advisory — mutual funds, insurance, and retirement planning with
              clear, practical guidance.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-sky-100 transition hover:border-amber-300/50 hover:bg-white/10 hover:text-amber-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sky-100/75 transition hover:text-amber-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Tools</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TOOLS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sky-100/75 transition hover:text-amber-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Get in touch</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-sky-100/75">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <span className="min-w-0 leading-relaxed break-words">
                  123 Financial District, Mumbai, India
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <a href="tel:+919876543210" className="break-all hover:text-amber-300">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-amber-300" />
                <a href="mailto:info@pioneerws.in" className="break-all hover:text-amber-300">
                  info@pioneerws.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-3 py-4 text-[11px] text-sky-100/55 min-[360px]:px-4 sm:flex-row sm:items-center sm:px-6 sm:text-xs lg:px-8">
          <p className="leading-relaxed">© 2026 Pioneer Wealth Solutions. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="#" className="hover:text-amber-300">
              Privacy
            </Link>
            <Link href="#" className="hover:text-amber-300">
              Terms
            </Link>
            <span className="text-sky-100/35">Illustrative tools only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
