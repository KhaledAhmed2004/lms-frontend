"use client";

import { useVideoCall } from "@/providers/video-call-provider";
import {
  Clock,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Monitor,
  MonitorOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface VideoCallProps {
  onClose?: () => void;
}

export default function VideoCall({ onClose }: VideoCallProps) {
  const t = useTranslations("videoCall");
  const {
    isInCall,
    currentCall,
    callState,
    localVideoTrack,
    localScreenTrack,
    remoteUsers,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    endCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useVideoCall();

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localScreenVideoRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // ============================================
  // 🧪 TEST MODE: Set to true for 5 min test sessions
  // Set to false for production (60 min sessions)
  // ============================================
  const TEST_MODE = true;
  // Warning threshold - shows warning banner during the extra time added to session
  // Session structure: actual_duration + warning_extra_time = total_endTime
  // TEST_MODE: 5 min session + 1 min warning = 6 min total
  // Production: 60 min session + 5 min warning = 65 min total
  const WARNING_THRESHOLD_MS = TEST_MODE ? 1 * 60 * 1000 : 5 * 60 * 1000;

  // Play local screen track
  useEffect(() => {
    if (localScreenTrack && localScreenVideoRef.current) {
      localScreenTrack.play(localScreenVideoRef.current);
    }
    return () => {
      localScreenTrack?.stop();
    };
  }, [localScreenTrack]);

  // Play local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current && !isVideoMuted && !isScreenSharing) {
      localVideoTrack.play(localVideoRef.current);
    }
    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack, isVideoMuted, isScreenSharing]);

  // Play remote video
  useEffect(() => {
    const remoteUser = remoteUsers[0];
    if (remoteUser?.videoTrack && remoteVideoRef.current) {
      remoteUser.videoTrack.play(remoteVideoRef.current);
    }
    return () => {
      remoteUser?.videoTrack?.stop();
    };
  }, [remoteUsers, isScreenSharing]);

  // Call duration timer
  useEffect(() => {
    if (callState !== "connected") {
      setCallDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  // Session ending countdown timer
  useEffect(() => {
    if (!currentCall?.endTime || callState !== "connected") {
      setRemainingTime(null);
      setShowWarning(false);
      return;
    }

    const endTimeMs = new Date(currentCall.endTime).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = endTimeMs - now;

      setRemainingTime(remaining);
      setShowWarning(remaining > 0 && remaining <= WARNING_THRESHOLD_MS);

      // Auto-disconnect when session time is up
      if (remaining <= 0) {
        console.log("⏰ Session time ended - auto-disconnecting");
        endCall();
        onClose?.();
      }
    };

    // Initial update
    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [currentCall?.endTime, callState, WARNING_THRESHOLD_MS, endCall, onClose]);

  // Format remaining time for display
  const formatRemainingTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    endCall();
    onClose?.();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isInCall && callState !== "connecting") {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-900 flex flex-col ${
        isFullscreen ? "" : "md:inset-4 md:rounded-2xl md:shadow-2xl"
      }`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-linear-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {currentCall?.otherUser?.name?.[0] || "?"}
            </div>
            <div>
              <h3 className="text-white font-medium">
                {currentCall?.otherUser?.name || t("unknown")}
              </h3>
              <p className="text-white/70 text-sm">
                {callState === "connecting"
                  ? t("connecting")
                  : formatDuration(callDuration)}
              </p>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white p-2"
            title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Session Ending Warning Banner */}
      {showWarning && remainingTime !== null && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-orange-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              {formatRemainingTime(remainingTime)} remaining
            </span>
          </div>
        </div>
      )}

      {/* Video Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video or Local Screen Share (Main) */}
        <div
          ref={remoteVideoRef}
          className={`absolute inset-0 bg-gray-800 flex items-center justify-center ${
            isScreenSharing ? "hidden" : ""
          }`}
        >
          {(remoteUsers.length === 0 || !remoteUsers[0]?.videoTrack) && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white">
                  {currentCall?.otherUser?.name?.[0] || "?"}
                </span>
              </div>
              <p className="text-white/70">
                {callState === "connecting"
                  ? t("connecting")
                  : remoteUsers.length === 0
                    ? t("waitingForParticipant")
                    : `${currentCall?.otherUser?.name || t("participant")} — ${t("cameraOff")}`}
              </p>
            </div>
          )}
        </div>

        {/* Local Screen Share */}
        {isScreenSharing && (
          <div
            ref={localScreenVideoRef}
            className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
          />
        )}

        {/* Local Video or Remote Video (PiP) */}
        <div
          className="absolute bottom-4 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg z-10"
        >
          {isScreenSharing ? (
            /* Show Remote User in PiP when local screen is sharing */
            <div
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Show Local Video in PiP normally */
            <div
              ref={localVideoRef}
              className={`w-full h-full object-cover ${isVideoMuted ? "hidden" : ""}`}
            />
          )}

          {/* Placeholder for PiP when muted or no video */}
          {((!isScreenSharing && isVideoMuted) || (isScreenSharing && (remoteUsers.length === 0 || !remoteUsers[0]?.videoTrack))) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-white/50" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Audio */}
          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isAudioMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
            title={isAudioMuted ? t("unmuteMic") : t("muteMic")}
          >
            {isAudioMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isVideoMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
            title={isVideoMuted ? t("turnOnVideo") : t("turnOffVideo")}
          >
            {isVideoMuted ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Toggle Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isScreenSharing
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-white/20 hover:bg-white/30"
            }`}
            title={isScreenSharing ? t("stopSharing") : t("shareScreen")}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-6 h-6 text-white" />
            ) : (
              <Monitor className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
            title={t("endCall")}
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
