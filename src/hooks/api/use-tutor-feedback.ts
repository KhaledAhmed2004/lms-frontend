import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Enums
export enum FEEDBACK_TYPE {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
}

export enum FEEDBACK_STATUS {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
}

// Types
export interface TutorSessionFeedback {
  _id: string;
  sessionId: string | {
    _id: string;
    scheduledDate: string;
    scheduledTime: string;
    subject?: {
      _id: string;
      name: string;
    };
  };
  tutorId: string;
  studentId: string | {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  feedbackType: FEEDBACK_TYPE;
  feedbackText?: string;
  feedbackAudioUrl?: string;
  audioDuration?: number;
  dueDate: string;
  submittedAt?: string;
  isLate: boolean;
  status: FEEDBACK_STATUS;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitFeedbackData {
  sessionId: string;
  rating: number;
  feedbackType: FEEDBACK_TYPE;
  feedbackText?: string;
  feedbackAudioUrl?: string;
  audioDuration?: number;
}

export interface PendingFeedbacksResponse {
  data: TutorSessionFeedback[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TutorFeedbacksResponse {
  data: TutorSessionFeedback[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ Tutor Hooks ============

// Submit Feedback
export function useSubmitTutorFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitFeedbackData) => {
      const { data: response } = await apiClient.post('/tutor-feedback', data);
      return response.data as TutorSessionFeedback;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-feedbacks'] });
      queryClient.invalidateQueries({ queryKey: ['completed-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-statistics'] });
    },
  });
}

// Get Pending Feedbacks (Tutor)
export function usePendingFeedbacks(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['pending-feedbacks', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/tutor-feedback/pending', {
        params: { page, limit },
      });
      return data as PendingFeedbacksResponse;
    },
    enabled: isAuthenticated && isTutor,
  });
}

// Get My Submitted Feedbacks (Tutor)
export function useTutorFeedbacks(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['tutor-feedbacks', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/tutor-feedback/my-feedbacks', {
        params: { page, limit },
      });
      return data as TutorFeedbacksResponse;
    },
    enabled: isAuthenticated && isTutor,
  });
}

// Get Feedback by Session ID
export function useFeedbackBySession(sessionId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['session-feedback', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tutor-feedback/session/${sessionId}`);
      return data.data as TutorSessionFeedback;
    },
    enabled: isAuthenticated && !!sessionId,
  });
}

// ============ Student Hooks ============

// Get Received Feedbacks (Student)
export function useReceivedFeedbacks(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['received-feedbacks', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/tutor-feedback/received', {
        params: { page, limit },
      });
      return data as TutorFeedbacksResponse;
    },
    enabled: isAuthenticated && isStudent,
  });
}