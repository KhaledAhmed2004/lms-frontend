'use client';

import React, { useState } from 'react';
import { User, AlertCircle, MessageSquare, Star } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      icon: User,
      message: 'User "john@example.com" has successfully upgraded from Free to Pro.',
      timestamp: '2 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'error',
      icon: AlertCircle,
      message: 'User "sadia.user42@gmail.com" attempted to upgrade to Pro but encountered an issue',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 3,
      type: 'suggestion',
      icon: MessageSquare,
      message: 'User "rahim.khan12" submitted a new suggestion: "Please add a savings goal tracker."',
      timestamp: '30 min ago',
      read: false,
    },
    {
      id: 4,
      type: 'review',
      icon: Star,
      message: 'User "tasnia_98" left a 5-star review on the Play Store: "Very useful app. Helped me track my expenses easily!"',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 5,
      type: 'request',
      icon: MessageSquare,
      message: 'User "robin_dev23" has submitted a request to review the app.',
      timestamp: 'Yesterday',
      read: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-blue-100 text-blue-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'suggestion':
        return 'bg-yellow-100 text-yellow-600';
      case 'review':
        return 'bg-green-100 text-green-600';
      case 'request':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return User;
      case 'error':
        return AlertCircle;
      case 'suggestion':
        return MessageSquare;
      case 'review':
        return Star;
      case 'request':
        return MessageSquare;
      default:
        return User;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications Container */}
        <div className=" rounded-lg shadow-sm space-y-0">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const IconComponent = getIcon(notification.type);
              const iconColorClass = getIconColor(notification.type);

              return (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                    notification.read
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-blue-50 hover:bg-blue-100'
                  } ${index !== notifications.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 p-2.5 rounded-lg ${iconColorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>

        {/* Empty State Info */}
        {notifications.every(n => n.read) && (
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