import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityLogItem } from "@/hooks/api/use-admin-stats";
import { Loader2 } from "lucide-react";

type RecentActivityCardProps = {
  activityLoading: boolean;
  activities: ActivityLogItem[];
  getStatusColor: (status: string) => string;
  formatRelativeTime: (dateString: string) => string;
};

export default function RecentActivityCard({
  activityLoading,
  activities,
  getStatusColor,
  formatRelativeTime,
}: RecentActivityCardProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activityLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {activity.title}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(activity.status)}`}
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </Badge>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-500">
            No recent activities
          </div>
        )}
      </CardContent>
    </Card>
  );
}
