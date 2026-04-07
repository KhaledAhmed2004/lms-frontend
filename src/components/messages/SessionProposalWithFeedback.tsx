"use client";

import SessionProposal from "./session-proposal";
import { useFeedbackBySession } from "@/hooks/api/use-tutor-feedback";
import { useReviewBySession } from "@/hooks/api/use-reviews";

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
  endTimeRaw,
  startTimeRaw,
  isLoading = false,
  ...props
}: SessionProposalWithFeedbackProps) {
  // Calculate if session time has ended
  const hasTimeEnded = endTimeRaw ? new Date(endTimeRaw) < new Date() : false;

  // Only fetch feedback when session is COMPLETED or has ended
  const shouldFetchFeedback = (status === 'COMPLETED' || hasTimeEnded) && !!sessionId;

  // Fetch tutor feedback (teacher's feedback to student)
  const { data: tutorFeedback, isLoading: isFeedbackLoading } = useFeedbackBySession(
    shouldFetchFeedback ? sessionId : ''
  );

  // Fetch student review (student's review of teacher)
  const { data: studentReview, isLoading: isReviewLoading } = useReviewBySession(
    shouldFetchFeedback ? sessionId : ''
  );

  // Teacher view: hasReview = tutor submitted feedback
  // Student view: hasReview = student submitted review
  const hasTutorFeedback = !!tutorFeedback;
  const hasStudentReview = !!studentReview;

  // For status badge and UI
  const hasReview = userRole === 'TUTOR' ? hasTutorFeedback : hasStudentReview;

  // Review texts
  const tutorReviewText = tutorFeedback?.feedbackText;
  const studentReviewText = studentReview?.comment;
  const studentReviewRating = studentReview?.overallRating;

  // Handle leave review click
  const handleLeaveReview = () => {
    if (onLeaveReview && sessionId) {
      onLeaveReview(sessionId);
    }
  };

  // Show "Leave a review" button:
  // - Teacher: if they haven't submitted feedback yet
  // - Student: if they haven't submitted review yet
  // - ONLY if session has ended (by status or by time)
  const shouldShowReviewButton = (status === 'COMPLETED' || hasTimeEnded) && !!sessionId && (
    (userRole === 'TUTOR' && !hasTutorFeedback) ||
    (userRole === 'STUDENT' && !hasStudentReview)
  );

  return (
    <SessionProposal
      {...props}
      status={status}
      userRole={userRole}
      isLoading={isLoading || isFeedbackLoading || isReviewLoading}
      hasReview={hasReview}
      hasStudentReview={hasStudentReview}
      reviewText={tutorReviewText}
      studentReviewText={studentReviewText}
      studentReviewRating={studentReviewRating}
      onLeaveReview={shouldShowReviewButton ? handleLeaveReview : undefined}
    />
  );
}
