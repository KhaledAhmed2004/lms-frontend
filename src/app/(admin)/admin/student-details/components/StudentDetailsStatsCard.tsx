import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StudentDetailsStatsCardProps = {
  trialRequestsCount?: number;
  sessionRequestsCount?: number;
  hasCompletedTrial?: boolean;
};

export default function StudentDetailsStatsCard({
  trialRequestsCount,
  sessionRequestsCount,
  hasCompletedTrial,
}: StudentDetailsStatsCardProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Student activity overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {trialRequestsCount || 0}
            </p>
            <p className="text-sm text-gray-600">Trial Requests</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {sessionRequestsCount || 0}
            </p>
            <p className="text-sm text-gray-600">Session Requests</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {hasCompletedTrial ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600">Completed Trial</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
