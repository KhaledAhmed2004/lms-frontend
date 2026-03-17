import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type UserDistributionItem = {
  name: string;
  value: number;
  color: string;
};

type UserDistributionCardProps = {
  isMounted: boolean;
  distributionLoading: boolean;
  userDistribution: UserDistributionItem[];
  formatNumber: (value: number) => string;
};

export default function UserDistributionCard({
  isMounted,
  distributionLoading,
  userDistribution,
  formatNumber,
}: UserDistributionCardProps) {
  return (
    <Card className="border-gray-200 w-1/3">
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>Platform users breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {!isMounted || distributionLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : userDistribution.some((u) => u.value > 0) ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No user data available
          </div>
        )}

        <div className="mt-6 space-y-3 w-full">
          {distributionLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-[#002AC8] rounded-full"></span>
                  Students
                </span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(
                    userDistribution.find((u) => u.name === "Students")
                      ?.value || 0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  Tutors
                </span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(
                    userDistribution.find((u) => u.name === "Tutors")?.value ||
                      0,
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
