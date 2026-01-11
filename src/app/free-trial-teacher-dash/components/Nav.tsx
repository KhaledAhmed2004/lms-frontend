"use client";

import Link from "next/link";
import Image from "next/image";
import { useLogout } from "@/hooks/api/use-auth";

const Nav = () => {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-[#FBFCFC] border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/free-trial-teacher-dash"
              className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#0B31BD] tracking-tight hover:opacity-90 transition"
            >
              Schäfer Tutoring
            </Link>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF8A00] hover:bg-[#ee8607] text-white text-lg font-semibold rounded-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Image
                width={20}
                height={20}
                src="/logout.svg"
                alt="Logout"
                className="w-5 h-5"
              />
            )}
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
