import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type AvailableSlotHeaderProps = {
  onCreateNew: () => void;
};

export default function AvailableSlotHeader({
  onCreateNew,
}: AvailableSlotHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Slots</h1>
        <p className="text-sm text-gray-500">
          Manage available interview slots for tutor applications
        </p>
      </div>
      <Button onClick={onCreateNew} className="bg-[#0B31BD] hover:bg-blue-800">
        <Plus className="w-4 h-4 mr-2" />
        Create New Slot
      </Button>
    </div>
  );
}
