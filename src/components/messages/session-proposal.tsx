"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, Video } from "lucide-react";

interface SessionProposalProps {
  date: string;
  time: string;
  endTime?: string;
  startTimeRaw?: Date | string;
  endTimeRaw?: Date | string;
  meetLink?: string;
  status?: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'COUNTER_PROPOSED' | 'CANCELLED' | 'COMPLETED';
  isOwn?: boolean;
  isLoading?: boolean;
  userRole?: string;
  // Review related props
  hasReview?: boolean;
  reviewText?: string;
  onAccept: () => void;
  onReschedule: () => void;
  onDecline: () => void;
  onCancel?: () => void;
  onJoinSession?: () => void;
  onLeaveReview?: () => void;
}

export default function SessionProposal({
  date,
  time,
  endTime,
  startTimeRaw,
  endTimeRaw,
  meetLink,
  status = 'PROPOSED',
  isOwn = false,
  isLoading = false,
  userRole,
  hasReview = false,
  reviewText,
  onAccept,
  onReschedule,
  onDecline,
  onCancel,
  onJoinSession,
  onLeaveReview,
}: SessionProposalProps) {
  const getDateDisplay = (dateStr: string) => {
    const today = new Date().toLocaleDateString("en-DE");
    return dateStr === today ? "Today" : dateStr;
  };

  // Calculate time until session starts
  const getTimeUntilSession = () => {
    if (!startTimeRaw) return null;
    const startDate = new Date(startTimeRaw);
    const now = new Date();
    const diffMs = startDate.getTime() - now.getTime();

    if (diffMs <= 0) return null;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffMins > 0) {
      return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    }
    return null;
  };

  // Check if session is starting soon (within 15 minutes)
  const isStartingSoon = () => {
    if (!startTimeRaw) return false;
    const startDate = new Date(startTimeRaw);
    const now = new Date();
    const diffMs = startDate.getTime() - now.getTime();
    const diffMins = diffMs / (1000 * 60);
    return diffMins > 0 && diffMins <= 15;
  };

  // Check if session is currently in progress (between start and end time)
  const isInProgress = () => {
    if (!startTimeRaw || !endTimeRaw) return false;
    const startDate = new Date(startTimeRaw);
    const endDate = new Date(endTimeRaw);
    const now = new Date();
    return now >= startDate && now <= endDate;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="text-xs text-green-600 font-medium">
            Scheduled
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-xs text-red-500 font-medium">
            Declined
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            Expired
          </span>
        );
      case 'COUNTER_PROPOSED':
        return (
          <span className="text-xs text-blue-600 font-medium">
            Rescheduled
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            Cancelled
          </span>
        );
      case 'COMPLETED':
        if (hasReview && reviewText) {
          return (
            <span className="text-xs text-green-600 font-medium">
              Completed
            </span>
          );
        }
        if (hasReview) {
          return (
            <span className="text-xs text-green-600 font-medium">
              Review Submitted
            </span>
          );
        }
        return (
          <span className="text-xs text-orange-500 font-medium">
            Review required
          </span>
        );
      default:
        return (
          <span className="text-xs text-orange-500 font-medium">
            {isOwn ? 'Sent' : 'Awaiting your response'}
          </span>
        );
    }
  };

  const timeUntil = getTimeUntilSession();
  const startingSoon = isStartingSoon();
  const inProgress = isInProgress();

  // Cancelled session - show cancelled card (no action buttons)
  if (status === 'CANCELLED') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-400">Session cancelled</h3>
          {getStatusBadge()}
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
            <p className="text-sm font-medium text-gray-400 whitespace-nowrap">
              {getDateDisplay(date)}
            </p>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
            <p className="text-sm font-medium text-gray-400 whitespace-nowrap">
              {time}{endTime ? ` – ${endTime}` : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Expired session - show expired card (no action buttons)
  if (status === 'EXPIRED') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-400">Session proposal expired</h3>
          {getStatusBadge()}
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
            <p className="text-sm font-medium text-gray-400 whitespace-nowrap">
              {getDateDisplay(date)}
            </p>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
            <p className="text-sm font-medium text-gray-400 whitespace-nowrap">
              {time}{endTime ? ` – ${endTime}` : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Completed session
  if (status === 'COMPLETED') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-900">Completed session</h3>
          {getStatusBadge()}
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {getDateDisplay(date)}
            </p>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
            <p className="text-sm font-medium text-gray-900">
              {time}{endTime ? ` – ${endTime}` : ''}
            </p>
          </div>
        </div>

        {/* Teacher Review Section - shown when review is submitted with text */}
        {hasReview && reviewText && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wide mb-2">TEACHER REVIEW</p>
            <p className="text-sm text-gray-700">"{reviewText}"</p>
          </div>
        )}

        {/* Leave a review button - shown when review is required */}
        {!hasReview && onLeaveReview && (
          <Button
            onClick={onLeaveReview}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-11 text-sm font-medium"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Leave a review'}
          </Button>
        )}
      </div>
    );
  }

  // Accepted session - Upcoming session card design
  if (status === 'ACCEPTED') {
    // Session is currently in progress (between start and end time)
    if (inProgress) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">Session in progress</h3>
            <span className="text-xs text-blue-600 font-medium">
              In progress
            </span>
          </div>

          {/* Date Section */}
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
              <p className="text-sm font-medium text-gray-900">
                {getDateDisplay(date)}
              </p>
            </div>
          </div>

          {/* Time Section */}
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-gray-300 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {time}{endTime ? ` – ${endTime}` : ''}
              </p>
            </div>
          </div>

          {/* Join Session Button */}
          <Button
            onClick={onJoinSession}
            className="w-full bg-[#0B31BD] hover:bg-[#0B31BD]/90 text-white rounded-lg h-11 text-sm font-medium"
          >
            <Video className="w-4 h-4 mr-2" />
            Join session
          </Button>
        </div>
      );
    }

    // Starting soon (within 15 minutes) - no buttons, just info
    if (startingSoon) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">Session in progress</h3>
            <span className="text-xs text-blue-600 font-medium">
              Starting soon
            </span>
          </div>

          {/* Date Section */}
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
              <p className="text-sm font-medium text-gray-900">
                {getDateDisplay(date)}
              </p>
            </div>
          </div>

          {/* Time Section */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-300 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {time}{endTime ? ` – ${endTime}` : ''}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Normal scheduled session (more than 15 minutes away)
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-900">Upcoming session</h3>
          {getStatusBadge()}
        </div>

        {/* Date Section */}
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {getDateDisplay(date)}
            </p>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-gray-300 shrink-0" />
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
            <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {time}{endTime ? ` – ${endTime}` : ''}{timeUntil ? ` (${timeUntil})` : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons for Accepted Session */}
        <div className="flex flex-col gap-2.5">
          <Button
            variant="outline"
            onClick={onReschedule}
            disabled={isLoading}
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 text-sm font-medium text-gray-700"
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            onClick={onCancel || onDecline}
            disabled={isLoading}
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 text-sm font-medium text-gray-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Default - Session proposal card
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 w-72 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-gray-900">Session proposal</h3>
        {getStatusBadge()}
      </div>

      {/* Date Section */}
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-gray-300 shrink-0" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">DATE</p>
          <p className="text-sm font-medium text-gray-900">
            {getDateDisplay(date)}
          </p>
        </div>
      </div>

      {/* Time Section */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-gray-300 shrink-0" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide whitespace-nowrap">TIME</p>
          <p className="text-sm font-medium text-gray-900">
            {time}{endTime ? ` – ${endTime}` : ''}
          </p>
        </div>
      </div>

      {/* Action Buttons for recipient (student) when status is PROPOSED */}
      {!isOwn && status === 'PROPOSED' && (
        <div className="flex flex-col gap-2.5">
          <Button
            onClick={onAccept}
            disabled={isLoading}
            className="w-full bg-[#0B31BD] hover:bg-[#0B31BD]/90 text-white rounded-lg h-11 text-sm font-medium"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept'}
          </Button>
          <Button
            variant="outline"
            onClick={onReschedule}
            disabled={isLoading}
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 text-sm font-medium text-gray-700"
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            onClick={onDecline}
            disabled={isLoading}
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 text-sm font-medium text-gray-700"
          >
            Decline
          </Button>
        </div>
      )}

      {/* Cancel button for sender (teacher) when status is PROPOSED - waiting for response */}
      {isOwn && status === 'PROPOSED' && (
        <Button
          variant="outline"
          onClick={onCancel || onDecline}
          disabled={isLoading}
          className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 text-sm font-medium text-gray-700"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel'}
        </Button>
      )}
    </div>
  );
}
