import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface SchoolType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolTypeFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface SchoolTypesResponse {
  data: SchoolType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// Get All School Types (Public - No token required)
export function useSchoolTypes() {
  return useQuery({
    queryKey: ['schoolTypes'],
    queryFn: async () => {
      const { data } = await apiClient.get('/school-types');
      return data.data as SchoolType[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Get Active School Types Only (Public - No token required)
export function useActiveSchoolTypes() {
  return useQuery({
    queryKey: ['schoolTypes', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/school-types/active');
      return data.data as SchoolType[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get Single School Type (Public - No token required)
export function useSchoolType(schoolTypeId: string) {
  return useQuery({
    queryKey: ['schoolTypes', schoolTypeId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/school-types/${schoolTypeId}`);
      return data.data as SchoolType;
    },
    enabled: !!schoolTypeId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ ADMIN HOOKS ============

// Get All School Types with Filters (Admin - with pagination)
export function useAdminSchoolTypes(filters: SchoolTypeFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminSchoolTypes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const { data } = await apiClient.get(`/school-types?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as SchoolTypesResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Create School Type - Admin Only
export function useCreateSchoolType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; isActive?: boolean }) => {
      const { data } = await apiClient.post('/school-types', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchoolTypes'] });
      queryClient.invalidateQueries({ queryKey: ['schoolTypes'] });
    },
  });
}

// Update School Type - Admin Only
export function useUpdateSchoolType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; name?: string; isActive?: boolean }) => {
      const { data } = await apiClient.patch(`/school-types/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchoolTypes'] });
      queryClient.invalidateQueries({ queryKey: ['schoolTypes'] });
    },
  });
}

// Delete School Type - Admin Only (Soft delete)
export function useDeleteSchoolType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/school-types/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSchoolTypes'] });
      queryClient.invalidateQueries({ queryKey: ['schoolTypes'] });
    },
  });
}
