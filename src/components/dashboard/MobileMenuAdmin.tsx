"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useLogout } from "@/hooks/api";

/* ================= TYPES ================= */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ================= MENU DATA ================= */

const menuItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Student", href: "/admin/student" },
  { label: "Tutor", href: "/admin/tutor" },
  { label: "Session", href: "/admin/session" },
  { label: "Application",  href: "/admin/application" },
  { label: "Transaction",  href: "/admin/transaction" },
  { label: "Meeting List",  href: "/admin/meeting-list" },
  { label: "Available Slot",  href: "/admin/available-slot" },
  { label: "Legal Policies",  href: "/admin/terms-conditions" },
  { label: "Support",  href: "/admin/support" },
];

/* ================= COMPONENT ================= */

export default function MobileMenuAdmin({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-72 sm:w-80 max-w-[85vw] bg-[#0B31BD] text-white z-50 flex flex-col lg:hidden">
        {/* Header */}
        <div className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b border-blue-900">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            Schäfer Tutoring
          </h1>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-[#0B31BD] font-semibold shadow-lg"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-base sm:text-lg">{item.label}</span>

                {isActive && (
                  <div className="ml-auto w-1 h-8 sm:h-10 bg-white rounded-l-full" />
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            disabled={isLoggingOut}
            className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 rounded-lg transition-all text-red-300 hover:bg-red-500/20 w-full mt-4"
          >
            <span className="text-base sm:text-lg">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </nav>
      </div>
    </>
  );
}