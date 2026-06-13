"use client";

import React, { useState, useRef, useCallback } from "react";
import { Star, Mic, Square, Check, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Session as SessionType } from "@/hooks/api/use-sessions";
import {
  useSubmitTutorFeedback,
  FEEDBACK_TYPE,
} from "@/hooks/api/use-tutor-feedback";
import { useTranslations } from "next-intl";

type FeedbackStep = "audio" | "text" | "success";

export default function AudioFeedbackModal({
  isOpen,
  onClose,
  session,
}: {
  isOpen: boolean;
  onClose: () => void;
  session: SessionType | null;
}) {
  const t = useTranslations("audioFeedbackModal");
  const [currentStep, setCurrentStep] = useState<FeedbackStep>("audio");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const submitFeedback = useSubmitTutorFeedback();

  // Shared cleanup: stop recording + clear interval
  const stopAndCleanupRecording = useCallback(() => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current.stop();
    }
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      stopAndCleanupRecording();
      setCurrentStep("audio");
      setRecordingTime(0);
      setMicError(null);
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    }
  }, [isOpen, stopAndCleanupRecording]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            clearInterval(interval);
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state === "recording"
            ) {
              mediaRecorderRef.current.stop();
            }
            return 59;
          }
          return prev + 1;
        });
      }, 1000);
      intervalRef.current = interval;
    } catch (error: any) {
      console.error("Microphone access denied:", error);
      setMicError(t("micAccessDenied"));
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!session || rating === 0) return;

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          recorder.stream.getTracks().forEach((track) => track.stop());
          resolve();
        };
        recorder.stop();
      });
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    if (audioBlob.size === 0) {
      setMicError(t("noAudioRecorded"));
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        sessionId: session._id,
        rating,
        feedbackType: FEEDBACK_TYPE.AUDIO,
        audioBlob,
        audioDuration: recordingTime,
      });
      setCurrentStep("success");
    } catch (error) {
      console.error("Failed to submit audio feedback:", error);
    }
  };

  const handleSkipAudio = () => {
    stopAndCleanupRecording();
    setCurrentStep("text");
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
      console.error("Failed to submit text feedback:", error);
    }
  };

  const handleClose = () => {
    stopAndCleanupRecording();
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setCurrentStep("audio");
    setRecordingTime(0);
    setRating(0);
    setHoverRating(0);
    setFeedbackText("");
    setMicError(null);
    onClose();
  };

  const formatTime = (seconds: number) =>
    `0:${seconds.toString().padStart(2, "0")}`;

  // Shared star rating UI
  const starRating = (
    <div className="flex justify-center gap-2 sm:gap-2.5 lg:gap-3">
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
                ? "fill-yellow-400 text-yellow-400 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                : "text-gray-300 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
            }
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 p-0">
        <VisuallyHidden>
          <DialogTitle>{t("feedbackModal")}</DialogTitle>
        </VisuallyHidden>
        {/* Audio Step */}
        {currentStep === "audio" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-5 sm:py-6 lg:py-8 px-4 sm:px-5 lg:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("shareFeedback")}
            </h2>

            {starRating}

            {/* Record Button */}
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

            {/* Mic Error */}
            {micError && (
              <p className="text-sm text-red-600 px-4">{micError}</p>
            )}

            {/* Skip Link */}
            <button
              onClick={handleSkipAudio}
              className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm underline"
            >
              {t("skipAudio")}
            </button>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={stopRecording}
                disabled={
                  !isRecording || rating === 0 || submitFeedback.isPending
                }
                className={`flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-white rounded-lg font-medium text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  isRecording && rating > 0 && !submitFeedback.isPending
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitFeedback.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("submit")}
              </button>
            </div>
          </div>
        )}

        {/* Text Feedback Step */}
        {currentStep === "text" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-5 sm:py-6 lg:py-8 px-4 sm:px-5 lg:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              {t("shareFeedback")}
            </h2>

            {starRating}

            {/* Textarea */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={t("typeFeedback")}
              rows={4}
              className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-600 transition"
            />

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmitText}
                disabled={
                  rating === 0 ||
                  feedbackText.length < 10 ||
                  submitFeedback.isPending
                }
                className={`flex-1 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-white rounded-lg font-medium text-sm sm:text-base transition flex items-center justify-center gap-2 ${
                  rating > 0 &&
                  feedbackText.length >= 10 &&
                  !submitFeedback.isPending
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {submitFeedback.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("submit")}
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 py-8 sm:py-9 lg:py-10 px-4 sm:px-5 lg:px-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                {t("successTitle")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {t("successDesc")}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm sm:text-base transition"
            >
              {t("close")}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}