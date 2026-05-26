"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientRootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicCardRoute = pathname.startsWith("/card/");
  const hideSiteChrome = isAdminRoute || isPublicCardRoute;

  return (
    <>
      {!hideSiteChrome && <Navbar />}
      <main className={hideSiteChrome ? "flex-grow" : "flex-grow pt-16 sm:pt-[70px]"}>{children}</main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}
