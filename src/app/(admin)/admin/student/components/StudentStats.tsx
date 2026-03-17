import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Users } from "lucide-react";

type StudentStatsProps = {
  totalStudents: number;
};

export default function StudentStats({ totalStudents }: StudentStatsProps) {
  return (
    <div className="w-full sm:w-1/4">
      <AdminStatsCard
        icon={Users}
        label="Total Students"
        value={totalStudents}
      />
    </div>
  );
}
