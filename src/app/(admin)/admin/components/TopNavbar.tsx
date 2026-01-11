// src/components/dashboard/TopNavbar.tsx
'use client';

import { Bell, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MobileMenuAdmin from "@/components/dashboard/MobileMenuAdmin";
import { useLogout } from "@/hooks/api";
import { useAuthStore } from "@/store/auth-store";

export default function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { user } = useAuthStore();

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

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New Session Request",
      message: "Sarah Johnson requested a math tutoring session",
      time: "5 min ago",
      unread: true
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of $50 received from John Smith",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "Session Completed",
      message: "Physics session with Mike Davis has been completed",
      time: "2 hours ago",
      unread: false
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from Emma Wilson",
      time: "Yesterday",
      unread: false
    }
  ];

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
            Schäfer Tutoring
          </h2>
        </div>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Dropdown */}
          <div ref={notificationMenuRef} className="relative">
            <button 
              onClick={() => setNotificationMenuOpen(prev => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notification Dropdown Menu */}
            {notificationMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[480px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <Link 
                    href="/admin/notification"
                    className="text-sm text-[#0B31BD] hover:underline"
                    onClick={() => setNotificationMenuOpen(false)}
                  >
                    View All
                  </Link>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-[#0B31BD] hover:underline font-medium">
                      Mark all as read
                    </button>
                  </div>
                )}
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
              <h3 className="font-semibold leading-tight">{user?.name || "Admin"}</h3>
              <p className="text-sm text-gray-500">Admin</p>
            </div>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg"
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                  disabled={isLoggingOut}
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
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