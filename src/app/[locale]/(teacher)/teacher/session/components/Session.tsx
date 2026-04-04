"use client";

import { useState } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";

import {
  useUpcomingSessions,
  useCompletedSessions,
  Session as SessionType,
  COMPLETION_STATUS,
} from "@/hooks/api/use-sessions";
import { format, differenceInDays, isBefore } from "date-fns";
import AudioFeedbackModal from "./AudioFeedbackModal";

export default function Session() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAudioFeedbackModal, setShowAudioFeedbackModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null,
  );

  // Fetch real session data from API
  const { data: upcomingSessions = [], isLoading: upcomingLoading } =
    useUpcomingSessions();
  const { data: completedSessions = [], isLoading: completedLoading } =
    useCompletedSessions();

  const sessions =
    activeTab === "upcoming" ? upcomingSessions : completedSessions;
  const isLoading =
    activeTab === "upcoming" ? upcomingLoading : completedLoading;

  // Calculate feedback deadline (3rd of next month from session date)
  const getFeedbackDeadline = (sessionEndTime: string) => {
    const sessionDate = new Date(sessionEndTime);
    const nextMonth = new Date(
      sessionDate.getFullYear(),
      sessionDate.getMonth() + 1,
      3,
      23,
      59,
      59,
    );
    return nextMonth;
  };

  // Check if feedback deadline has passed
  const isDeadlinePassed = (session: SessionType) => {
    const deadline = getFeedbackDeadline(session.endTime);
    return isBefore(deadline, new Date());
  };

  // Get days until deadline
  const getDaysUntilDeadline = (session: SessionType) => {
    const deadline = getFeedbackDeadline(session.endTime);
    return differenceInDays(deadline, new Date());
  };

  const handleGiveFeedback = (session: SessionType) => {
    // Don't open modal if feedback already given
    if (session.tutorFeedbackId) return;
    // Don't allow feedback after deadline
    if (isDeadlinePassed(session)) return;
    setSelectedSession(session);
    setShowAudioFeedbackModal(true);
  };

  const formatSessionDate = (startTime: string) => {
    try {
      return format(new Date(startTime), "EEEE, dd.MM.yyyy");
    } catch {
      return startTime;
    }
  };

  const formatSessionTime = (startTime: string) => {
    try {
      return format(new Date(startTime), "h:mm a");
    } catch {
      return startTime;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 lg:mb-6">
          Session Overview
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-7 lg:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 sm:pb-2.5 lg:pb-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === "upcoming"
                ? "text-[#405ED5] border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 sm:pb-2.5 lg:pb-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === "completed"
                ? "text-[#405ED5] border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({completedSessions.length})
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} sessions found
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-50 border-2 border-[#F6F6F7] transition-colors gap-3 sm:gap-0"
              >
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      {session.studentId?.name || "Unknown Student"}
                    </h3>
                    {session.isTrial && (
                      <span className="text-xs font-semibold text-[#FF8A00] bg-orange-100 px-2 py-0.5 sm:py-1 rounded-3xl">
                        Trial Session
                      </span>
                    )}
                    {activeTab === "completed" &&
                      !session.tutorFeedbackId &&
                      session.teacherFeedbackRequired &&
                      (isDeadlinePassed(session) ? (
                        <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 sm:py-1 rounded-3xl">
                          Deadline Missed
                        </span>
                      ) : getDaysUntilDeadline(session) <= 3 ? (
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 sm:py-1 rounded-3xl">
                          {getDaysUntilDeadline(session)} days left
                        </span>
                      ) : null)}
                    {activeTab === "completed" &&
                      session.teacherCompletionStatus ===
                        COMPLETION_STATUS.COMPLETED && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 sm:py-1 rounded-3xl">
                          Completed
                        </span>
                      )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1 w-40">
                      <Calendar
                        size={14}
                        className="text-gray-400 sm:w-4 sm:h-4"
                      />
                      <span>{formatSessionDate(session.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1 w-32">
                      <Clock
                        size={14}
                        className="text-gray-400 sm:w-4 sm:h-4"
                      />
                      <span>{formatSessionTime(session.startTime)}</span>
                    </div>
                    <span className="text-[#405ED5] font-medium">
                      {session.subject || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Feedback Button (completed tab only) */}
                {activeTab === "completed" && (
                  <button
                    onClick={() => handleGiveFeedback(session)}
                    disabled={
                      !!session.tutorFeedbackId || isDeadlinePassed(session)
                    }
                    className={`sm:ml-4 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors w-full sm:w-auto ${
                      session.tutorFeedbackId
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isDeadlinePassed(session)
                          ? "bg-red-100 text-red-500 cursor-not-allowed"
                          : "bg-[#002AC8] text-white hover:bg-[#3052D2]"
                    }`}
                  >
                    {session.tutorFeedbackId
                      ? "Feedback Given"
                      : isDeadlinePassed(session)
                        ? "Deadline Passed"
                        : "Give Feedback"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audio Feedback Modal */}
      <AudioFeedbackModal
        isOpen={showAudioFeedbackModal}
        onClose={() => {
          setShowAudioFeedbackModal(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
      />
    </>
  );
}
