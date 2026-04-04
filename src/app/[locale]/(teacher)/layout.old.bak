// src/app/(teacher)/layout.tsx
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNavbar />

      <div className="fixed top-24 left-0 bottom-0 w-[328px] z-30 hidden lg:block">
        <Sidebar />
      </div>

      <main className="pt-24 lg:pl-[328px] min-h-screen bg-[#F8F8F8]">
        <div className="mx-auto px-4 py-5">{children}</div>
      </main>
    </div>
  );
}
