'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth-store';
import { useQueryClient } from '@tanstack/react-query';

// Type for incoming message from socket
interface SocketMessage {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  text?: string;
  content?: string;
  type: string;
  sessionProposal?: any;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  onNewMessage: (callback: (message: SocketMessage) => void) => () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinChat: () => {},
  leaveChat: () => {},
  onNewMessage: () => () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken: token, user } = useAuthStore();
  const queryClient = useQueryClient();

  // Join a chat room
  const joinChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      socket.emit('JOIN_CHAT', { chatId });
    }
  }, [socket, isConnected]);

  // Leave a chat room
  const leaveChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      socket.emit('LEAVE_CHAT', { chatId });
    }
  }, [socket, isConnected]);

  // Subscribe to new message events
  const onNewMessage = useCallback((callback: (message: SocketMessage) => void) => {
    if (!socket) return () => {};

    const handler = (data: { message: SocketMessage }) => {
      callback(data.message);
    };

    socket.on('MESSAGE_SENT', handler);

    return () => {
      socket.off('MESSAGE_SENT', handler);
    };
  }, [socket]);

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', {
      auth: {
        token,
      },
      transports: ['websocket'],
      // Enable reconnection with reasonable intervals
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance.id);
      console.log('🔌 User ID for socket room:', user?._id);
      setIsConnected(true);

      // Refetch active queries on reconnect to catch any missed updates
      // This ensures UI is up-to-date after a reconnection
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['trial-request'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected, reason:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Listen for new messages and invalidate React Query cache
    socketInstance.on('MESSAGE_SENT', (data: { message: SocketMessage }) => {
      console.log('New message received via socket:', data.message);
      const chatId = data.message.chatId;

      // Invalidate messages query for this chat to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });

      // Also invalidate chats list to update last message preview
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    });

    // Listen for new trial request (for tutors)
    socketInstance.on('TRIAL_REQUEST_CREATED', (data: any) => {
      console.log('New trial request received via socket:', data);
      // Invalidate matching requests to show new request
      queryClient.invalidateQueries({ queryKey: ['matching-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trial-requests', 'available'] });
    });

    // Listen for trial request accepted (for students)
    socketInstance.on('TRIAL_REQUEST_ACCEPTED', (data: any) => {
      console.log('Trial request accepted via socket:', data);
      // Invalidate student's requests and chats
      queryClient.invalidateQueries({ queryKey: ['trial-request'] });
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    });

    // Listen for trial request taken by another tutor
    socketInstance.on('TRIAL_REQUEST_TAKEN', (data: any) => {
      console.log('Trial request taken by another tutor:', data);
      // Remove this request from available list
      queryClient.invalidateQueries({ queryKey: ['matching-requests'] });
      queryClient.invalidateQueries({ queryKey: ['trial-requests', 'available'] });
    });

    // Listen for session proposal status updates (accept, reject, counter, cancel, status transitions)
    socketInstance.on('PROPOSAL_UPDATED', (data: { messageId: string; chatId: string; status: string; sessionId?: string }) => {
      console.log('🔔 PROPOSAL_UPDATED received via socket:', data);
      console.log('🔔 Status:', data.status, '| ChatId:', data.chatId);

      // IMPORTANT: First invalidate to mark queries as stale, then refetch
      // This ensures React Query actually fetches fresh data from the server

      // Invalidate and refetch messages for this chat
      queryClient.invalidateQueries({ queryKey: ['messages', data.chatId] });
      queryClient.refetchQueries({
        queryKey: ['messages', data.chatId],
        type: 'all'  // Refetch both active and inactive queries
      });

      // Invalidate and refetch trial-request for student dashboard
      queryClient.invalidateQueries({ queryKey: ['trial-request'] });
      queryClient.refetchQueries({
        queryKey: ['trial-request'],
        type: 'all'
      });

      // Also invalidate sessions queries (used by useTrialSession)
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.refetchQueries({
        queryKey: ['sessions'],
        type: 'all'
      });

      // IMPORTANT: Also invalidate the specific trial session query
      // useTrialSession uses ['sessions', 'trial', trialRequestId] which may not get
      // invalidated by the generic ['sessions'] invalidation due to React Query's behavior
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === 'sessions' && key[1] === 'trial';
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key[0] === 'sessions' && key[1] === 'trial';
        },
        type: 'all'
      });

      // Invalidate chats list to update any status indicators
      queryClient.invalidateQueries({ queryKey: ['chats'] });

      console.log('🔔 Queries invalidated and refetched for chatId:', data.chatId);
    });

    // Listen for feedback submitted (real-time update when tutor submits feedback)
    socketInstance.on('FEEDBACK_SUBMITTED', (data: { sessionId: string; chatId: string; feedbackId: string }) => {
      console.log('🔔 FEEDBACK_SUBMITTED received via socket:', data);

      // Invalidate and refetch session feedback for this session
      queryClient.invalidateQueries({ queryKey: ['session-feedback', data.sessionId] });
      queryClient.refetchQueries({
        queryKey: ['session-feedback', data.sessionId],
        type: 'all'
      });

      // Invalidate messages for this chat (feedback shown in chat)
      queryClient.invalidateQueries({ queryKey: ['messages', data.chatId] });
      queryClient.refetchQueries({
        queryKey: ['messages', data.chatId],
        type: 'all'
      });

      // Invalidate sessions queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      console.log('🔔 Feedback queries invalidated for sessionId:', data.sessionId);
    });

    // Listen for student review submitted (real-time update when student submits review)
    socketInstance.on('STUDENT_REVIEW_SUBMITTED', (data: { sessionId: string; chatId: string; reviewId: string }) => {
      console.log('🔔 STUDENT_REVIEW_SUBMITTED received via socket:', data);

      // Invalidate and refetch student review for this session
      queryClient.invalidateQueries({ queryKey: ['review', 'session', data.sessionId] });
      queryClient.refetchQueries({
        queryKey: ['review', 'session', data.sessionId],
        type: 'all'
      });

      // Invalidate messages for this chat
      queryClient.invalidateQueries({ queryKey: ['messages', data.chatId] });
      queryClient.refetchQueries({
        queryKey: ['messages', data.chatId],
        type: 'all'
      });

      console.log('🔔 Student review queries invalidated for sessionId:', data.sessionId);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('MESSAGE_SENT');
      socketInstance.off('TRIAL_REQUEST_CREATED');
      socketInstance.off('TRIAL_REQUEST_ACCEPTED');
      socketInstance.off('TRIAL_REQUEST_TAKEN');
      socketInstance.off('PROPOSAL_UPDATED');
      socketInstance.off('FEEDBACK_SUBMITTED');
      socketInstance.off('STUDENT_REVIEW_SUBMITTED');
      socketInstance.disconnect();
    };
  }, [token, user, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinChat, leaveChat, onNewMessage }}>
      {children}
    </SocketContext.Provider>
  );
}
