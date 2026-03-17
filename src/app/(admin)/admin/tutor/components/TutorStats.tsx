import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Users } from "lucide-react";

type TutorStatsProps = {
  totalTutors: number;
};

export default function TutorStats({ totalTutors }: TutorStatsProps) {
  return (
    <div className="w-full sm:w-1/4">
      <AdminStatsCard icon={Users} label="Total Tutors" value={totalTutors} />
    </div>
  );
}
