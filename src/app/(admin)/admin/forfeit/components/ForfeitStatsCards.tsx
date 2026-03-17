import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Loader2, Users } from "lucide-react";

type MonthlyItem = {
  _id: { year: number; month: number };
  totalAmount: number;
  count: number;
};

type ForfeitStatsCardsProps = {
  summaryLoading: boolean;
  grandTotalAmount: number;
  grandTotalCount: number;
  monthlyData: MonthlyItem[];
  monthNames: string[];
  formatCurrency: (amount: number) => string;
};

export default function ForfeitStatsCards({
  summaryLoading,
  grandTotalAmount,
  grandTotalCount,
  monthlyData,
  monthNames,
  formatCurrency,
}: ForfeitStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <p className="text-sm font-medium text-gray-500">Total Forfeited</p>
          <DollarSign className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(grandTotalAmount)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <p className="text-sm font-medium text-gray-500">Total Forfeits</p>
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {grandTotalCount}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <p className="text-sm font-medium text-gray-500">Recent Month</p>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : monthlyData.length > 0 ? (
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(monthlyData[0].totalAmount)}
              </p>
              <p className="text-xs text-gray-500">
                {monthNames[monthlyData[0]._id.month - 1]}{" "}
                {monthlyData[0]._id.year} ({monthlyData[0].count} forfeits)
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
