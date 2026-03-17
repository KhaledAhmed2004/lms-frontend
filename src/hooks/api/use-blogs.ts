import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type CreateBlogPayload = {
  title: string;
  content: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  featuredImage?: File;
};

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

      const { data } = await apiClient.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}
