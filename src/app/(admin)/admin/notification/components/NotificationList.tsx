import { AlertCircle, MessageSquare, Star, User } from "lucide-react";

export type NotificationItem = {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type NotificationListProps = {
  notifications: NotificationItem[];
  onMarkAsRead: (id: number) => void;
};

const getIconColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-blue-100 text-blue-600";
    case "error":
      return "bg-red-100 text-red-600";
    case "suggestion":
      return "bg-yellow-100 text-yellow-600";
    case "review":
      return "bg-green-100 text-green-600";
    case "request":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return User;
    case "error":
      return AlertCircle;
    case "suggestion":
      return MessageSquare;
    case "review":
      return Star;
    case "request":
      return MessageSquare;
    default:
      return User;
  }
};

export default function NotificationList({
  notifications,
  onMarkAsRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No notifications</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-sm space-y-0">
      {notifications.map((notification, index) => {
        const IconComponent = getIcon(notification.type);
        const iconColorClass = getIconColor(notification.type);

        return (
          <div
            key={notification.id}
            onClick={() => onMarkAsRead(notification.id)}
            className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
              notification.read
                ? "bg-white hover:bg-gray-50"
                : "bg-blue-50 hover:bg-blue-100"
            } ${index !== notifications.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className={`shrink-0 p-2.5 rounded-lg ${iconColorClass}`}>
              <IconComponent className="w-5 h-5" />
            </div>
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
      })}
    </div>
  );
}
