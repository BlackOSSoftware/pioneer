"use client";
import { Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingButtons() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/card/")) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-center gap-2.5 sm:bottom-6 sm:right-6 sm:gap-4">
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-green-500 p-2.5 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 sm:p-4"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6" />
      </a>

      <a
        href="tel:+919876543210"
        className="rounded-full bg-blue-500 p-2.5 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-600 sm:p-4"
        aria-label="Call us"
      >
        <Phone className="h-4 w-4 sm:h-6 sm:w-6" />
      </a>
    </div>
  );
}
