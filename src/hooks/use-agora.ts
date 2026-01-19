'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

// Agora App ID from environment variable
const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

export type CallState = 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'error';

// Device error types for better user messaging
export type DeviceErrorType = 'NOT_READABLE' | 'NOT_FOUND' | 'NOT_ALLOWED' | 'UNKNOWN';

interface UseAgoraOptions {
  onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onUserLeft?: (user: IAgoraRTCRemoteUser) => void;
  onLocalJoined?: (uid: number) => void;  // Called when local user successfully joins
  onError?: (error: Error) => void;
  onDeviceError?: (errorType: DeviceErrorType, message: string) => void;  // Called for device-specific errors
}

interface AgoraState {
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  callState: CallState;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  error: string | null;
  deviceError: DeviceErrorType | null;
  isAudioOnly: boolean;  // True if joined with audio only due to camera issues
}

// Helper to parse Agora device errors
function parseDeviceError(error: unknown): { type: DeviceErrorType; message: string } {
  const errorString = String(error);

  if (errorString.includes('NOT_READABLE') || errorString.includes('Device in use')) {
    return {
      type: 'NOT_READABLE',
      message: 'Camera or microphone is being used by another application. Please close other apps using your camera/mic and try again.',
    };
  }

  if (errorString.includes('NOT_FOUND') || errorString.includes('Requested device not found')) {
    return {
      type: 'NOT_FOUND',
      message: 'No camera or microphone found. Please connect a device and try again.',
    };
  }

  if (errorString.includes('NOT_ALLOWED') || errorString.includes('Permission denied')) {
    return {
      type: 'NOT_ALLOWED',
      message: 'Camera/microphone access denied. Please allow access in your browser settings.',
    };
  }

  return {
    type: 'UNKNOWN',
    message: 'Failed to access camera or microphone. Please check your device settings.',
  };
}

export function useAgora(options: UseAgoraOptions = {}) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const agoraRef = useRef<typeof import('agora-rtc-sdk-ng').default | null>(null);
  const [state, setState] = useState<AgoraState>({
    localVideoTrack: null,
    localAudioTrack: null,
    remoteUsers: [],
    callState: 'idle',
    isAudioMuted: false,
    isVideoMuted: false,
    error: null,
    deviceError: null,
    isAudioOnly: false,
  });

  // Initialize client on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initAgora = async () => {
      if (!agoraRef.current) {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        agoraRef.current = AgoraRTC;
      }
      if (!clientRef.current && agoraRef.current) {
        clientRef.current = agoraRef.current.createClient({ mode: 'rtc', codec: 'vp8' });
      }
    };

    initAgora();

    return () => {
      // Cleanup on unmount
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Join a channel
  const join = useCallback(async (
    channelName: string,
    token: string,
    uid: number
  ) => {
    if (!APP_ID) {
      const error = new Error('Agora App ID is not configured');
      setState(prev => ({ ...prev, callState: 'error', error: error.message }));
      options.onError?.(error);
      return;
    }

    // Ensure Agora is loaded
    if (!agoraRef.current) {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      agoraRef.current = AgoraRTC;
    }

    if (!clientRef.current && agoraRef.current) {
      clientRef.current = agoraRef.current.createClient({ mode: 'rtc', codec: 'vp8' });
    }

    const client = clientRef.current;
    const AgoraRTC = agoraRef.current;

    if (!client || !AgoraRTC) {
      const error = new Error('Agora client not initialized');
      setState(prev => ({ ...prev, callState: 'error', error: error.message }));
      options.onError?.(error);
      return;
    }

    try {
      setState(prev => ({ ...prev, callState: 'connecting', error: null }));

      // Set up event handlers
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log('Subscribed to remote user:', user.uid, mediaType);

        if (mediaType === 'video') {
          setState(prev => ({
            ...prev,
            remoteUsers: [...prev.remoteUsers.filter(u => u.uid !== user.uid), user],
          }));
        }

        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }

        options.onUserJoined?.(user);
      });

      client.on('user-unpublished', async (user, mediaType) => {
        console.log('User unpublished:', user.uid, mediaType);
        if (mediaType === 'video') {
          setState(prev => ({
            ...prev,
            remoteUsers: prev.remoteUsers.map(u =>
              u.uid === user.uid ? user : u
            ),
          }));
        }
      });

      client.on('user-left', (user) => {
        console.log('User left:', user.uid);
        setState(prev => ({
          ...prev,
          remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid),
        }));
        options.onUserLeft?.(user);
      });

      // Join the channel
      await client.join(APP_ID, channelName, token, uid);

      // Try to create and publish local tracks
      let audioTrack: IMicrophoneAudioTrack | null = null;
      let videoTrack: ICameraVideoTrack | null = null;
      let isAudioOnly = false;

      try {
        // First try to get both audio and video
        const [audio, video] = await AgoraRTC.createMicrophoneAndCameraTracks();
        audioTrack = audio;
        videoTrack = video;
      } catch (deviceError) {
        console.warn('Failed to get camera and mic, trying audio only:', deviceError);
        const parsedError = parseDeviceError(deviceError);
        options.onDeviceError?.(parsedError.type, parsedError.message);

        // Try audio only as fallback
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          isAudioOnly = true;
          console.log('Joined with audio only due to camera issues');
        } catch (audioError) {
          console.error('Failed to get audio track:', audioError);
          const audioErrorParsed = parseDeviceError(audioError);
          options.onDeviceError?.(audioErrorParsed.type, audioErrorParsed.message);
          // Continue without any media - user can still see/hear remote users
        }
      }

      // Publish whatever tracks we have
      const tracksToPublish = [audioTrack, videoTrack].filter(Boolean) as (IMicrophoneAudioTrack | ICameraVideoTrack)[];
      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
      }

      setState(prev => ({
        ...prev,
        localAudioTrack: audioTrack,
        localVideoTrack: videoTrack,
        callState: 'connected',
        isAudioOnly,
        deviceError: isAudioOnly ? 'NOT_READABLE' : null,
      }));

      console.log('Successfully joined channel:', channelName, isAudioOnly ? '(audio only)' : '(with video)');

      // Notify that local user has joined (for attendance tracking)
      options.onLocalJoined?.(uid);
    } catch (error) {
      console.error('Error joining channel:', error);
      const err = error instanceof Error ? error : new Error('Failed to join channel');
      setState(prev => ({ ...prev, callState: 'error', error: err.message }));
      options.onError?.(err);
    }
  }, [options]);

  // Leave the channel
  const leave = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    setState(prev => ({ ...prev, callState: 'disconnecting' }));

    try {
      // Stop and close local tracks
      state.localAudioTrack?.stop();
      state.localAudioTrack?.close();
      state.localVideoTrack?.stop();
      state.localVideoTrack?.close();

      // Leave the channel
      await client.leave();

      setState({
        localVideoTrack: null,
        localAudioTrack: null,
        remoteUsers: [],
        callState: 'idle',
        isAudioMuted: false,
        isVideoMuted: false,
        error: null,
        deviceError: null,
        isAudioOnly: false,
      });

      console.log('Left channel');
    } catch (error) {
      console.error('Error leaving channel:', error);
      setState(prev => ({
        ...prev,
        callState: 'idle',
        localVideoTrack: null,
        localAudioTrack: null,
        remoteUsers: [],
        deviceError: null,
        isAudioOnly: false,
      }));
    }
  }, [state.localAudioTrack, state.localVideoTrack]);

  // Toggle audio mute
  const toggleAudio = useCallback(async () => {
    if (!state.localAudioTrack) return;

    const newMuteState = !state.isAudioMuted;
    await state.localAudioTrack.setEnabled(!newMuteState);
    setState(prev => ({ ...prev, isAudioMuted: newMuteState }));
  }, [state.localAudioTrack, state.isAudioMuted]);

  // Toggle video mute
  const toggleVideo = useCallback(async () => {
    if (!state.localVideoTrack) return;

    const newMuteState = !state.isVideoMuted;
    await state.localVideoTrack.setEnabled(!newMuteState);
    setState(prev => ({ ...prev, isVideoMuted: newMuteState }));
  }, [state.localVideoTrack, state.isVideoMuted]);

  return {
    ...state,
    join,
    leave,
    toggleAudio,
    toggleVideo,
  };
}

export default useAgora;
