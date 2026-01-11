"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TeacherDash = dynamic(
  () => import("./components/Page1"), // Uses Page1.tsx (TSX version)
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
      <TeacherDash />
    </Suspense>
  );
}
