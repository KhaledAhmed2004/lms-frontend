'use client';

import { useEffect, useRef, useState } from 'react';
import { useVideoCall } from '@/providers/video-call-provider';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface VideoCallProps {
  onClose?: () => void;
}

export default function VideoCall({ onClose }: VideoCallProps) {
  const {
    isInCall,
    currentCall,
    callState,
    localVideoTrack,
    remoteUsers,
    isAudioMuted,
    isVideoMuted,
    endCall,
    toggleAudio,
    toggleVideo,
  } = useVideoCall();

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Play local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  // Play remote video
  useEffect(() => {
    if (remoteUsers.length > 0 && remoteVideoRef.current) {
      const remoteUser = remoteUsers[0];
      if (remoteUser.videoTrack) {
        remoteUser.videoTrack.play(remoteVideoRef.current);
      }
    }
  }, [remoteUsers]);

  // Call duration timer
  useEffect(() => {
    if (callState !== 'connected') {
      setCallDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    onClose?.();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isInCall && callState !== 'connecting') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-900 flex flex-col ${
        isFullscreen ? '' : 'md:inset-4 md:rounded-2xl md:shadow-2xl'
      }`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {currentCall?.otherUser?.name?.[0] || '?'}
            </div>
            <div>
              <h3 className="text-white font-medium">
                {currentCall?.otherUser?.name || 'Unknown'}
              </h3>
              <p className="text-white/70 text-sm">
                {callState === 'connecting'
                  ? 'Connecting...'
                  : formatDuration(callDuration)}
              </p>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white p-2"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
        >
          {remoteUsers.length === 0 && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white">
                  {currentCall?.otherUser?.name?.[0] || '?'}
                </span>
              </div>
              <p className="text-white/70">
                {callState === 'connecting'
                  ? 'Connecting...'
                  : 'Waiting for participant...'}
              </p>
            </div>
          )}
        </div>

        {/* Local Video (PiP) */}
        <div
          ref={localVideoRef}
          className={`absolute bottom-4 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden bg-gray-700 shadow-lg ${
            isVideoMuted ? 'hidden' : ''
          }`}
        >
          {isVideoMuted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <VideoOff className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Audio */}
          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isAudioMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
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
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {isVideoMuted ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
