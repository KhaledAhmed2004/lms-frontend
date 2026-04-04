"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#FBFCFC] border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-[#0B31BD] tracking-tight hover:opacity-90 transition"
              onClick={closeMenu}
            >
              Schäfer Tutoring
            </Link>
          </div>

          {/* Desktop Menu */}
          <DesktopMenu />

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-[#0B31BD] hover:bg-blue-50 transition-colors"
              aria-label="Menu öffnen"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isOpen} closeMenu={closeMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
