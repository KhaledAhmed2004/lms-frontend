'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useSocket } from './socket-provider';
import { useAgora } from '@/hooks/use-agora';
import { useAuthStore } from '@/store/auth-store';

export interface CallInfo {
  callId: string;
  channelName: string;
  callType: 'video' | 'audio';
  otherUser: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  sessionId?: string;
}

export interface IncomingCallInfo extends CallInfo {
  caller: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

interface VideoCallContextType {
  // Call state
  isInCall: boolean;
  isReceivingCall: boolean;
  currentCall: CallInfo | null;
  incomingCall: IncomingCallInfo | null;
  callState: 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'error';
  error: string | null;

  // Agora state
  localVideoTrack: any;
  localAudioTrack: any;
  remoteUsers: any[];
  isAudioMuted: boolean;
  isVideoMuted: boolean;

  // Actions
  initiateCall: (receiverId: string, callType: 'video' | 'audio', chatId?: string, sessionId?: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;

  // Session-based call (for tutoring sessions)
  joinSessionCall: (sessionId: string, otherUserId: string, otherUserName: string) => void;
}

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export function useVideoCall() {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
}

export default function VideoCallProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuthStore();
  const [currentCall, setCurrentCall] = useState<CallInfo | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [pendingToken, setPendingToken] = useState<{ token: string; uid: number; channelName: string } | null>(null);

  const agora = useAgora({
    onUserJoined: (user) => {
      console.log('Remote user joined:', user.uid);
      // Notify socket that user joined channel
      if (socket && currentCall) {
        socket.emit('CALL_USER_JOINED_CHANNEL', {
          callId: currentCall.callId,
          agoraUid: user.uid,
        });
      }
    },
    onUserLeft: (user) => {
      console.log('Remote user left:', user.uid);
    },
    onError: (error) => {
      console.error('Agora error:', error);
    },
  });

  // Handle socket events for calls
  useEffect(() => {
    if (!socket) return;

    // When call is initiated by this user
    socket.on('CALL_INITIATED', ({ callId, channelName, token, uid, callType }) => {
      console.log('Call initiated:', { callId, channelName, callType });
      setPendingToken({ token, uid, channelName });
      // Join Agora channel
      agora.join(channelName, token, uid);
    });

    // When receiving an incoming call
    socket.on('INCOMING_CALL', ({ callId, channelName, callType, caller }) => {
      console.log('Incoming call from:', caller);
      setIncomingCall({
        callId,
        channelName,
        callType,
        caller,
        otherUser: caller,
      });
    });

    // When receiver accepts our call
    socket.on('CALL_ACCEPTED_BY_RECEIVER', ({ callId }) => {
      console.log('Call accepted by receiver:', callId);
    });

    // When we accept a call (get token)
    socket.on('CALL_ACCEPTED', ({ callId, channelName, token, uid }) => {
      console.log('Call accepted, joining channel');
      setCurrentCall((prev) => prev ? { ...prev, callId, channelName } : null);
      agora.join(channelName, token, uid);
    });

    // When call is rejected
    socket.on('CALL_REJECTED', ({ callId }) => {
      console.log('Call rejected:', callId);
      setCurrentCall(null);
      setIncomingCall(null);
      agora.leave();
    });

    // When call ends
    socket.on('CALL_ENDED', ({ callId, duration }) => {
      console.log('Call ended:', callId, 'Duration:', duration);
      setCurrentCall(null);
      setIncomingCall(null);
      agora.leave();
    });

    // When call is cancelled
    socket.on('CALL_CANCELLED', ({ callId }) => {
      console.log('Call cancelled:', callId);
      setCurrentCall(null);
      setIncomingCall(null);
      agora.leave();
    });

    // When participant joins
    socket.on('CALL_PARTICIPANT_JOINED', ({ callId, userId, agoraUid, activeParticipants }) => {
      console.log('Participant joined:', userId, 'Active:', activeParticipants);
    });

    // When participant leaves
    socket.on('CALL_PARTICIPANT_LEFT', ({ callId, userId, activeParticipants }) => {
      console.log('Participant left:', userId, 'Active:', activeParticipants);
      // If no participants left, end call
      if (activeParticipants === 0) {
        setCurrentCall(null);
        agora.leave();
      }
    });

    // When both participants are connected
    socket.on('CALL_BOTH_CONNECTED', ({ callId, message }) => {
      console.log('Both connected:', message);
    });

    // Call error
    socket.on('CALL_ERROR', ({ message }) => {
      console.error('Call error:', message);
    });

    // Session-based call joined successfully
    socket.on('SESSION_CALL_JOINED', ({ callId, channelName, token, uid, callType, isNew }) => {
      console.log('Session call joined:', { callId, channelName, callType, isNew });
      setCurrentCall((prev) => prev ? { ...prev, callId, channelName } : {
        callId,
        channelName,
        callType,
        otherUser: { id: '', name: '' },
      });
      // Join Agora channel with the token
      agora.join(channelName, token, uid);
    });

    // Session call is ready (notifies the other user)
    socket.on('SESSION_CALL_READY', ({ callId, channelName, sessionId, callType, caller }) => {
      console.log('Session call ready, other user joined:', { callId, channelName, caller });
      // This notifies that another user has started the session call
      // The current user can also join now
    });

    return () => {
      socket.off('CALL_INITIATED');
      socket.off('INCOMING_CALL');
      socket.off('CALL_ACCEPTED_BY_RECEIVER');
      socket.off('CALL_ACCEPTED');
      socket.off('CALL_REJECTED');
      socket.off('CALL_ENDED');
      socket.off('CALL_CANCELLED');
      socket.off('CALL_PARTICIPANT_JOINED');
      socket.off('CALL_PARTICIPANT_LEFT');
      socket.off('CALL_BOTH_CONNECTED');
      socket.off('CALL_ERROR');
      socket.off('SESSION_CALL_JOINED');
      socket.off('SESSION_CALL_READY');
    };
  }, [socket, agora]);

  // Initiate a call
  const initiateCall = useCallback((
    receiverId: string,
    callType: 'video' | 'audio',
    chatId?: string,
    sessionId?: string
  ) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    setCurrentCall({
      callId: '', // Will be set when CALL_INITIATED response comes
      channelName: '',
      callType,
      otherUser: { id: receiverId, name: '' },
      sessionId,
    });

    socket.emit('CALL_INITIATE', {
      receiverId,
      callType,
      chatId,
    });
  }, [socket, isConnected]);

  // Accept incoming call
  const acceptCall = useCallback(() => {
    if (!socket || !incomingCall) return;

    setCurrentCall({
      callId: incomingCall.callId,
      channelName: incomingCall.channelName,
      callType: incomingCall.callType,
      otherUser: incomingCall.caller,
    });

    socket.emit('CALL_ACCEPT', { callId: incomingCall.callId });
    setIncomingCall(null);
  }, [socket, incomingCall]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (!socket || !incomingCall) return;

    socket.emit('CALL_REJECT', { callId: incomingCall.callId });
    setIncomingCall(null);
  }, [socket, incomingCall]);

  // End current call
  const endCall = useCallback(() => {
    if (!socket || !currentCall) return;

    socket.emit('CALL_END', { callId: currentCall.callId });
    socket.emit('CALL_USER_LEFT_CHANNEL', { callId: currentCall.callId });

    setCurrentCall(null);
    agora.leave();
  }, [socket, currentCall, agora]);

  // Join a session-based call (for tutoring sessions)
  // Both users will join the SAME channel based on sessionId
  const joinSessionCall = useCallback((
    sessionId: string,
    otherUserId: string,
    otherUserName: string
  ) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    setCurrentCall({
      callId: '', // Will be set when SESSION_CALL_JOINED response comes
      channelName: '',
      callType: 'video',
      otherUser: { id: otherUserId, name: otherUserName },
      sessionId,
    });

    // Emit session-based call join - both users will get same channel
    socket.emit('CALL_JOIN_SESSION', {
      sessionId,
      otherUserId,
      callType: 'video',
    });
  }, [socket, isConnected]);

  const value: VideoCallContextType = {
    isInCall: agora.callState === 'connected',
    isReceivingCall: !!incomingCall,
    currentCall,
    incomingCall,
    callState: agora.callState,
    error: agora.error,

    localVideoTrack: agora.localVideoTrack,
    localAudioTrack: agora.localAudioTrack,
    remoteUsers: agora.remoteUsers,
    isAudioMuted: agora.isAudioMuted,
    isVideoMuted: agora.isVideoMuted,

    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio: agora.toggleAudio,
    toggleVideo: agora.toggleVideo,

    joinSessionCall,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
}
