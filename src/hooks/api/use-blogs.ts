import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface Blog {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  featuredImage: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: 'draft' | 'published';
  category?: string;
}

export interface BlogsResponse {
  data: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

type CreateBlogPayload = {
  title: string;
  content: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  featuredImage?: File;
};

type UpdateBlogPayload = {
  id: string;
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
  category?: string;
  tags?: string[];
  featuredImage?: File;
};

// ============ ADMIN HOOKS ============

// Get All Blogs with Filters (Admin)
export function useAdminBlogs(filters: BlogFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminBlogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const { data } = await apiClient.get(`/blogs?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as BlogsResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Get Single Blog by ID
export function useBlog(blogId: string | undefined) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blogs/${blogId}`);
      return data.data as Blog;
    },
    enabled: isAuthenticated && !!blogId,
  });
}

// Create Blog
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlogPayload) => {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('content', payload.content);
      formData.append('status', payload.status);
      formData.append('category', payload.category);
      payload.tags.forEach(tag => formData.append('tags', tag));

      if (payload.featuredImage) {
        formData.append('featuredImage', payload.featuredImage);
      }

      const { data } = await apiClient.post('/blogs', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

// Update Blog
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBlogPayload) => {
      const formData = new FormData();
      if (payload.title !== undefined) formData.append('title', payload.title);
      if (payload.content !== undefined) formData.append('content', payload.content);
      if (payload.status !== undefined) formData.append('status', payload.status);
      if (payload.category !== undefined) formData.append('category', payload.category);
      if (payload.tags) payload.tags.forEach(tag => formData.append('tags', tag));

      if (payload.featuredImage) {
        formData.append('featuredImage', payload.featuredImage);
      }

      const { data } = await apiClient.patch(`/blogs/${id}`, formData);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
  });
}

// Delete Blog
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/blogs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}
