import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface PricingPlan {
  name: string;
  tier: 'FLEXIBLE' | 'REGULAR' | 'LONG_TERM';
  pricePerHour: number;
  courseDuration: string;
  commitmentMonths: number;
  minimumHours: number;
  selectedHours: string;
  selectedHoursDetails: string;
  termType: string;
  inclusions: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface PricingConfig {
  _id: string;
  plans: PricingPlan[];
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ PUBLIC HOOKS ============

/**
 * Get active pricing plans (for homepage)
 * Public - No authentication required
 */
export function usePricingPlans() {
  return useQuery({
    queryKey: ['pricing', 'plans'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pricing/plans');
      return data.data as PricingPlan[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// ============ ADMIN HOOKS ============

/**
 * Get full pricing config (Admin only)
 */
export function useAdminPricingConfig() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['pricing', 'config'],
    queryFn: async () => {
      const { data } = await apiClient.get('/pricing/config');
      return data.data as PricingConfig;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

/**
 * Update full pricing config (Admin only)
 */
export function useUpdatePricingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plans: PricingPlan[]) => {
      const { data } = await apiClient.put('/pricing/config', { plans });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
  });
}

/**
 * Update single plan (Admin only)
 */
export function useUpdateSinglePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tier,
      updates,
    }: {
      tier: 'FLEXIBLE' | 'REGULAR' | 'LONG_TERM';
      updates: Partial<PricingPlan>;
    }) => {
      const { data } = await apiClient.patch(`/pricing/plans/${tier}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
  });
}

/**
 * Reset to default pricing (Admin only)
 */
export function useResetPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/pricing/reset');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
  });
}
