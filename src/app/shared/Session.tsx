/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from "react";
import { Calendar, Clock, Star, Mic, Square, Check, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUpcomingSessions, useCompletedSessions, Session as SessionType } from "@/hooks/api/use-sessions";
import { useSubmitTutorFeedback, FEEDBACK_TYPE } from "@/hooks/api/use-tutor-feedback";
import { format } from "date-fns";

type FeedbackStep = "audio" | "text" | "success";

function AudioFeedbackModal({
  isOpen,
  onClose,
  session,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: SessionType | null;
}) {
  const [currentStep, setCurrentStep] = useState<FeedbackStep>("audio");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const submitFeedback = useSubmitTutorFeedback();

  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep("audio");
      setRecordingTime(0);
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    }
  }, [isOpen]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 59) {
          clearInterval(interval);
          return 59;
        }
        return prev + 1;
      });
    }, 1000);
    setRecordingInterval(interval);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }

    if (!session || rating === 0) return;

    try {
      // TODO: Implement actual audio upload and get URL
      // For now, we'll skip to text if no audio URL
      await submitFeedback.mutateAsync({
        sessionId: session._id,
        rating,
        feedbackType: FEEDBACK_TYPE.AUDIO,
        feedbackAudioUrl: '', // TODO: Replace with actual uploaded audio URL
        audioDuration: recordingTime,
      });
      setCurrentStep("success");
    } catch (error) {
      console.error('Failed to submit audio feedback:', error);
    }
  };

  const handleSkipAudio = () => {
    setIsRecording(false);
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    setCurrentStep("text");
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitText = async () => {
    if (!session || rating === 0 || feedbackText.length < 10) return;

    try {
      await submitFeedback.mutateAsync({
        sessionId: session._id,
        rating,
        feedbackType: FEEDBACK_TYPE.TEXT,
        feedbackText,
      });
      setCurrentStep("success");
    } catch (error) {
      console.error('Failed to submit text feedback:', error);
    }
  };

  const handleClose = () => {
    setIsRecording(false);
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    setCurrentStep("audio");
    setRecordingTime(0);
    setRating(0);
    setHoverRating(0);
    setFeedbackText("");
    onClose();
  };

  const formatTime = (seconds: number) =>
    `0:${seconds.toString().padStart(2, "0")}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0">
        <VisuallyHidden>
          <DialogTitle>Feedback Modal</DialogTitle>
        </VisuallyHidden>
        {/* Audio Step */}
        {currentStep === "audio" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-5 sm:py-6 lg:py-8 px-4 sm:px-5 lg:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Share Your Feedback
            </h2>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 sm:gap-2.5 lg:gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                        : "text-gray-300 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center mx-auto transition-colors shadow-lg"
            >
              {isRecording ? (
                <Square className="text-white fill-white w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
              ) : (
                <Mic className="text-white w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
              )}
            </button>

            {/* Timer */}
            {isRecording && (
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatTime(recordingTime)}
              </p>
            )}

            {/* Skip Link */}
            <button
              onClick={handleSkipAudio}
              className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm underline"
            >
              Skip Audio Feedback
            </button>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={stopRecording}
                disabled={!isRecording || rating === 0 || submitFeedback.isPending}
                className={`flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-white rounded-lg font-medium text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  isRecording && rating > 0 && !submitFeedback.isPending
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitFeedback.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Text Feedback Step */}
        {currentStep === "text" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-5 sm:py-6 lg:py-8 px-4 sm:px-5 lg:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Share Your Feedback
            </h2>

            {/* Star Rating */}
            <div className="flex justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                        : "text-gray-300 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback here..."
              rows={4}
              className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition"
            />

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitText}
                disabled={rating === 0 || feedbackText.length < 10 || submitFeedback.isPending}
                className={`flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-white rounded-lg font-medium text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  rating > 0 && feedbackText.length >= 10 && !submitFeedback.isPending
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitFeedback.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-8 sm:py-9 lg:py-10 px-4 sm:px-5 lg:px-6 text-center">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Success!
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your review was submitted Successfully
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base transition"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Session() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAudioFeedbackModal, setShowAudioFeedbackModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

  // Fetch real session data from API
  const { data: upcomingSessions = [], isLoading: upcomingLoading } = useUpcomingSessions();
  const { data: completedSessions = [], isLoading: completedLoading } = useCompletedSessions();

  const sessions = activeTab === "upcoming" ? upcomingSessions : completedSessions;
  const isLoading = activeTab === "upcoming" ? upcomingLoading : completedLoading;

  const handleGiveFeedback = (session: SessionType) => {
    // Don't open modal if feedback already given
    if (session.tutorFeedbackId) return;
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
                    {activeTab === "completed" && session.tutorFeedbackId && (
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 sm:py-1 rounded-3xl">
                        Feedback Given
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1 w-40">
                      <Calendar size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                      <span>{formatSessionDate(session.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1 w-32">
                      <Clock size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                      <span>{formatSessionTime(session.startTime)}</span>
                    </div>
                    <span className="text-[#405ED5] font-medium">
                      {session.subject || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() =>
                    activeTab === "completed" && handleGiveFeedback(session)
                  }
                  disabled={activeTab === "completed" && !!session.tutorFeedbackId}
                  className={`sm:ml-4 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors w-full sm:w-auto ${
                    activeTab === "upcoming"
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : session.tutorFeedbackId
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#002AC8] text-white hover:bg-[#3052D2]"
                  }`}
                >
                  {activeTab === "upcoming"
                    ? "Start Session"
                    : session.tutorFeedbackId
                      ? "Feedback Given"
                      : "Give Feedback"}
                </button>
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