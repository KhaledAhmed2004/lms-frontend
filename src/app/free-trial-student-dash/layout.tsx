// src/app/free-trial-student-dash/layout.tsx
import type { ReactNode } from "react";
import Nav from "./components/Nav";

export default function FreeTrialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Nav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
