"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname?.startsWith("/teacher/messages");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col overflow-hidden">
        <SiteHeader />
        <div className="flex-1 overflow-y-auto">
          <div
            className={
              isMessagesPage
                ? "h-full"
                : "flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6 bg-[#F8F8F8] min-h-full"
            }
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
