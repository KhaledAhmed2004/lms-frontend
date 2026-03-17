import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type EditTutorActionsProps = {
  isUpdating: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditTutorActions({
  isUpdating,
  onSave,
  onCancel,
}: EditTutorActionsProps) {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onSave}
        disabled={isUpdating}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
      >
        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
      <Button variant="outline" onClick={onCancel} className="px-8">
        Cancel
      </Button>
    </div>
  );
}
