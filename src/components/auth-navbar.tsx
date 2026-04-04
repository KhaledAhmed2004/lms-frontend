'use client';

import { Link } from '@/i18n/routing';
import { LanguageToggle } from './language-toggle';

export function AuthNavbar() {
  return (
    <nav className="bg-[#FBFCFC] h-20 shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex-1 flex justify-center translate-x-8">
          <Link href="/" className="text-3xl font-bold text-[#0B31BD] hover:opacity-90 transition">
            Schäfer Tutoring
          </Link>
        </div>
        <div className="flex items-center">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
