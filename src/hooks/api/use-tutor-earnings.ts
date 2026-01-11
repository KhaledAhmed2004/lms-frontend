import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// ============ TYPES ============

export type TutorLevel = 'STARTER' | 'INTERMEDIATE' | 'EXPERT';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PayoutSettings {
  recipient: string;
  iban: string;
}

export interface TutorStats {
  level: {
    current: number;
    name: TutorLevel;
    hourlyRate: number;
  };
  nextLevel: {
    level: number;
    name: TutorLevel;
    hourlyRate: number;
    sessionsNeeded: number;
    progressPercent: number;
  } | null;
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalHours: number;
    totalStudents: number;
  };
  earnings: {
    currentMonth: number;
    totalEarnings: number;
    pendingPayout: number;
  };
  trialStats: {
    totalTrials: number;
    convertedTrials: number;
    conversionRate: number;
  };
}

export interface EarningsHistoryItem {
  id: string;
  period: string;
  sessions: number;
  hours: number;
  grossEarnings: number;
  netEarnings: number;
  status: PayoutStatus;
  payoutReference: string;
  paidAt?: string;
}

export interface EarningsHistoryResponse {
  data: EarningsHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ HOOKS ============

/**
 * Get tutor's comprehensive stats including level progress
 */
export function useTutorStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['tutor-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/earnings/my-stats');
      return data.data as TutorStats;
    },
    enabled: isAuthenticated && isTutor,
  });
}

/**
 * Get tutor's payout settings (IBAN, recipient)
 */
export function usePayoutSettings() {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['payout-settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/earnings/payout-settings');
      return data.data as PayoutSettings;
    },
    enabled: isAuthenticated && isTutor,
  });
}

/**
 * Update tutor's payout settings
 */
export function useUpdatePayoutSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PayoutSettings) => {
      const { data } = await apiClient.patch('/earnings/payout-settings', payload);
      return data.data as PayoutSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payout-settings'] });
    },
  });
}

/**
 * Get tutor's earnings history (formatted for frontend)
 */
export function useEarningsHistory(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isTutor = user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['earnings-history', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/earnings/history', {
        params: { page, limit },
      });
      return {
        data: data.data as EarningsHistoryItem[],
        pagination: {
          page: data.pagination?.page || page,
          limit: data.pagination?.limit || limit,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        },
      } as EarningsHistoryResponse;
    },
    enabled: isAuthenticated && isTutor,
  });
}

// ============ CONSTANTS ============

export const LEVEL_DISPLAY_NAMES: Record<TutorLevel, string> = {
  STARTER: 'Level 1',
  INTERMEDIATE: 'Level 2',
  EXPERT: 'Level 3',
};

export const LEVEL_NUMBERS: Record<TutorLevel, number> = {
  STARTER: 1,
  INTERMEDIATE: 2,
  EXPERT: 3,
};

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};
