"use client";

import { useState } from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationList, { NotificationItem } from "./NotificationList";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "success",
      message:
        'User "john@example.com" has successfully upgraded from Free to Pro.',
      timestamp: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "error",
      message:
        'User "sadia.user42@gmail.com" attempted to upgrade to Pro but encountered an issue',
      timestamp: "10 mins ago",
      read: false,
    },
    {
      id: 3,
      type: "suggestion",
      message:
        'User "rahim.khan12" submitted a new suggestion: "Please add a savings goal tracker."',
      timestamp: "30 min ago",
      read: false,
    },
    {
      id: 4,
      type: "review",
      message:
        'User "tasnia_98" left a 5-star review on the Play Store: "Very useful app. Helped me track my expenses easily!"',
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 5,
      type: "request",
      message: 'User "robin_dev23" has submitted a request to review the app.',
      timestamp: "Yesterday",
      read: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <NotificationHeader onMarkAllAsRead={handleMarkAllAsRead} />
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
        />

        {/* Empty State Info */}
        {notifications.every((n) => n.read) && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              You&apos;re all caught up! No new notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
