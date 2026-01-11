"use client";

import Link from "next/link";
import Image from "next/image";

const Nav = () => {

  return (
    <nav className="bg-[#FBFCFC] border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/free-trial-student-dash" 
              className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#0B31BD] tracking-tight hover:opacity-90 transition"
            >
              Schäfer Tutoring
            </Link>
          </div>
          <button className="w-38 flex items-center justify-start gap-2 ps-4 py-2 bg-[#FF8A00] hover:bg-[#ee8607] text-white text-lg font-semibold rounded-xl active:scale-95 transition-all duration-200">
              {/* Logout Icon */}
                <Image 
                  width={20} 
                  height={20} 
                  src="/logout.svg" 
                  alt="Logout" 
                  className="w-6 h-6"
                />
              {/* Text */}
              <span>Logout</span>
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;