import { Button } from "@/components/ui/button";
import type { AdminApplicationStatus } from "@/hooks/api";
import { Loader2 } from "lucide-react";

type ApplicationActionButtonsProps = {
  status: AdminApplicationStatus;
  isActionPending: boolean;
  isSelecting: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  onSelectForInterview: () => void;
  onApprove: () => void;
  onOpenRevisionModal: () => void;
  onReject: () => void;
};

export default function ApplicationActionButtons({
  status,
  isActionPending,
  isSelecting,
  isApproving,
  isRejecting,
  onSelectForInterview,
  onApprove,
  onOpenRevisionModal,
  onReject,
}: ApplicationActionButtonsProps) {
  if (status === "APPROVED" || status === "REJECTED") return null;

  return (
    <div className="flex justify-center gap-4">
      {(status === "SUBMITTED" || status === "REVISION") && (
        <Button
          onClick={onSelectForInterview}
          disabled={isActionPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isSelecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Select for Interview
        </Button>
      )}

      {status === "SELECTED_FOR_INTERVIEW" && (
        <Button
          onClick={onApprove}
          disabled={isActionPending}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Approve as Tutor
        </Button>
      )}

      <Button
        onClick={onOpenRevisionModal}
        disabled={isActionPending}
        variant="outline"
        className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
      >
        Request Revision
      </Button>

      <Button
        onClick={onReject}
        disabled={isActionPending}
        variant="outline"
        className="border-red-600 text-red-600 hover:bg-red-50 px-8"
      >
        {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reject
      </Button>
    </div>
  );
}
