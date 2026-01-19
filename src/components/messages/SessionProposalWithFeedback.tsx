"use client";

import SessionProposal from "./session-proposal";
import { useFeedbackBySession } from "@/hooks/api/use-tutor-feedback";

interface SessionProposalWithFeedbackProps {
  date: string;
  time: string;
  endTime?: string;
  startTimeRaw?: Date | string;
  endTimeRaw?: Date | string;
  meetLink?: string;
  status?: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'COUNTER_PROPOSED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'STARTING_SOON' | 'IN_PROGRESS';
  noShowBy?: 'tutor' | 'student';
  isOwn?: boolean;
  isLoading?: boolean;
  userRole?: string;
  sessionId?: string;
  onAccept: () => void;
  onReschedule: () => void;
  onDecline: () => void;
  onCancel?: () => void;
  onJoinSession?: () => void;
  onLeaveReview?: (sessionId: string) => void;
}

export default function SessionProposalWithFeedback({
  sessionId,
  status,
  userRole,
  onLeaveReview,
  isLoading = false,
  ...props
}: SessionProposalWithFeedbackProps) {
  // Only fetch feedback when session is COMPLETED and has a sessionId
  const shouldFetchFeedback = status === 'COMPLETED' && !!sessionId;

  const { data: feedback, isLoading: isFeedbackLoading } = useFeedbackBySession(
    shouldFetchFeedback ? sessionId : ''
  );

  // Determine hasReview and reviewText based on user role
  const hasReview = !!feedback;
  const reviewText = feedback?.feedbackText;

  // Handle leave review click
  const handleLeaveReview = () => {
    if (onLeaveReview && sessionId) {
      onLeaveReview(sessionId);
    }
  };

  return (
    <SessionProposal
      {...props}
      status={status}
      userRole={userRole}
      isLoading={isLoading || isFeedbackLoading}
      hasReview={hasReview}
      reviewText={reviewText}
      onLeaveReview={shouldFetchFeedback && !hasReview ? handleLeaveReview : undefined}
    />
  );
}
