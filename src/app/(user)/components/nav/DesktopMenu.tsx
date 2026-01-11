"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useAuthStore } from "@/store/auth-store";

const DesktopMenu = () => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  // Prevent hydration mismatch - wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Role-based dashboard redirect
  const getDashboardLink = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return "/admin/overview";
      case "TUTOR":
        return "/teacher/overview";
      case "STUDENT":
        return "/student/session";
      case "APPLICANT":
        return "/free-trial-teacher-dash";
      default:
        return "/";
    }
  };

  // Show nothing until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="hidden md:flex items-center gap-8 lg:gap-14">
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  // Logged in user - show Dashboard + Avatar
  if (isAuthenticated && user) {
    return (
      <div className="hidden md:flex items-center gap-8 lg:gap-14">
        <Link
          href={getDashboardLink()}
          className="text-[#0B31BD] text-lg font-medium hover:text-[#092A9E] transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href={getDashboardLink()}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#0B31BD] text-white flex items-center justify-center font-semibold text-lg">
            {user.name?.charAt(0)?.toUpperCase() ||
              user.email?.charAt(0)?.toUpperCase() ||
              "?"}
          </div>
        </Link>
      </div>
    );
  }

  // Not logged in - show Become Tutor + Login
  return (
    <div className="hidden md:flex items-center gap-8 lg:gap-14">
      <Link
        href="/free-trial-teacher"
        className="text-[#0B31BD] text-lg font-medium hover:text-[#092A9E] transition-colors"
      >
        Become Tutor
      </Link>
      <PrimaryButton name={"Login"} href={"/login"} />
    </div>
  );
};

export default DesktopMenu;