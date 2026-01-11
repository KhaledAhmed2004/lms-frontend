"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/api/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const MobileMenu = ({ isOpen, closeMenu }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

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

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="py-6 space-y-4 border-t border-gray-200">
        {!mounted ? (
          // Loading skeleton while hydrating
          <div className="px-4 py-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : isAuthenticated && user ? (
          <>
            {/* Logged in - Show user info and Dashboard link */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-[#0B31BD] text-white flex items-center justify-center font-semibold">
                {user.name?.charAt(0)?.toUpperCase() ||
                  user.email?.charAt(0)?.toUpperCase() ||
                  "?"}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {user.name || user.email}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {user.role?.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>

            <Link
              href={getDashboardLink()}
              onClick={closeMenu}
              className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-[#0B31BD] hover:bg-blue-50 rounded-lg transition mx-2"
            >
              Dashboard
            </Link>

            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              disabled={isLoggingOut}
              className="block w-full text-left px-4 py-3 text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition mx-2"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            {/* Not logged in - Show Become Tutor and Login */}
            <Link
              href="/free-trial-teacher"
              onClick={closeMenu}
              className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-[#0B31BD] hover:bg-blue-50 rounded-lg transition mx-2"
            >
              Become Tutor
            </Link>

            <div className="px-4 pt-2">
              <Link href="/login">
                <Button
                  onClick={closeMenu}
                  className="w-full bg-[#0B31BD] hover:bg-[#092A9E] text-white font-semibold text-lg py-6 rounded-xl shadow-lg"
                >
                  Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;