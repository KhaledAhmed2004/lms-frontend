"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/footer/Footer";
import Navbar from "./components/nav/Navbar";

const NO_FOOTER_ROUTES = ["/about", "/contact", "/careers"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = !NO_FOOTER_ROUTES.includes(pathname);

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="pt-16 md:pt-20">{children}</main>
      {showFooter ? (
        <footer>
          <Footer />
        </footer>
      ) : null}
    </>
  );
}
