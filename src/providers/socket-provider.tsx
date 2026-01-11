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
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
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

    setSocket(socketInstance);

    return () => {
      socketInstance.off('MESSAGE_SENT');
      socketInstance.off('TRIAL_REQUEST_CREATED');
      socketInstance.off('TRIAL_REQUEST_ACCEPTED');
      socketInstance.off('TRIAL_REQUEST_TAKEN');
      socketInstance.disconnect();
    };
  }, [token, user, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinChat, leaveChat, onNewMessage }}>
      {children}
    </SocketContext.Provider>
  );
}
