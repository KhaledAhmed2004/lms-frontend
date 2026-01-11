import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

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
    status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    sessionId?: string;
    expiresAt: string;
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
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/chats');
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
  });
}

// Send Message (Protected)
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: {
      chatId: string;
      content: string;
      type?: 'TEXT' | 'FILE';
    }) => {
      // Backend expects 'text' field, not 'content'
      const { data } = await apiClient.post('/messages', {
        chatId: messageData.chatId,
        text: messageData.content,
        type: messageData.type?.toLowerCase() || 'text',
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
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

      const { data } = await apiClient.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}