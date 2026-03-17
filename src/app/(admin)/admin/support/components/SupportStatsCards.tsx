import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Loader2, Ticket } from "lucide-react";

type SupportStatsCardsProps = {
  statsLoading: boolean;
  stats?: {
    total?: number;
    open?: number;
    inProgress?: number;
    resolved?: number;
  };
};

const statsConfig = [
  {
    key: "total",
    label: "Total Tickets",
    icon: Ticket,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "open",
    label: "Open",
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Clock,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
] as const;

export default function SupportStatsCards({
  statsLoading,
  stats,
}: SupportStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        : statsConfig.map((stat) => (
            <Card
              key={stat.key}
              className="border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className={`${stat.bgColor} p-2 rounded-full w-fit mb-2`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.[stat.key] ?? 0}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
