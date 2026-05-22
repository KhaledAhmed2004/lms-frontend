// src/components/dashboard/TopNavbar.tsx
'use client';

import { Bell, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import MobileMenuAdmin from "@/components/dashboard/MobileMenuAdmin";
import { LanguageToggle } from "@/components/language-toggle";
import { useLogout, useAdminNotifications, useAdminMarkAllNotificationsAsRead } from "@/hooks/api";
import { useAuthStore } from "@/store/auth-store";
import { useTranslations } from "next-intl";

export default function TopNavbar() {
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { user } = useAuthStore();
  const { data: notificationData } = useAdminNotifications({ limit: 5 });
  const { mutate: markAllAsRead } = useAdminMarkAllNotificationsAsRead();

  const notifications = notificationData?.data ?? [];
  const unreadCount = notificationData?.unreadCount ?? 0;

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(e.target as Node)
      ) {
        setNotificationMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format relative time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return t("minAgo", { count: diffMin });
    if (diffHr < 24) return t("hoursAgo", { count: diffHr });
    if (diffDay < 7) return t("daysAgo", { count: diffDay });
    return date.toLocaleDateString();
  };

  return (
    <>
      <header className="h-20 md:h-24 bg-white fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-4 md:px-16">
        
        {/* Left: Hamburger (mobile) + Page Title */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-[#0B31BD] whitespace-nowrap">
            {t("title")}
          </h2>
        </div>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Dropdown */}
          <div ref={notificationMenuRef} className="relative flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setNotificationMenuOpen(prev => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
              {unreadCount > 0 ? (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              ) : null}
            </button>

            {/* Notification Dropdown Menu */}
            {notificationMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[480px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t("notifications")}</h3>
                  <Link 
                    href={"/admin/notification" as any}
                    className="text-sm text-[#0B31BD] hover:underline"
                    onClick={() => setNotificationMenuOpen(false)}
                  >
                    {t("viewAll")}
                  </Link>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notification.isRead ? (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          ) : null}
                          <div className="flex-1 min-w-0">
                            {notification.title ? (
                              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                            ) : null}
                            <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>{t("noNotifications")}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && unreadCount > 0 ? (
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-sm text-[#0B31BD] hover:underline font-medium"
                    >
                      {t("markAllRead")}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Avatar + Dropdown */}
          <div
            ref={userMenuRef}
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => setUserMenuOpen(prev => !prev)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#0B31BD]">
              <div className="w-full h-full bg-[#0B31BD] flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>

            {/* Hide text on mobile */}
            <div className="hidden sm:block">
              <h3 className="font-semibold leading-tight">{user?.name || t("admin")}</h3>
              <p className="text-sm text-gray-500">{t("admin")}</p>
            </div>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <Link
                  href={"/admin/profile" as any}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg"
                >
                  {t("profile")}
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                  disabled={isLoggingOut}
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                >
                  {isLoggingOut ? t("loggingOut") : t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenuAdmin
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}