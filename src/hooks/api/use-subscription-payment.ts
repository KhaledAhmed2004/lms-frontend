import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export type SubscriptionTier = 'FLEXIBLE' | 'REGULAR' | 'LONG_TERM';

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  subscriptionId: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentData {
  subscriptionId: string;
  paymentIntentId: string;
}

export interface SubscriptionDetails {
  _id: string;
  studentId: string;
  tier: SubscriptionTier;
  pricePerHour: number;
  commitmentMonths: number;
  minimumHours: number;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  totalHoursTaken: number;
  stripePaymentIntentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Tier details for display
export const SUBSCRIPTION_TIERS = {
  FLEXIBLE: {
    name: 'Flexible',
    pricePerHour: 30,
    commitmentMonths: 0,
    minimumHours: 0,
    description: 'No commitment, pay as you go',
    features: ['No minimum hours', 'Cancel anytime', 'Pay per session'],
  },
  REGULAR: {
    name: 'Regular',
    pricePerHour: 28,
    commitmentMonths: 1,
    minimumHours: 4,
    description: '1 month commitment, save 7%',
    features: ['Minimum 4 hours/month', '1 month commitment', '7% savings'],
  },
  LONG_TERM: {
    name: 'Long Term',
    pricePerHour: 25,
    commitmentMonths: 3,
    minimumHours: 4,
    description: '3 months commitment, save 17%',
    features: ['Minimum 4 hours/month', '3 months commitment', '17% savings'],
  },
};

// Create Payment Intent for subscription
export function useCreateSubscriptionPaymentIntent() {
  return useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      const { data } = await apiClient.post('/subscriptions/create-payment-intent', { tier });
      return data.data as CreatePaymentIntentResponse;
    },
  });
}

// Confirm payment and activate subscription
export function useConfirmSubscriptionPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ConfirmPaymentData) => {
      const { data: response } = await apiClient.post('/subscriptions/confirm-payment', data);
      return response.data as SubscriptionDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['plan-usage'] });
    },
  });
}

// Subscribe to a plan (creates subscription)
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      const { data } = await apiClient.post('/subscriptions/subscribe', { tier });
      return data.data as SubscriptionDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    },
  });
}

// Get subscription payment history
export function useSubscriptionPaymentHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
      const { data } = await apiClient.get('/subscriptions/payment-history', {
        params: { page, limit },
      });
      return data;
    },
  });
}
