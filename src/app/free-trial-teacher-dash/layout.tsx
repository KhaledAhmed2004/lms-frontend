// src/app/free-trial-teacher-dash/layout.tsx
import type { ReactNode } from "react";
import Nav from "./components/Nav";

export default function FreeTrialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Nav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
