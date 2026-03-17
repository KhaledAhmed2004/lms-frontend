import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UnifiedSession } from "@/hooks/api";

type SessionDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSession: UnifiedSession | null;
  formatDateTime: (dateString?: string) => string;
  formatScheduledTime: (startTime?: string, endTime?: string) => string;
  getPaymentStatusColor: (status: string) => string;
  getLessonStatusColor: (status: string) => string;
  formatStatusLabel: (status: string) => string;
};

export default function SessionDetailsDialog({
  isOpen,
  onOpenChange,
  selectedSession,
  formatDateTime,
  formatScheduledTime,
  getPaymentStatusColor,
  getLessonStatusColor,
  formatStatusLabel,
}: SessionDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedSession?.type === "TRIAL_REQUEST"
              ? "Trial Request Details"
              : "Session Details"}
            {selectedSession?.isTrial && (
              <Badge className="bg-purple-100 text-purple-800 border-0">
                Free Trial
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {selectedSession ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Booking Date & Time of Request
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDateTime(selectedSession.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Scheduled Lesson Date & Time
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatScheduledTime(
                    selectedSession.startTime,
                    selectedSession.endTime,
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Student Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.studentName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Student Email</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.studentEmail || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-600 mb-1">Student Phone</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.studentPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Tutor Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tutor Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.tutorName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Tutor Email</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.tutorEmail || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-600 mb-1">Tutor Phone</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.tutorPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Session Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Subject</p>
                  <p className="text-sm text-gray-900">
                    {selectedSession.subject}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <Badge
                    className={
                      selectedSession.isTrial
                        ? "bg-purple-100 text-purple-800 border-0"
                        : "bg-blue-100 text-blue-800 border-0"
                    }
                  >
                    {selectedSession.isTrial ? "Trial Session" : "Paid Session"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                  <Badge
                    className={`${getPaymentStatusColor(selectedSession.paymentStatus)} border-0 w-fit`}
                  >
                    {formatStatusLabel(selectedSession.paymentStatus)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Lesson Status</p>
                  <Badge
                    className={`${getLessonStatusColor(selectedSession.status)} border-0 w-fit`}
                  >
                    {formatStatusLabel(selectedSession.status)}
                  </Badge>
                </div>
                {selectedSession.totalPrice !== undefined &&
                  selectedSession.totalPrice > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Total Price</p>
                      <p className="text-sm text-gray-900 font-medium">
                        €{selectedSession.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                {selectedSession.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
