import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenuePoint = {
  month: string;
  revenue: number;
};

type RevenueTrendCardProps = {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  isMounted: boolean;
  revenueLoading: boolean;
  revenueData: RevenuePoint[];
};

export default function RevenueTrendCard({
  timeRange,
  onTimeRangeChange,
  isMounted,
  revenueLoading,
  revenueData,
}: RevenueTrendCardProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!isMounted || revenueLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#002AC8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#002AC8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => `$${value}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#002AC8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            No revenue data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
