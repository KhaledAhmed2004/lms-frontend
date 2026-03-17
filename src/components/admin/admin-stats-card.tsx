import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AdminStatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  iconBgColor?: string;
  iconColor?: string;
  growth?: number;
  growthType?: string;
  growthLabel?: string;
}

export function AdminStatsCard({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
  growth = 0,
  growthType = "no_change",
  growthLabel = "vs last month",
}: AdminStatsCardProps) {
  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`${iconBgColor} p-2 rounded-full w-fit mb-2`}>
              <Icon className={iconColor} size={24} />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {growth !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  growthType === "increase"
                    ? "text-green-600"
                    : growthType === "decrease"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {growthType === "increase" ? (
                  <ArrowUp className="w-4 h-4" />
                ) : growthType === "decrease" ? (
                  <ArrowDown className="w-4 h-4" />
                ) : null}
                <span>
                  {growth > 0 ? "+" : ""}
                  {growth.toFixed(1)}%
                </span>
                <span className="text-gray-500">{growthLabel}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
