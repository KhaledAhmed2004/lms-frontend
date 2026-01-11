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

interface UseAgoraOptions {
  onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onUserLeft?: (user: IAgoraRTCRemoteUser) => void;
  onError?: (error: Error) => void;
}

interface AgoraState {
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  callState: CallState;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  error: string | null;
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

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      await client.publish([audioTrack, videoTrack]);

      setState(prev => ({
        ...prev,
        localAudioTrack: audioTrack,
        localVideoTrack: videoTrack,
        callState: 'connected',
      }));

      console.log('Successfully joined channel:', channelName);
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
