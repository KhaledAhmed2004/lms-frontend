import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

type SessionStatsProps = {
  totalSessions: string;
  pendingSessions: string;
  completedSessions: string;
};

export default function SessionStats({
  totalSessions,
  pendingSessions,
  completedSessions,
}: SessionStatsProps) {
  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      icon: Clock,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Pending Sessions",
      value: pendingSessions,
      icon: AlertCircle,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      label: "Completed Sessions",
      value: completedSessions,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <AdminStatsCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconBgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
