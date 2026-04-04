// src/components/dashboard/Sidebar.tsx
"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const menuItems = [
  { key: "overview", href: "/admin/overview" },
  { key: "student", href: "/admin/student" },
  { key: "tutor", href: "/admin/tutor" },
  { key: "session", href: "/admin/session" },
  { key: "application", href: "/admin/application" },
  { key: "subject", href: "/admin/subject" },
  { key: "grade", href: "/admin/grade" },
  { key: "schoolType", href: "/admin/school-type" },
  { key: "pricing", href: "/admin/pricing" },
  { key: "transaction", href: "/admin/transaction" },
  { key: "forfeitedPayments", href: "/admin/forfeit" },
  { key: "meetingList", href: "/admin/meeting-list" },
  { key: "availableSlot", href: "/admin/available-slot" },
  { key: "allPosts", href: "/admin/posts" },
  { key: "legalPolicies", href: "/admin/terms-conditions" },
  { key: "support", href: "/admin/support" },
  { key: "faq", href: "/admin/faq" },
  { key: "export", href: "/admin/export" },
];

function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <aside className="w-[328px] h-full bg-white flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Centered Menu Items (248px width) */}
      <nav className="flex-1 flex flex-col items-center py-5 space-y-4">
        {menuItems.map((item) => {
          const isActive = pathname.includes(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full max-w-60 sm:max-w-[220px] md:max-w-[200px] lg:w-64 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#002AC8] text-white shadow-xl"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
