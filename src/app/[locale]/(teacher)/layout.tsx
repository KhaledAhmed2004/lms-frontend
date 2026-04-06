"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname?.includes("/teacher/messages");

  return (
    <div className={isMessagesPage ? "h-screen overflow-hidden" : "min-h-screen"}>
      <SiteHeader />

      {/* Sidebar */}
      <div className={`fixed top-16 sm:top-20 lg:top-24 left-0 bottom-0 w-[328px] z-30 hidden lg:block`}>
        <AppSidebar />
      </div>

      {/* Main Content */}
      <main
        className={`pt-16 sm:pt-20 lg:pt-24 lg:pl-[328px] bg-[#F8F8F8] ${isMessagesPage ? "h-full min-h-0 overflow-hidden" : "min-h-screen"}`}
      >
        <div className={isMessagesPage ? "h-full min-h-0 overflow-hidden" : "mx-auto px-4 py-5"}>
          {children}
        </div>
      </main>
    </div>
  );
}
