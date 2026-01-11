import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface Grade {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradeFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface GradesResponse {
  data: Grade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Get All Grades (Public - No token required)
export function useGrades() {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data } = await apiClient.get('/grades');
      return data.data as Grade[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Get Active Grades Only (Public - No token required)
export function useActiveGrades() {
  return useQuery({
    queryKey: ['grades', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/grades/active');
      return data.data as Grade[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get Single Grade (Public - No token required)
export function useGrade(gradeId: string) {
  return useQuery({
    queryKey: ['grades', gradeId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/grades/${gradeId}`);
      return data.data as Grade;
    },
    enabled: !!gradeId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ ADMIN HOOKS ============

// Get All Grades with Filters (Admin - with pagination)
export function useAdminGrades(filters: GradeFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminGrades', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const { data } = await apiClient.get(`/grades?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as GradesResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Create Grade - Admin Only
export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; isActive?: boolean }) => {
      const { data } = await apiClient.post('/grades', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGrades'] });
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}

// Update Grade - Admin Only
export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; isActive?: boolean }) => {
      const { data } = await apiClient.patch(`/grades/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGrades'] });
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}

// Delete Grade - Admin Only (Soft delete)
export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/grades/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGrades'] });
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}
