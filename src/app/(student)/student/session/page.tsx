"use client";

import { useState } from "react";
import { Calendar, Clock, Star, Check, Video, Loader2, Plus, FileText, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingSessions, useCompletedSessions, Session } from "@/hooks/api/use-sessions";
import { useMySessionRequests, useCancelSessionRequest, useExtendSessionRequest, SessionRequest } from "@/hooks/api/use-session-requests";
import { useCreateReview } from "@/hooks/api/use-reviews";
import { format, formatDistanceToNow } from "date-fns";
import { NewSessionRequestModal } from "./components/NewSessionRequestModal";

function FeedbackModal({
  isOpen,
  onClose,
  session,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const createReview = useCreateReview();

  const handleSubmit = async () => {
    if (!session || rating === 0) return;

    try {
      await createReview.mutateAsync({
        sessionId: session._id,
        overallRating: rating,
        teachingQuality: rating,
        communication: rating,
        punctuality: rating,
        preparedness: rating,
        comment: comment || undefined,
        wouldRecommend: rating >= 4,
        isPublic: true,
      });
      toast.success("Feedback submitted successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setRating(0);
        setComment("");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setShowSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Feedback Modal</DialogTitle>
        </VisuallyHidden>

        {!showSuccess ? (
          <div className="py-6 sm:py-8 px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Share Your Feedback
            </h2>
            {session && (
              <p className="text-sm text-gray-600">
                Rate your session with {session.tutorId.name}
              </p>
            )}

            {/* Star Rating */}
            <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                        : "text-gray-300 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#002AC8]/20"
              rows={3}
            />

            {/* Buttons */}
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || createReview.isPending}
                className="flex-1 bg-[#002AC8] hover:bg-blue-700 h-9 sm:h-10 text-sm sm:text-base disabled:opacity-50"
              >
                {createReview.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-10 sm:py-12 px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Success!</h3>
            <p className="text-base sm:text-lg text-gray-600">
              Your review was submitted successfully
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper to format date
function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "EEEE, dd.MM.yyyy");
}

// Helper to format time
function formatSessionTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

// Check if session can be joined (within 10 minutes of start or during session)
function canJoinSession(session: Session): boolean {
  const now = new Date();
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);

  return now >= tenMinutesBefore && now <= endTime;
}

// Extended Session type with review status and trial info
interface ExtendedSession extends Session {
  studentReviewStatus?: string;
  isTrial?: boolean;
}

// Cancel Request Confirmation Modal
function CancelRequestModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Cancel Request</DialogTitle>
        </VisuallyHidden>
        <div className="py-6 sm:py-8 px-4 sm:px-6 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            Cancel Request
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Are you sure you want to cancel this session request?
          </p>

          <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
            >
              Keep Request
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-9 sm:h-10 text-sm sm:text-base disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Cancel Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Session Request Card Component
function SessionRequestCard({
  request,
  onCancel,
  onExtend,
  isExtending,
}: {
  request: SessionRequest;
  onCancel: () => void;
  onExtend: () => void;
  isExtending: boolean;
}) {
  const subjectName = typeof request.subject === 'object' ? request.subject.name : request.subject;
  const expiresAt = new Date(request.expiresAt);
  const timeRemaining = expiresAt.getTime() - Date.now();
  const isExpiringSoon = timeRemaining < 2 * 24 * 60 * 60 * 1000; // 2 days
  // Show extend button only when 1 day or less remaining (6+ days passed) and not already extended
  const canExtend = request.status === 'PENDING'
    && (!request.extensionCount || request.extensionCount < 1)
    && timeRemaining <= 1 * 24 * 60 * 60 * 1000; // 1 day or less remaining

  const getStatusBadge = () => {
    switch (request.status) {
      case 'PENDING':
        return <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">Pending</span>;
      case 'ACCEPTED':
        return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">Accepted</span>;
      case 'EXPIRED':
        return <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">Expired</span>;
      case 'CANCELLED':
        return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-50 border-2 border-[#F6F6F7] transition-colors gap-3 sm:gap-0">
      {/* Left Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900">
            {subjectName}
          </h3>
          {getStatusBadge()}
          {request.requestType === 'TRIAL' && (
            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded font-medium">
              Trial
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FileText size={14} className="text-gray-400 flex-shrink-0" />
            <span>{request.gradeLevel} • {request.schoolType}</span>
          </div>
          {request.status === 'PENDING' && (
            <div className={`flex items-center gap-1 ${isExpiringSoon ? 'text-red-500' : ''}`}>
              <Clock size={14} className={`flex-shrink-0 ${isExpiringSoon ? 'text-red-500' : 'text-gray-400'}`} />
              <span>Expires {formatDistanceToNow(expiresAt, { addSuffix: true })}</span>
            </div>
          )}
          {request.learningGoals && (
            <p className="text-gray-500 truncate max-w-[200px]" title={request.learningGoals}>
              {request.learningGoals}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {request.status === 'PENDING' && (
        <div className="flex gap-2 sm:ml-4">
          {canExtend && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExtend}
              disabled={isExtending}
              className="text-xs"
            >
              {isExtending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              Extend
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

// Session Card Component
function SessionCard({
  session,
  isUpcoming,
  onFeedback,
}: {
  session: ExtendedSession;
  isUpcoming: boolean;
  onFeedback: () => void;
}) {
  const canJoin = isUpcoming && canJoinSession(session);
  // Backend returns 'COMPLETED' when review exists, 'PENDING' when not
  const hasReviewed = !isUpcoming && session.studentReviewStatus === 'COMPLETED';

  const handleJoinSession = () => {
    if (session.googleMeetLink) {
      window.open(session.googleMeetLink, '_blank');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-50 border-2 border-[#F6F6F7] transition-colors gap-3 sm:gap-0">
      {/* Left Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900">
            {session.tutorId.name}
          </h3>
          {session.isTrial && (
            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded font-medium">
              Trial Session
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center w-40 gap-1">
            <Calendar size={14} className="text-gray-400 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{formatSessionDate(session.startTime)}</span>
          </div>
          <div className="flex items-center gap-1 w-32">
            <Clock size={14} className="text-gray-400 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{formatSessionTime(session.startTime)}</span>
          </div>
          <p className="text-[#405ED5] hover:text-[#3052D2] font-medium">
            {session.subject}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {isUpcoming ? (
        <button
          onClick={handleJoinSession}
          disabled={!canJoin}
          className={`sm:ml-4 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2 ${
            canJoin
              ? "bg-[#002AC8] text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Video size={16} />
          {canJoin ? "Join Session" : "Not Started Yet"}
        </button>
      ) : (
        <button
          onClick={onFeedback}
          disabled={hasReviewed}
          className={`sm:ml-4 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors w-full sm:w-auto ${
            hasReviewed
              ? "bg-gray-200 text-gray-500 cursor-default"
              : "bg-[#002AC8] text-white hover:bg-blue-700"
          }`}
        >
          {hasReviewed ? "Feedback Done" : "Give Feedback"}
        </button>
      )}
    </div>
  );
}

export default function StudentSession() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SessionRequest | null>(null);
  const [extendingRequestId, setExtendingRequestId] = useState<string | null>(null);

  // Fetch data
  const { data: upcomingSessions, isLoading: isLoadingUpcoming } = useUpcomingSessions();
  const { data: completedSessions, isLoading: isLoadingCompleted } = useCompletedSessions();
  const { data: myRequests, isLoading: isLoadingRequests } = useMySessionRequests();

  // Mutations
  const cancelRequest = useCancelSessionRequest();
  const extendRequest = useExtendSessionRequest();

  // Filter pending requests count
  const pendingRequestsCount = myRequests?.filter(r => r.status === 'PENDING').length || 0;

  const isLoading = activeTab === "upcoming"
    ? isLoadingUpcoming
    : activeTab === "completed"
      ? isLoadingCompleted
      : isLoadingRequests;
  const sessions = activeTab === "upcoming" ? upcomingSessions : completedSessions;

  // Handlers for session requests
  const handleCancelRequest = (request: SessionRequest) => {
    setSelectedRequest(request);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRequest) return;
    try {
      await cancelRequest.mutateAsync(selectedRequest._id);
      toast.success("Request cancelled successfully");
      setIsCancelModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to cancel request");
    }
  };

  const handleExtendRequest = async (requestId: string) => {
    setExtendingRequestId(requestId);
    try {
      await extendRequest.mutateAsync(requestId);
      toast.success("Request extended by 7 days");
    } catch (error) {
      toast.error("Failed to extend request");
    } finally {
      setExtendingRequestId(null);
    }
  };

  const handleOpenFeedback = (session: Session) => {
    setSelectedSession(session);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedback = () => {
    setIsFeedbackModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Session Overview
          </h2>
          <Button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="bg-[#002AC8] hover:bg-blue-700 text-white text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Request
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-7 lg:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 sm:pb-2.5 lg:pb-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === "upcoming"
                ? "text-[#002AC8] border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming ({upcomingSessions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 sm:pb-2.5 lg:pb-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === "completed"
                ? "text-[#002AC8] border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({completedSessions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-2 sm:pb-2.5 lg:pb-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === "requests"
                ? "text-[#002AC8] border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Requests ({pendingRequestsCount})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border-2 border-[#F6F6F7]">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))
          ) : activeTab === "requests" ? (
            // My Requests Tab Content
            myRequests && myRequests.length > 0 ? (
              myRequests.map((request) => (
                <SessionRequestCard
                  key={request._id}
                  request={request}
                  onCancel={() => handleCancelRequest(request)}
                  onExtend={() => handleExtendRequest(request._id)}
                  isExtending={extendingRequestId === request._id}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No session requests</p>
                <p className="text-sm mt-1">
                  Click "New Request" to request a tutoring session
                </p>
              </div>
            )
          ) : sessions && sessions.length > 0 ? (
            // Sessions Tab Content (Upcoming/Completed)
            sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session as ExtendedSession}
                isUpcoming={activeTab === "upcoming"}
                onFeedback={() => handleOpenFeedback(session)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">
                {activeTab === "upcoming"
                  ? "No upcoming sessions"
                  : "No completed sessions yet"}
              </p>
              <p className="text-sm mt-1">
                {activeTab === "upcoming"
                  ? "Your scheduled sessions will appear here"
                  : "Your completed sessions will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedback}
        session={selectedSession}
      />

      {/* New Session Request Modal */}
      <NewSessionRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
      />

      {/* Cancel Request Modal */}
      <CancelRequestModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmCancel}
        isPending={cancelRequest.isPending}
      />
    </>
  );
}