import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// ========================
// Types & Enums
// ========================

export enum TRIAL_REQUEST_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum SCHOOL_TYPE {
  GRUNDSCHULE = 'GRUNDSCHULE',
  HAUPTSCHULE = 'HAUPTSCHULE',
  REALSCHULE = 'REALSCHULE',
  GYMNASIUM = 'GYMNASIUM',
  GESAMTSCHULE = 'GESAMTSCHULE',
  BERUFSSCHULE = 'BERUFSSCHULE',
  UNIVERSITY = 'UNIVERSITY',
  OTHER = 'OTHER',
}

export enum GRADE_LEVEL {
  GRADE_1 = '1',
  GRADE_2 = '2',
  GRADE_3 = '3',
  GRADE_4 = '4',
  GRADE_5 = '5',
  GRADE_6 = '6',
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9',
  GRADE_10 = '10',
  GRADE_11 = '11',
  GRADE_12 = '12',
  GRADE_13 = '13',
  UNIVERSITY_SEMESTER_1 = 'SEMESTER_1',
  UNIVERSITY_SEMESTER_2 = 'SEMESTER_2',
  UNIVERSITY_SEMESTER_3 = 'SEMESTER_3',
  UNIVERSITY_SEMESTER_4 = 'SEMESTER_4',
  UNIVERSITY_SEMESTER_5_PLUS = 'SEMESTER_5_PLUS',
}

export interface GuardianInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface StudentInfo {
  name: string;
  email?: string;
  password?: string;
  isUnder18: boolean;
  dateOfBirth?: string;
  guardianInfo?: GuardianInfo;
}

export interface CreateTrialRequestData {
  studentInfo: StudentInfo;
  subject: string; // Subject ID
  gradeLevel: GRADE_LEVEL | string;
  schoolType: SCHOOL_TYPE | string;
  description: string;
  learningGoals?: string;
  preferredLanguage: 'ENGLISH' | 'GERMAN';
  preferredDateTime?: string;
  documents?: File[];
}

// Populated tutor info when request is accepted
export interface AcceptedTutor {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
}

export interface TrialRequest {
  _id: string;
  requestType: 'TRIAL';
  studentId?: string;
  studentInfo: StudentInfo;
  subject: {
    _id: string;
    name: string;
  };
  gradeLevel: string;
  schoolType: string;
  description: string;
  learningGoals?: string;
  preferredLanguage: 'ENGLISH' | 'GERMAN';
  preferredDateTime?: string;
  documents?: string[];
  status: TRIAL_REQUEST_STATUS;
  acceptedTutorId?: AcceptedTutor | string;
  chatId?: string;
  expiresAt: string;
  acceptedAt?: string;
  cancelledAt?: string;
  isExtended?: boolean;
  extensionCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ========================
// Student/Guest Hooks
// ========================

/**
 * Create a new trial request (for students/guests)
 * POST /api/v1/trial-requests
 *
 * Supports file upload via FormData (backend has fileHandler middleware)
 * Backend parses JSON from 'data' field via parseJsonData()
 *
 * For new users: Backend returns accessToken + user info for auto-login
 */
export function useCreateTrialRequest() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: CreateTrialRequestData) => {
      const formData = new FormData();

      // Add files if present
      if (data.documents && data.documents.length > 0) {
        data.documents.forEach((file) => {
          formData.append('documents', file);
        });
      }

      // Backend expects all JSON data in 'data' field (parsed by parseJsonData)
      const jsonPayload = {
        studentInfo: data.studentInfo,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        schoolType: data.schoolType,
        description: data.description,
        preferredLanguage: data.preferredLanguage,
        learningGoals: data.learningGoals,
        preferredDateTime: data.preferredDateTime,
      };

      formData.append('data', JSON.stringify(jsonPayload));

      const response = await apiClient.post('/trial-requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (response) => {
      // Auto-login if new user was created (backend returns accessToken + user)
      if (response.data?.accessToken && response.data?.user) {
        setAuth(response.data.user, response.data.accessToken);
      }
    },
  });
}

/**
 * Get trial request by ID
 * GET /api/v1/trial-requests/:id
 */
export function useTrialRequest(id: string) {
  return useQuery({
    queryKey: ['trial-request', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/trial-requests/${id}`);
      return data.data as TrialRequest;
    },
    enabled: !!id,
  });
}

/**
 * Cancel a pending trial request (for students)
 * PATCH /api/v1/trial-requests/:id/cancel
 */
export function useCancelTrialRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cancellationReason }: { id: string; cancellationReason: string }) => {
      const { data } = await apiClient.patch(`/trial-requests/${id}/cancel`, {
        cancellationReason,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trial-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['trial-requests'] });
    },
  });
}

/**
 * Extend a trial request by 7 days
 * PATCH /api/v1/trial-requests/:id/extend
 */
export function useExtendTrialRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/trial-requests/${id}/extend`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['trial-request', id] });
      queryClient.invalidateQueries({ queryKey: ['trial-requests'] });
    },
  });
}

/**
 * Get student's own requests (trial + session) - unified view
 * GET /api/v1/session-requests/my-requests
 * Requires authentication
 */
export function useMyRequests(filters?: {
  page?: number;
  limit?: number;
  requestType?: 'TRIAL' | 'SESSION';
  status?: TRIAL_REQUEST_STATUS;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['my-requests', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/session-requests/my-requests', {
        params: filters,
      });
      return data;
    },
    enabled: isAuthenticated,
  });
}

// ========================
// Tutor Hooks
// ========================

/**
 * Get available trial requests matching tutor's subjects
 * GET /api/v1/trial-requests/available
 */
export function useAvailableTrialRequests(filters?: {
  page?: number;
  limit?: number;
  subject?: string;
}) {
  return useQuery({
    queryKey: ['trial-requests', 'available', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/trial-requests/available', {
        params: filters,
      });
      return data;
    },
  });
}

/**
 * Get tutor's accepted trial requests
 * GET /api/v1/trial-requests/my-accepted
 */
export function useMyAcceptedTrialRequests(filters?: {
  page?: number;
  limit?: number;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['trial-requests', 'my-accepted', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/trial-requests/my-accepted', {
        params: filters,
      });
      return data;
    },
    // Only fetch if user is authenticated and is a TUTOR
    enabled: isAuthenticated && isTutor,
  });
}

/**
 * Accept a trial request (creates chat between tutor and student)
 * PATCH /api/v1/trial-requests/:id/accept
 */
export function useAcceptTrialRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      introductoryMessage,
    }: {
      id: string;
      introductoryMessage?: string;
    }) => {
      const { data } = await apiClient.patch(`/trial-requests/${id}/accept`, {
        introductoryMessage,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trial-requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

// ========================
// Unified Request Types (SESSION + TRIAL)
// ========================

export interface UnifiedRequest {
  _id: string;
  requestType: 'SESSION' | 'TRIAL';
  studentId?: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  studentInfo?: StudentInfo;
  subject: {
    _id: string;
    name: string;
  };
  gradeLevel: string;
  schoolType: string;
  description: string;
  learningGoals?: string;
  preferredDateTime?: string;
  documents?: string[];
  status: string;
  acceptedTutorId?: string;
  chatId?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get matching requests for tutor (both SESSION and TRIAL)
 * GET /api/v1/session-requests/matching
 * Uses MongoDB $unionWith to combine both collections
 */
export function useMatchingRequests(filters?: {
  page?: number;
  limit?: number;
  requestType?: 'SESSION' | 'TRIAL';
}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['matching-requests', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/session-requests/matching', {
        params: filters,
      });
      return data as {
        data: UnifiedRequest[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPage: number;
        };
      };
    },
    enabled: isAuthenticated && user?.role === 'TUTOR',
  });
}

/**
 * Accept a session request (creates chat between tutor and student)
 * PATCH /api/v1/session-requests/:id/accept
 */
export function useAcceptSessionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      introductoryMessage,
    }: {
      id: string;
      introductoryMessage?: string;
    }) => {
      const { data } = await apiClient.patch(`/session-requests/${id}/accept`, {
        introductoryMessage,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matching-requests'] });
      queryClient.invalidateQueries({ queryKey: ['session-requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}