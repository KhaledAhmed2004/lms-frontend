import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export interface Tutor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  profilePicture?: string;
  tutorProfile?: {
    address?: string;
    birthDate?: string;
    subjects?: Array<{ _id: string; name: string }>;
    bio?: string;
    languages?: string[];
    teachingExperience?: string;
    education?: string;
    cvUrl?: string;
    abiturCertificateUrl?: string;
    educationProofUrls?: string[];
    totalSessions?: number;
    completedSessions?: number;
    totalHoursTaught?: number;
    totalStudents?: number;
    level?: 'STARTER' | 'INTERMEDIATE' | 'EXPERT';
    totalEarnings?: number;
    isVerified?: boolean;
    verificationStatus?: string;
  };
  status: 'ACTIVE' | 'RESTRICTED';
  createdAt: string;
  updatedAt: string;
}

export interface TutorFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}

export interface TutorsResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  data: Tutor[];
}

// Get All Tutors - Admin Only
export function useTutors(filters: TutorFilters = {}) {
  return useQuery({
    queryKey: ['tutors', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/user/tutors', { params: filters });
      // Backend returns { success: true, data: [...], pagination: {...} }
      return {
        meta: data.pagination,
        data: data.data,
      } as TutorsResponse;
    },
    staleTime: 1 * 60 * 1000,
  });
}

// Get Single Tutor - Admin Only
export function useTutor(tutorId: string) {
  return useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/user/${tutorId}`);
      return data.data as Tutor;
    },
    enabled: !!tutorId,
  });
}

// Get Tutor Statistics - For Tutor Dashboard
export function useTutorStatistics() {
  return useQuery({
    queryKey: ['tutor-statistics'],
    queryFn: async () => {
      const { data } = await apiClient.get('/user/my-statistics');
      return data.data as {
        totalEarnings: number;
        totalStudents: number;
        totalSessions: number;
        averageRating: number;
        completedSessions: number;
        upcomingSessions: number;
      };
    },
  });
}

// Block Tutor - Admin Only
export function useBlockTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tutorId: string) => {
      const { data } = await apiClient.patch(`/user/tutors/${tutorId}/block`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
}

// Unblock Tutor - Admin Only
export function useUnblockTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tutorId: string) => {
      const { data } = await apiClient.patch(`/user/tutors/${tutorId}/unblock`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
}

// Update Tutor Subjects - Admin Only
export function useUpdateTutorSubjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tutorId,
      subjects,
    }: {
      tutorId: string;
      subjects: string[];
    }) => {
      const { data } = await apiClient.patch(`/user/tutors/${tutorId}/subjects`, {
        subjects,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
}

// Admin Update Tutor Profile - Admin Only
export interface AdminUpdateTutorProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  tutorProfile?: {
    address?: string;
    birthDate?: string;
    bio?: string;
    languages?: string[];
    teachingExperience?: string;
    education?: string;
    subjects?: string[];
  };
}

export function useAdminUpdateTutorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tutorId,
      payload,
    }: {
      tutorId: string;
      payload: AdminUpdateTutorProfilePayload;
    }) => {
      const { data } = await apiClient.patch(`/user/tutors/${tutorId}/profile`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      queryClient.invalidateQueries({ queryKey: ['tutor', variables.tutorId] });
    },
  });
}