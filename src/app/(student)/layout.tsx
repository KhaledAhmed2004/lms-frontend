"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import { useMySubscription } from "@/hooks/api/use-subscription";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();
  const { data: subscription, isLoading } = useMySubscription();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Student must have an active subscription to access regular dashboard
      // If no active subscription, redirect to free trial dashboard
      if (!subscription || subscription.status !== 'ACTIVE') {
        router.replace("/free-trial-student-dash");
      } else {
        setIsChecking(false);
      }
    }
  }, [subscription, isLoading, router]);

  // Show loading while checking trial status
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B31BD] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNavbar />

      {/* Sidebar */}
      <div className="fixed top-24 left-0 bottom-0 w-[328px] z-30 hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="pt-24 lg:pl-[328px] min-h-screen bg-[#F8F8F8]">
        <div className="mx-auto px-4 py-5">{children}</div>
      </main>
    </div>
  );
}
