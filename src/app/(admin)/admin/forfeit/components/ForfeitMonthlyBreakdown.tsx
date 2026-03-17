import { Card, CardContent, CardHeader } from "@/components/ui/card";

type MonthlyItem = {
  _id: { year: number; month: number };
  totalAmount: number;
  count: number;
};

type ForfeitMonthlyBreakdownProps = {
  monthlyData: MonthlyItem[];
  monthNames: string[];
  formatCurrency: (amount: number) => string;
};

export default function ForfeitMonthlyBreakdown({
  monthlyData,
  monthNames,
  formatCurrency,
}: ForfeitMonthlyBreakdownProps) {
  if (monthlyData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Period
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Forfeits
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item) => (
                <tr
                  key={`${item._id.year}-${item._id.month}`}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {monthNames[item._id.month - 1]} {item._id.year}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {item.count}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-red-600">
                    {formatCurrency(item.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
