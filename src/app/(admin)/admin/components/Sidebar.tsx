// src/components/dashboard/Sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Student", href: "/admin/student" },
  { label: "Tutor", href: "/admin/tutor" },
  { label: "Session", href: "/admin/session" },
  { label: "Application",  href: "/admin/application" },
  { label: "Subject",  href: "/admin/subject" },
  { label: "Grade",  href: "/admin/grade" },
  { label: "School Type",  href: "/admin/school-type" },
  { label: "Transaction",  href: "/admin/transaction" },
  { label: "Meeting List",  href: "/admin/meeting-list" },
  { label: "Available Slot",  href: "/admin/available-slot" },
  { label: "Legal Policies",  href: "/admin/terms-conditions" },
  { label: "Support",  href: "/admin/support" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[328px] h-full bg-white flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {/* Centered Menu Items (248px width) */}
      <nav className="flex-1 flex flex-col items-center py-5 space-y-4">
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

    </aside>
  );
}

export default Sidebar;