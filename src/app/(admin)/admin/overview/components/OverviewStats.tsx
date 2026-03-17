import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type OverviewStat = {
  label: string;
  value: number;
  growth: number;
  growthType: "increase" | "decrease" | "no_change" | "neutral";
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  isCurrency: boolean;
};

type OverviewStatsProps = {
  statsLoading: boolean;
  statsConfig: OverviewStat[];
  formatCurrency: (amount: number) => string;
  formatNumber: (value: number) => string;
};

export default function OverviewStats({
  statsLoading,
  statsConfig,
  formatCurrency,
  formatNumber,
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        : statsConfig.map((stat, index) => (
            <AdminStatsCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={
                stat.isCurrency
                  ? formatCurrency(stat.value)
                  : formatNumber(stat.value)
              }
              iconBgColor={stat.bgColor}
              iconColor={stat.iconColor}
              growth={stat.growth}
              growthType={stat.growthType}
            />
          ))}
    </div>
  );
}
