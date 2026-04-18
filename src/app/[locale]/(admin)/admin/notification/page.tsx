'use client';

import React from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  useAdminNotifications,
  useAdminMarkNotificationAsRead,
  useAdminMarkAllNotificationsAsRead,
} from '@/hooks/api';

export default function NotificationsPage() {
  const { data: notificationData, isLoading } = useAdminNotifications();
  const { mutate: markAsRead } = useAdminMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useAdminMarkAllNotificationsAsRead();

  const notifications = notificationData?.data ?? [];
  const unreadCount = notificationData?.unreadCount ?? 0;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B31BD]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                {unreadCount} unread
              </span>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <button
              onClick={() => markAllAsRead()}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        {/* Notifications Container */}
        <div className="rounded-lg shadow-sm space-y-0">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={notification._id}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification._id);
                  }
                }}
                className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                  !notification.isRead
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-white hover:bg-gray-50'
                } ${index !== notifications.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {/* Icon */}
                <div className="shrink-0 p-2.5 rounded-lg bg-blue-100 text-blue-600">
                  <Bell className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {notification.title ? (
                    <p className="font-semibold text-sm text-gray-900 mb-1">
                      {notification.title}
                    </p>
                  ) : null}
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {notification.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>

                {/* Unread indicator */}
                {!notification.isRead ? (
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>

        {/* All caught up */}
        {notifications.length > 0 && unreadCount === 0 ? (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              You&apos;re all caught up! No new notifications.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
