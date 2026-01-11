"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/api/use-auth";
import { Spinner } from "@/components/ui/spinner";

const Nav = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav className="bg-[#FBFCFC] border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link
            href="/free-trial-student-dash"
            className="text-2xl sm:text-3xl font-bold text-[#0B31BD] tracking-tight hover:opacity-90 transition"
          >
            Schäfer Tutoring
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF8A00] hover:bg-[#ee8607] text-white text-lg font-semibold rounded-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Spinner />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;