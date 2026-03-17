import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewSlot } from "@/hooks/api";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type CancelSlotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: InterviewSlot | null;
  cancellationReason: string;
  onCancellationReasonChange: (value: string) => void;
  onCancelSlot: () => void;
  isCancelling: boolean;
  formatSlotTime: (start: string, end: string) => string;
};

export default function CancelSlotDialog({
  open,
  onOpenChange,
  selectedSlot,
  cancellationReason,
  onCancellationReasonChange,
  onCancelSlot,
  isCancelling,
  formatSlotTime,
}: CancelSlotDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Interview Slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel this interview slot? This action
            cannot be undone.
          </p>

          {selectedSlot && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">
                {format(new Date(selectedSlot.startTime), "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-500">
                {formatSlotTime(selectedSlot.startTime, selectedSlot.endTime)}
              </p>
              {selectedSlot.applicantId && (
                <p className="text-sm text-gray-500 mt-1">
                  Booked by: {selectedSlot.applicantId.name}
                </p>
              )}
            </div>
          )}

          <div>
            <Label>Cancellation Reason</Label>
            <Textarea
              value={cancellationReason}
              onChange={(e) => onCancellationReasonChange(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Slot
          </Button>
          <Button
            onClick={onCancelSlot}
            disabled={isCancelling || !cancellationReason.trim()}
            variant="destructive"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Slot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
