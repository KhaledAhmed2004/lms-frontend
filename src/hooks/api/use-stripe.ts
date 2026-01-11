import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface StripeAccount {
  accountId: string;
  accountType: 'express' | 'standard';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  createdAt: string;
}

export interface OnboardingStatus {
  hasStripeAccount: boolean;
  isOnboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  accountId?: string;
}

export interface CreateAccountResponse {
  accountId: string;
  onboardingUrl: string;
}

// Create Stripe Connect Account (Tutor/Applicant)
export function useCreateStripeAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountType: 'express' | 'standard' = 'express') => {
      const { data } = await apiClient.post('/payments/stripe/account', { accountType });
      return data.data as CreateAccountResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-onboarding-status'] });
    },
  });
}

// Get Onboarding Link (Tutor/Applicant)
export function useGetOnboardingLink() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.get('/payments/stripe/onboarding');
      return data.data as { onboarding_url: string };
    },
  });
}

// Get Stripe Onboarding Status
export function useStripeOnboardingStatus() {
  const { isAuthenticated, user } = useAuthStore();
  const isTutorOrApplicant = user?.role === 'TUTOR' || user?.role === 'APPLICANT';

  return useQuery({
    queryKey: ['stripe-onboarding-status'],
    queryFn: async () => {
      const { data } = await apiClient.get('/payments/stripe/onboarding-status');
      return data.data as OnboardingStatus;
    },
    enabled: isAuthenticated && isTutorOrApplicant,
  });
}

// Combined hook for Stripe Connect setup
export function useStripeConnect() {
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useStripeOnboardingStatus();
  const createAccount = useCreateStripeAccount();
  const getOnboardingLink = useGetOnboardingLink();

  const startOnboarding = async () => {
    if (!status?.hasStripeAccount) {
      // Create new account
      const result = await createAccount.mutateAsync('express');
      return result.onboardingUrl;
    } else if (!status?.isOnboardingComplete) {
      // Get onboarding link for existing account
      const result = await getOnboardingLink.mutateAsync();
      return result.onboarding_url;
    }
    return null;
  };

  return {
    status,
    statusLoading,
    refetchStatus,
    startOnboarding,
    isCreatingAccount: createAccount.isPending,
    isGettingLink: getOnboardingLink.isPending,
    error: createAccount.error || getOnboardingLink.error,
  };
}
