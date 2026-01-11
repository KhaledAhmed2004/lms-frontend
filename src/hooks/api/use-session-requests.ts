import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Enums
export enum SESSION_REQUEST_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

// Types
export interface SessionRequest {
  _id: string;
  requestType: 'TRIAL' | 'SESSION';
  studentId: string | {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string | {
    _id: string;
    name: string;
  };
  gradeLevel: string;
  schoolType: string;
  description?: string;
  learningGoals?: string;
  documents?: string[];
  status: SESSION_REQUEST_STATUS;
  acceptedTutorId?: string;
  chatId?: string;
  expiresAt: string;
  acceptedAt?: string;
  cancelledAt?: string;
  isExtended?: boolean;
  extensionCount?: number;
  reminderSentAt?: string;
  finalExpiresAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequestData {
  subject: string;
  gradeLevel: string;
  schoolType: string;
  learningGoals?: string;
  documents?: string[];
}

export interface AcceptSessionRequestData {
  proposedTimes?: string[];
  message?: string;
}

// Student Hooks

// Create Session Request
export function useCreateSessionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionRequestData) => {
      const { data: response } = await apiClient.post('/session-requests', data);
      return response.data as SessionRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-session-requests'] });
    },
  });
}

// Get My Session Requests (Student)
export function useMySessionRequests() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['my-session-requests'],
    queryFn: async () => {
      const { data } = await apiClient.get('/session-requests/my-requests');
      return data.data as SessionRequest[];
    },
    enabled: isAuthenticated && isStudent,
  });
}

// Cancel Session Request (Student)
export function useCancelSessionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/session-requests/${id}/cancel`);
      return data.data as SessionRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-session-requests'] });
    },
  });
}

// Extend Session Request (Student)
export function useExtendSessionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/session-requests/${id}/extend`);
      return data.data as SessionRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-session-requests'] });
    },
  });
}

// Tutor Hooks

// Get Matching Session Requests (Tutor)
export function useMatchingSessionRequests() {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['matching-session-requests'],
    queryFn: async () => {
      const { data } = await apiClient.get('/session-requests/matching');
      return data.data as SessionRequest[];
    },
    enabled: isAuthenticated && isTutor,
  });
}

// Accept Session Request (Tutor)
export function useAcceptSessionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: AcceptSessionRequestData }) => {
      const { data: response } = await apiClient.patch(`/session-requests/${id}/accept`, data);
      return response.data as SessionRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matching-session-requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

// Get Single Session Request
export function useSessionRequest(id: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['session-request', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/session-requests/${id}`);
      return data.data as SessionRequest;
    },
    enabled: isAuthenticated && !!id,
  });
}

// Admin Hooks

// Get All Session Requests (Admin)
export function useAllSessionRequests(filters?: {
  status?: SESSION_REQUEST_STATUS;
  page?: number;
  limit?: number;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['all-session-requests', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/session-requests', { params: filters });
      return data;
    },
    enabled: isAuthenticated && isAdmin,
  });
}
