import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export interface OERResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  type: string;
  source: string;
  url: string;
  thumbnail?: string;
  author?: string;
  license?: string;
  datePublished?: string;
  keywords?: string[];
}

export interface OERSearchFilters {
  query?: string;
  subject?: string;
  grade?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface OERSearchResponse {
  data: OERResource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface OERFilterOptions {
  subjects: Array<{ id: string; label: string; labelEn: string }>;
  types: Array<{ id: string; label: string }>;
  grades: Array<{ id: string; label: string }>;
}

// Search OER Resources
export function useOERResources(filters: OERSearchFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['oer-resources', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.type) params.append('type', filters.type);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const { data } = await apiClient.get(`/oer-resources/search?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as OERSearchResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Get Filter Options
export function useOERFilterOptions() {
  return useQuery({
    queryKey: ['oer-filter-options'],
    queryFn: async () => {
      const { data } = await apiClient.get('/oer-resources/filters');
      return data.data as OERFilterOptions;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes cache (static data)
  });
}
