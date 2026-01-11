import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export type SubscriptionTier = 'FLEXIBLE' | 'REGULAR' | 'LONG_TERM';
export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Subscription {
  _id: string;
  studentId: string;
  tier: SubscriptionTier;
  pricePerHour: number;
  commitmentMonths: number;
  minimumHours: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  totalHoursTaken: number;
  stripePaymentIntentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanUsage {
  plan: {
    name: SubscriptionTier | null;
    status: SubscriptionStatus | null;
    pricePerHour: number | null;
    minimumHours: number | null;
    commitmentMonths: number | null;
    startDate: string | null;
    endDate: string | null;
  };
  usage: {
    hoursRemaining: number | null;
    sessionsCompleted: number;
    hoursUsed: number;
    sessionsRemaining: number | null;
  };
  spending: {
    currentMonthSpending: number;
    totalSpending: number;
    bufferCharges: number;
  };
  upcoming: {
    scheduledSessions: number;
    upcomingHours: number;
  };
}

export interface PaymentHistoryItem {
  id: string;
  period: string;
  sessions: number;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  description?: string;
  createdAt: string;
  invoiceUrl?: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface SetupIntentResponse {
  clientSecret: string;
}

// Constants
export const PLAN_DISPLAY_NAMES: Record<SubscriptionTier, string> = {
  FLEXIBLE: 'Flexible',
  REGULAR: 'Regular',
  LONG_TERM: 'Long Term',
};

export const PLAN_DETAILS: Record<SubscriptionTier, { pricePerHour: number; minimumHours: number; commitment: string; features: string[] }> = {
  FLEXIBLE: {
    pricePerHour: 30,
    minimumHours: 0,
    commitment: 'No commitment',
    features: ['No minimum hours', 'Cancel anytime', 'Pay per session'],
  },
  REGULAR: {
    pricePerHour: 28,
    minimumHours: 4,
    commitment: '1 month',
    features: ['Minimum 4 hours/month', '1 month commitment', '7% savings'],
  },
  LONG_TERM: {
    pricePerHour: 25,
    minimumHours: 4,
    commitment: '3 months',
    features: ['Minimum 4 hours/month', '3 months commitment', '17% savings'],
  },
};

export const CARD_BRAND_ICONS: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  default: '💳',
};

// Subscription Hooks

// Get Current Subscription (STUDENT only)
export function useMySubscription() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      const { data } = await apiClient.get('/subscriptions/my-subscription');
      return data.data as Subscription | null;
    },
    // Only fetch if user is a STUDENT
    enabled: isAuthenticated && isStudent,
  });
}

// Get Plan Usage (STUDENT only)
export function usePlanUsage() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['plan-usage'],
    queryFn: async () => {
      const { data } = await apiClient.get('/subscriptions/my-plan-usage');
      return data.data as PlanUsage;
    },
    // Only fetch if user is a STUDENT
    enabled: isAuthenticated && isStudent,
  });
}

// Get Payment History (STUDENT only)
export function usePaymentHistory(page = 1, limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['payment-history', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/subscriptions/payment-history', {
        params: { page, limit },
      });
      // Map backend response to frontend expected format
      return {
        data: data.data,
        pagination: {
          page: data.pagination?.page || page,
          limit: data.pagination?.limit || limit,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPage || data.pagination?.totalPages || 1,
        },
      } as PaymentHistoryResponse;
    },
    // Only fetch if user is a STUDENT
    enabled: isAuthenticated && isStudent,
  });
}

// Cancel Subscription
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/subscriptions/cancel');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    },
  });
}

// Payment Method Hooks

// Get Payment Methods
export function usePaymentMethods() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data } = await apiClient.get('/payment-methods');
      // Backend returns { paymentMethods: [...], defaultPaymentMethodId: "..." }
      return (data.data?.paymentMethods || []) as PaymentMethod[];
    },
    enabled: isAuthenticated && isStudent,
  });
}

// Create Setup Intent (for adding new payment method)
export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/payment-methods/setup-intent');
      return data.data as SetupIntentResponse;
    },
  });
}

// Attach Payment Method
export function useAttachPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentMethodId, setAsDefault = false }: { paymentMethodId: string; setAsDefault?: boolean }) => {
      const { data } = await apiClient.post('/payment-methods/attach', {
        paymentMethodId,
        setAsDefault,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

// Set Default Payment Method
export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const { data } = await apiClient.patch(`/payment-methods/${paymentMethodId}/default`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

// Delete Payment Method
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const { data } = await apiClient.delete(`/payment-methods/${paymentMethodId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}
