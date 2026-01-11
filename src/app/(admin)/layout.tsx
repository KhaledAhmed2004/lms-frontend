"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TopNavbar from "./admin/components/TopNavbar";
import Sidebar from "./admin/components/Sidebar";


interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const isMessagesPage = pathname?.startsWith("/admin/messages");

  return (
    <div className="min-h-screen h-screen flex flex-col">
      <TopNavbar />

      {/* Sidebar */}
      <div className="fixed top-24 left-0 bottom-0 w-[328px] z-30 hidden lg:block bg-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="pt-24 lg:ml-[328px] flex-1 bg-[#F8F8F8] flex flex-col">
        <div className={isMessagesPage ? "h-full" : "w-full px-4 py-5"}>{children}</div>
      </main>
    </div>
  );
}
