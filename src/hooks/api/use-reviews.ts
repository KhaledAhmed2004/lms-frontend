import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface SessionReview {
  _id: string;
  sessionId: string;
  studentId: string | {
    _id: string;
    name: string;
    avatar?: string;
  };
  tutorId: string | {
    _id: string;
    name: string;
    avatar?: string;
  };
  overallRating: number;
  teachingQuality: number;
  communication: number;
  punctuality: number;
  preparedness: number;
  comment?: string;
  wouldRecommend: boolean;
  isPublic: boolean;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  sessionId: string;
  overallRating: number;
  teachingQuality: number;
  communication: number;
  punctuality: number;
  preparedness: number;
  comment?: string;
  wouldRecommend: boolean;
  isPublic?: boolean;
}

export interface UpdateReviewData {
  overallRating?: number;
  teachingQuality?: number;
  communication?: number;
  punctuality?: number;
  preparedness?: number;
  comment?: string;
  wouldRecommend?: boolean;
  isPublic?: boolean;
}

export interface ReviewStats {
  tutorId: string;
  totalReviews: number;
  averageOverallRating: number;
  averageTeachingQuality: number;
  averageCommunication: number;
  averagePunctuality: number;
  averagePreparedness: number;
  wouldRecommendPercentage: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  data: SessionReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Student Hooks

// Create Review
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const { data: response } = await apiClient.post('/reviews', data);
      return response.data as SessionReview;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'completed'] });
      // Invalidate tutor reviews if we know the tutor
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
    },
  });
}

// Get My Reviews (Student)
export function useMyReviews(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['my-reviews', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/reviews/my-reviews', {
        params: { page, limit },
      });
      return data as ReviewsResponse;
    },
    enabled: isAuthenticated && isStudent,
  });
}

// Update Review
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReviewData }) => {
      const { data: response } = await apiClient.patch(`/reviews/${id}`, data);
      return response.data as SessionReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
    },
  });
}

// Delete Review
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
    },
  });
}

// Public/Tutor Hooks

// Get Tutor Reviews
export function useTutorReviews(tutorId: string, page = 1, limit = 10) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['tutor-reviews', tutorId, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/reviews/tutor/${tutorId}`, {
        params: { page, limit },
      });
      return data as ReviewsResponse;
    },
    enabled: isAuthenticated && !!tutorId,
  });
}

// Get Tutor Review Stats
export function useTutorReviewStats(tutorId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['tutor-review-stats', tutorId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/reviews/tutor/${tutorId}/stats`);
      return data.data as ReviewStats;
    },
    enabled: isAuthenticated && !!tutorId,
  });
}

// Get Single Review
export function useReview(id: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/reviews/${id}`);
      return data.data as SessionReview;
    },
    enabled: isAuthenticated && !!id,
  });
}

// Admin Hooks

// Toggle Review Visibility
export function useToggleReviewVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { data } = await apiClient.patch(`/reviews/${id}/visibility`, { isPublic });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
    },
  });
}

// Admin Create Review (without session requirement)
export interface AdminCreateReviewData {
  tutorId: string;
  overallRating: number;
  teachingQuality: number;
  communication: number;
  punctuality: number;
  preparedness: number;
  comment?: string;
  wouldRecommend: boolean;
  isPublic?: boolean;
  reviewerName?: string;
}

export function useAdminCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AdminCreateReviewData) => {
      const { data: response } = await apiClient.post('/reviews/admin', data);
      return response.data as SessionReview;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews', variables.tutorId] });
      queryClient.invalidateQueries({ queryKey: ['tutor-review-stats', variables.tutorId] });
    },
  });
}

// Admin Update Any Review
export function useAdminUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReviewData & { reviewerName?: string } }) => {
      const { data: response } = await apiClient.patch(`/reviews/admin/${id}`, data);
      return response.data as SessionReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-review-stats'] });
    },
  });
}

// Admin Delete Any Review
export function useAdminDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/reviews/admin/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['tutor-review-stats'] });
    },
  });
}
