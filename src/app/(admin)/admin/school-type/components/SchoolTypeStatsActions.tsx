import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Button } from "@/components/ui/button";
import { Plus, School } from "lucide-react";

type SchoolTypeStatsActionsProps = {
  total: number;
  onOpenCreate: () => void;
};

export default function SchoolTypeStatsActions({
  total,
  onOpenCreate,
}: SchoolTypeStatsActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="w-1/4">
        <AdminStatsCard
          icon={School}
          label="Total School Types"
          value={total}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      <Button onClick={onOpenCreate} className="bg-black hover:bg-gray-800">
        <Plus size={18} className="mr-2" />
        Add School Type
      </Button>
    </div>
  );
}
