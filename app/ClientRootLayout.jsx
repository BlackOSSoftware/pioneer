"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientRootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicCardRoute = pathname.startsWith("/card/");
  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");
  const hideSiteChrome = isAdminRoute || isPublicCardRoute || isLoginRoute;

  return (
    <>
      {!hideSiteChrome && <Navbar />}
      <main
        className={
          hideSiteChrome
            ? "flex-grow min-w-0"
            : // Top strip h-7 (1.75rem) + nav h-14 / sm:h-16
              "flex-grow min-w-0 pt-[5.25rem] sm:pt-[5.75rem]"
        }
      >
        {children}
      </main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}
