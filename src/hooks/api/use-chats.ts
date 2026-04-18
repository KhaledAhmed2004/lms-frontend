import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { updateInfiniteChatCache } from '../useInfiniteChats';

// Types
export interface Chat {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email?: string;
    image?: string;  // Backend returns 'image', not 'avatar'
    avatar?: string; // Alias for compatibility
    role?: string;
  }[];
  lastMessage?: {
    text?: string;    // Backend returns 'text'
    content?: string; // Alias for compatibility
    createdAt: string;
  };
  unreadCount: number;
  presence?: {
    isOnline: boolean;
    lastActive?: number;
  };
  subject?: string; // Subject for tutoring chats
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  type: 'image' | 'audio' | 'video' | 'file';
  url: string;
  name?: string;
  size?: number;
  mime?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string; // Backend populates with profilePicture
    avatar?: string;         // Alias for compatibility
  };
  text?: string;             // Backend field name
  content?: string;          // Virtual alias from backend
  type: 'text' | 'image' | 'media' | 'doc' | 'mixed' | 'session_proposal';
  attachments?: Attachment[];
  sessionProposal?: {
    subject: string;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
    description?: string;
    status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'STARTING_SOON' | 'IN_PROGRESS' | 'COUNTER_PROPOSED' | 'SCHEDULED';
    sessionId?: string;
    expiresAt: string;
    noShowBy?: 'tutor' | 'student';
    // Legacy field alias
    scheduledAt?: string;
  };
  readBy?: string[];
  deliveredTo?: string[];
  createdAt: string;
}

// Get All Chats (Protected - STUDENT, TUTOR, or ADMIN only)
export function useChats() {
  const { isAuthenticated, user } = useAuthStore();
  const hasAccess = user?.role === 'STUDENT' || user?.role === 'TUTOR' || user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['chats', 100],
    queryFn: async () => {
      const { data } = await apiClient.get('/chats', {
        params: { limit: 100, perPage: 100, page: 1 }
      });
      return data.data as Chat[];
    },
    // Only fetch if user has proper role
    enabled: isAuthenticated && hasAccess,
  });
}

// Create or Get Chat (Protected)
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      const { data } = await apiClient.post(`/chats/${otherUserId}`);
      return data.data as Chat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

// Get Messages for a Chat (Protected - STUDENT, TUTOR, or ADMIN only)
// Note: Uses refetchOnWindowFocus to catch missed socket updates
export function useMessages(chatId: string) {
  const { isAuthenticated, user } = useAuthStore();
  const hasAccess = user?.role === 'STUDENT' || user?.role === 'TUTOR' || user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/messages/chat/${chatId}`);
      return data.data as Message[];
    },
    // Only fetch if user has proper role
    enabled: isAuthenticated && hasAccess && !!chatId,
    // Refetch when window regains focus to catch missed socket updates
    refetchOnWindowFocus: true,
    // Refetch every 30 seconds as fallback for socket issues during active sessions
    refetchInterval: 30000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (messageData: {
      chatId: string;
      content: string;
      type?: "TEXT" | "FILE";
    }) => {
      // Backend expects 'text' field, not 'content'
      const { data } = await apiClient.post("/messages", {
        chatId: messageData.chatId,
        text: messageData.content,
        type: messageData.type?.toLowerCase() || "text",
      });
      return data;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["messages", newMessage.chatId],
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData([
        "messages",
        newMessage.chatId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["messages", newMessage.chatId],
        (old: Message[] | undefined) => {
          const optimisticMessage: Message = {
            _id: `temp-${Date.now()}`,
            chatId: newMessage.chatId,
            sender: {
              _id: user?._id || "",
              name: user?.name || "You",
              avatar: user?.avatar || "",
            },
            text: newMessage.content,
            content: newMessage.content, // Virtual alias
            type: (newMessage.type?.toLowerCase() as any) || "text",
            createdAt: new Date().toISOString(),
          };
          return old ? [...old, optimisticMessage] : [optimisticMessage];
        },
      );

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    // Instant update after success without full refetch
    onSuccess: (data, variables) => {
      // Manual update of infinite query cache
      if (data?.data) {
        updateInfiniteChatCache(queryClient, variables.chatId, data.data);
      }
      // Also update standard query to facilitate sidebar previews
      queryClient.invalidateQueries({ queryKey: ["messages", variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    // If the mutation fails, roll back
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", newMessage.chatId],
          context.previousMessages,
        );
      }
    },
  });
}

// Mark Chat as Read (Protected)
export function useMarkChatAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await apiClient.post(`/messages/chat/${chatId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

// Send Message with Attachments (Protected)
export function useSendMessageWithAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      chatId: string;
      text?: string;
      files: File[];
    }) => {
      const formData = new FormData();
      formData.append('chatId', messageData.chatId);

      if (messageData.text) {
        formData.append('text', messageData.text);
      }

      // Categorize files by type and append to FormData
      messageData.files.forEach((file) => {
        const mimeType = file.type.toLowerCase();

        if (mimeType.startsWith('image/')) {
          formData.append('image', file);
        } else if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
          formData.append('media', file);
        } else {
          // PDF and other documents
          formData.append('doc', file);
        }
      });

      const { data } = await apiClient.post('/messages', formData);
      return data;
    },
    onSuccess: (data, variables) => {
      if (data?.data) {
        updateInfiniteChatCache(queryClient, variables.chatId, data.data);
      }
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}