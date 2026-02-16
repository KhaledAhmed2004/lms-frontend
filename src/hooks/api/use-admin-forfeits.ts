import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface ForfeitedFeedback {
  _id: string;
  sessionId: {
    _id: string;
    subject: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
  };
  tutorId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate: string;
  paymentForfeited: boolean;
  forfeitedAmount: number;
  forfeitedAt: string;
  createdAt: string;
}

export interface ForfeitSummary {
  monthly: Array<{
    _id: { year: number; month: number };
    totalAmount: number;
    count: number;
  }>;
  grandTotal: {
    total: number;
    count: number;
  };
}

// Hooks
export function useForfeitedPaymentsSummary(month?: number, year?: number) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['forfeited-summary', month, year],
    queryFn: async () => {
      const params: Record<string, number> = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const { data } = await apiClient.get('/tutor-feedback/admin/forfeited-summary', { params });
      return data.data as ForfeitSummary;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

export function useForfeitedFeedbacksList(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['forfeited-list', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/tutor-feedback/admin/forfeited-list', {
        params: { page, limit, sort: '-forfeitedAt' },
      });
      return {
        data: data.data as ForfeitedFeedback[],
        meta: data.pagination as { page: number; limit: number; total: number; totalPages: number },
      };
    },
    enabled: isAuthenticated && isAdmin,
  });
}
