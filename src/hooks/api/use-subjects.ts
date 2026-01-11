import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface Subject {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface SubjectsResponse {
  data: Subject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Get All Subjects (Public - No token required)
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await apiClient.get('/subjects');
      return data.data as Subject[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Get Active Subjects Only (Public - No token required)
export function useActiveSubjects() {
  return useQuery({
    queryKey: ['subjects', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/subjects/active');
      return data.data as Subject[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get Single Subject (Public - No token required)
export function useSubject(subjectId: string) {
  return useQuery({
    queryKey: ['subjects', subjectId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/subjects/${subjectId}`);
      return data.data as Subject;
    },
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ ADMIN HOOKS ============

// Get All Subjects with Filters (Admin - with pagination)
export function useAdminSubjects(filters: SubjectFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminSubjects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const { data } = await apiClient.get(`/subjects?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as SubjectsResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Create Subject - Admin Only
export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; isActive?: boolean }) => {
      const { data } = await apiClient.post('/subjects', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

// Update Subject - Admin Only
export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; isActive?: boolean }) => {
      const { data } = await apiClient.patch(`/subjects/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

// Delete Subject - Admin Only (Soft delete)
export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/subjects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSubjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}