import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-sky-50 to-white text-slate-700">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/newlogo.png"
              alt="Pioneer Wealth Solutions Logo"
              width={130}
              height={38}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Your trusted partner in wealth creation with expert financial advice and tailored investment solutions.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700"
                aria-label="social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="transition-colors hover:text-sky-700">Home</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-sky-700">About Us</Link></li>
            <li><Link href="/Services" className="transition-colors hover:text-sky-700">Services</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-sky-700">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Our Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/Product" className="transition-colors hover:text-sky-700">Mutual Funds</Link></li>
            <li><Link href="/Insurance" className="transition-colors hover:text-sky-700">Life Insurance</Link></li>
            <li><Link href="/Insurance" className="transition-colors hover:text-sky-700">Health Insurance</Link></li>
            <li><Link href="/financial-planning" className="transition-colors hover:text-sky-700">Tax Planning</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Get In Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-sky-700" />
              <span>123 Financial District, Mumbai, India</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-sky-700" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 text-sky-700" />
              <span>info@pioneerws.in</span>
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-800">Subscribe to Newsletter</p>
            <form className="mt-2 flex flex-col gap-2 min-[380px]:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                className="h-10 rounded-lg bg-sky-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-sm">
          <p>(c) 2026 Pioneer Wealth Solutions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-sky-700">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-sky-700">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
