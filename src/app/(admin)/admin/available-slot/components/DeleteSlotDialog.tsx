import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InterviewSlot } from "@/hooks/api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type DeleteSlotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotToDelete: InterviewSlot | null;
  onDelete: () => void;
  isDeleting: boolean;
  formatSlotTime: (start: string, end: string) => string;
};

export default function DeleteSlotDialog({
  open,
  onOpenChange,
  slotToDelete,
  onDelete,
  isDeleting,
  formatSlotTime,
}: DeleteSlotDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Interview Slot</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this interview slot? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {slotToDelete && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">
              {format(new Date(slotToDelete.startTime), "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-sm text-gray-500">
              {formatSlotTime(slotToDelete.startTime, slotToDelete.endTime)}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Slot"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
