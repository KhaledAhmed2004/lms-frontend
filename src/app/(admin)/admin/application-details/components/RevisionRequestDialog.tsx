import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type RevisionRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revisionNote: string;
  onRevisionNoteChange: (value: string) => void;
  isSendingRevision: boolean;
  onSubmit: () => void;
};

export default function RevisionRequestDialog({
  open,
  onOpenChange,
  revisionNote,
  onRevisionNoteChange,
  isSendingRevision,
  onSubmit,
}: RevisionRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Revision</DialogTitle>
          <DialogDescription>
            Specify what the applicant needs to fix or update in their
            application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="revisionNote">Reason for Revision</Label>
            <Textarea
              id="revisionNote"
              placeholder="Please describe what needs to be corrected or updated..."
              value={revisionNote}
              onChange={(e) => onRevisionNoteChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Minimum 10 characters required ({revisionNote.length}/10)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSendingRevision}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={revisionNote.trim().length < 10 || isSendingRevision}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isSendingRevision && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Revision Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
