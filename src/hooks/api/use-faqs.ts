import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface FAQsResponse {
  data: FAQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// ============ PUBLIC HOOKS ============

// Get Active FAQs (Public - for support page)
export function useActiveFAQs() {
  return useQuery({
    queryKey: ['faqs', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/faqs/active');
      return data.data as FAQ[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============ ADMIN HOOKS ============

// Get All FAQs with Filters (Admin - with pagination)
export function useAdminFAQs(filters: FAQFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminFAQs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const { data } = await apiClient.get(`/faqs?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as FAQsResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Create FAQ - Admin Only
export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { question: string; answer: string; isActive?: boolean }) => {
      const { data } = await apiClient.post('/faqs', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFAQs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

// Update FAQ - Admin Only
export function useUpdateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; question?: string; answer?: string; isActive?: boolean }) => {
      const { data } = await apiClient.patch(`/faqs/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFAQs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

// Delete FAQ - Admin Only
export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/faqs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFAQs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}
