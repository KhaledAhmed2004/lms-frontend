import { useAgora } from "@/hooks/use-agora";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type InterviewVideoCallProps = {
  agora: ReturnType<typeof useAgora>;
  onLeave: () => void;
};

export default function InterviewVideoCall({
  agora,
  onLeave,
}: InterviewVideoCallProps) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (agora.localVideoTrack && localVideoRef.current) {
      agora.localVideoTrack.play(localVideoRef.current);
    }
  }, [agora.localVideoTrack]);

  useEffect(() => {
    if (agora.remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = agora.remoteUsers[0];
      if (remoteUser.videoTrack) {
        remoteUser.videoTrack.play(remoteVideoRef.current);
      }
    }
  }, [agora.remoteUsers]);

  useEffect(() => {
    if (agora.callState !== "connected") {
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [agora.callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-linear-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium">Interview Meeting</h3>
              <p className="text-white/70 text-sm">
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
        >
          {agora.remoteUsers.length === 0 && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white/50" />
              </div>
              <p className="text-white/70">Waiting for participant...</p>
            </div>
          )}
        </div>

        <div
          ref={localVideoRef}
          className={`absolute bottom-24 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg ${
            agora.isVideoMuted ? "hidden" : ""
          }`}
        />
        {agora.isVideoMuted && (
          <div className="absolute bottom-24 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white/50" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={agora.toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              agora.isAudioMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {agora.isAudioMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={agora.toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              agora.isVideoMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {agora.isVideoMuted ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={onLeave}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
