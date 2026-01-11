// src/components/dashboard/Sidebar.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Sessions", href: "/student/session" },
  { label: "Messages", href: "/student/messages" },
  { label: "Subscription", href: "/student/subscription" },
  { label: "Resources", href: "/student/resources" },
  { label: "Support", href: "/student/support" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 lg:w-[328px] h-full bg-white flex flex-col overflow-y-auto">

      {/* Centered Menu Items */}
      <nav className="flex-1 flex flex-col items-center py-3 sm:py-4 lg:py-5 space-y-2 sm:space-y-3 lg:space-y-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full max-w-[240px] sm:max-w-[220px] md:max-w-[200px] lg:w-64 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#002AC8] text-white shadow-xl"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 lg:p-6 flex flex-col items-center">
        
      </div>
    </aside>
  );
}

export default Sidebar;