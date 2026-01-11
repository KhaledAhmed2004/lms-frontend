import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Session Status Enum
export const SESSION_STATUS = {
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  SCHEDULED: 'SCHEDULED',
  STARTING_SOON: 'STARTING_SOON',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  REVIEW_SUBMITTED: 'REVIEW_SUBMITTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  NO_SHOW: 'NO_SHOW',
  RESCHEDULE_REQUESTED: 'RESCHEDULE_REQUESTED',
} as const;

// Payment Status Enum
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

// Types
export interface Session {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    phone?: string;
  };
  tutorId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    phone?: string;
    averageRating?: number;
  };
  subject: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  pricePerHour: number;
  totalPrice: number;
  status: keyof typeof SESSION_STATUS;
  paymentStatus: keyof typeof PAYMENT_STATUS;
  googleMeetLink?: string;
  isTrial?: boolean;
  reviewId?: string | object;
  tutorFeedbackId?: string | object;
  createdAt: string;
  updatedAt: string;
}

export interface SessionFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  searchTerm?: string;
}

// Unified Session type (for admin view combining sessions + trial requests)
export interface UnifiedSession {
  _id: string;
  type: 'SESSION' | 'TRIAL_REQUEST';
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  tutorName?: string;
  tutorEmail?: string;
  tutorPhone?: string;
  subject: string;
  status: string;
  paymentStatus: string; // 'FREE_TRIAL' | 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  startTime?: string;
  endTime?: string;
  createdAt: string;
  isTrial: boolean;
  description?: string;
  totalPrice?: number;
}

export interface UnifiedSessionFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  isTrial?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============ ADMIN HOOKS ============

// Get All Sessions - Admin Only
export function useAdminSessions(filters: SessionFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['admin-sessions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);

      const { data } = await apiClient.get(`/sessions?${params}`);
      return data as {
        data: Session[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPage: number;
        };
      };
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Get Single Session Details
export function useSessionDetails(sessionId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/sessions/${sessionId}`);
      return data.data as Session;
    },
    enabled: isAuthenticated && !!sessionId,
  });
}

// Get Session Stats - Admin Dashboard
export function useSessionStats() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['admin-session-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/session-stats');
      return data.data as {
        totalSessions: number;
        pendingSessions: number;
        completedSessions: number;
        trialSessions: number;
      };
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Get Unified Sessions - Admin Only (Sessions + Trial Requests)
export function useUnifiedSessions(filters: UnifiedSessionFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['admin-unified-sessions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.isTrial !== undefined) params.append('isTrial', String(filters.isTrial));
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const { data } = await apiClient.get(`/admin/unified-sessions?${params}`);
      return data as {
        data: UnifiedSession[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPage: number;
        };
      };
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// ============ STUDENT/TUTOR HOOKS ============

// Get Upcoming Sessions (Protected - STUDENT or TUTOR only)
export function useUpcomingSessions() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudentOrTutor = user?.role === 'STUDENT' || user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['sessions', 'upcoming'],
    queryFn: async () => {
      const { data } = await apiClient.get('/sessions/my-upcoming');
      return data.data as Session[];
    },
    // Only fetch if user is authenticated AND is a STUDENT or TUTOR
    enabled: isAuthenticated && isStudentOrTutor,
  });
}

// Get Completed Sessions (Protected - STUDENT or TUTOR only)
export function useCompletedSessions() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudentOrTutor = user?.role === 'STUDENT' || user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['sessions', 'completed'],
    queryFn: async () => {
      const { data } = await apiClient.get('/sessions/my-completed');
      return data.data as Session[];
    },
    // Only fetch if user is authenticated AND is a STUDENT or TUTOR
    enabled: isAuthenticated && isStudentOrTutor,
  });
}

// Get Single Session (Protected - STUDENT, TUTOR, or ADMIN)
export function useSession(sessionId: string) {
  const { isAuthenticated, user } = useAuthStore();
  const hasAccess = user?.role === 'STUDENT' || user?.role === 'TUTOR' || user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['sessions', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/sessions/${sessionId}`);
      return data.data as Session;
    },
    enabled: isAuthenticated && hasAccess && !!sessionId,
  });
}

// Cancel Session (Protected)
export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, cancellationReason }: { sessionId: string; cancellationReason: string }) => {
      const { data } = await apiClient.patch(`/sessions/${sessionId}/cancel`, { cancellationReason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
  });
}

// Request Reschedule (Protected)
export function useRescheduleSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      newStartTime,
      reason,
    }: {
      sessionId: string;
      newStartTime: string;
      reason?: string;
    }) => {
      const { data } = await apiClient.patch(
        `/sessions/${sessionId}/reschedule`,
        { newStartTime, reason }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Approve Reschedule (Protected)
export function useApproveReschedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await apiClient.patch(
        `/sessions/${sessionId}/approve-reschedule`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Reject Reschedule (Protected)
export function useRejectReschedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await apiClient.patch(
        `/sessions/${sessionId}/reject-reschedule`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Propose Session - For Tutors (Protected)
export function useProposeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalData: {
      chatId: string;
      subject: string;
      startTime: string;
      endTime: string;
      description?: string;
    }) => {
      const { data } = await apiClient.post('/sessions/propose', proposalData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// Accept Session Proposal - For Students (Protected)
export function useAcceptSessionProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await apiClient.post(
        `/sessions/proposals/${messageId}/accept`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// Reject Session Proposal - For Students (Protected)
export function useRejectSessionProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data } = await apiClient.post(
        `/sessions/proposals/${messageId}/reject`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// Counter-Propose Session - For Students (Protected)
// Student can suggest alternative time for a session proposal
export function useCounterProposeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      newStartTime,
      newEndTime,
      reason,
    }: {
      messageId: string;
      newStartTime: string;
      newEndTime: string;
      reason?: string;
    }) => {
      const { data } = await apiClient.post(
        `/sessions/proposals/${messageId}/counter`,
        { newStartTime, newEndTime, reason }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

// Get Trial Session by Trial Request ID (Protected)
export function useTrialSession(trialRequestId: string | undefined) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['sessions', 'trial', trialRequestId],
    queryFn: async () => {
      // Fetch sessions with trialRequestId filter
      const { data } = await apiClient.get('/sessions', {
        params: {
          trialRequestId,
        },
      });
      // Return the first matching session or null (not undefined)
      return data.data?.[0] ?? null;
    },
    enabled: isAuthenticated && !!trialRequestId,
  });
}