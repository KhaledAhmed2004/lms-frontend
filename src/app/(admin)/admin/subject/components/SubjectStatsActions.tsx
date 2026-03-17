import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

type SubjectStatsActionsProps = {
  total: number;
  onOpenCreate: () => void;
};

export default function SubjectStatsActions({
  total,
  onOpenCreate,
}: SubjectStatsActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="w-1/4">
        <AdminStatsCard
          icon={BookOpen}
          label="Total Subjects"
          value={total}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <Button onClick={onOpenCreate} className="bg-black hover:bg-gray-800">
        <Plus size={18} className="mr-2" />
        Add Subject
      </Button>
    </div>
  );
}
