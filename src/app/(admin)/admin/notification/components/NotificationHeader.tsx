type NotificationHeaderProps = {
  onMarkAllAsRead: () => void;
};

export default function NotificationHeader({
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      <button
        onClick={onMarkAllAsRead}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        Mark all as read
      </button>
    </div>
  );
}
