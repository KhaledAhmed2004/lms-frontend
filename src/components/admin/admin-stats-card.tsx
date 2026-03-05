import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  iconBgColor?: string;
  iconColor?: string;
}

export function AdminStatsCard({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
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
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
