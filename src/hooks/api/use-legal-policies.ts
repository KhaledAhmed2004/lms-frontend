import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Policy types enum matching backend
export enum POLICY_TYPE {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_FOR_STUDENTS = 'TERMS_FOR_STUDENTS',
  TERMS_FOR_TUTORS = 'TERMS_FOR_TUTORS',
  CANCELLATION_POLICY = 'CANCELLATION_POLICY',
  LEGAL_NOTICE = 'LEGAL_NOTICE',
  COOKIE_POLICY = 'COOKIE_POLICY',
}

// Policy type labels for display
export const POLICY_TYPE_LABELS: Record<POLICY_TYPE, string> = {
  [POLICY_TYPE.PRIVACY_POLICY]: 'Privacy Policy',
  [POLICY_TYPE.TERMS_FOR_STUDENTS]: 'Terms for Students',
  [POLICY_TYPE.TERMS_FOR_TUTORS]: 'Terms for Tutors',
  [POLICY_TYPE.CANCELLATION_POLICY]: 'Cancellation Policy',
  [POLICY_TYPE.LEGAL_NOTICE]: 'Legal Notice',
  [POLICY_TYPE.COOKIE_POLICY]: 'Cookie Policy',
};

export interface LegalPolicy {
  _id: string;
  type: POLICY_TYPE;
  title: string;
  content: string;
  isActive: boolean;
  lastUpdatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertPolicyPayload {
  title?: string;
  content: string;
  isActive?: boolean;
}

// Get all policies (admin)
export function useLegalPolicies() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['legal-policies'],
    queryFn: async () => {
      const { data } = await apiClient.get('/legal-policies');
      return data.data as LegalPolicy[];
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Get single policy by type (admin)
export function useLegalPolicy(type: POLICY_TYPE) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['legal-policy', type],
    queryFn: async () => {
      const { data } = await apiClient.get(`/legal-policies/${type}`);
      return data.data as LegalPolicy | null;
    },
    enabled: isAuthenticated && isAdmin && !!type,
  });
}

// Get active policy by type (public)
export function usePublicLegalPolicy(type: POLICY_TYPE) {
  return useQuery({
    queryKey: ['public-legal-policy', type],
    queryFn: async () => {
      const { data } = await apiClient.get(`/legal-policies/public/${type}`);
      return data.data as LegalPolicy | null;
    },
    enabled: !!type,
  });
}

// Get all active policies (public)
export function usePublicLegalPolicies() {
  return useQuery({
    queryKey: ['public-legal-policies'],
    queryFn: async () => {
      const { data } = await apiClient.get('/legal-policies/public');
      return data.data as LegalPolicy[];
    },
  });
}

// Upsert (create or update) policy
export function useUpsertLegalPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, payload }: { type: POLICY_TYPE; payload: UpsertPolicyPayload }) => {
      const { data } = await apiClient.put(`/legal-policies/${type}`, payload);
      return data.data as LegalPolicy;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['legal-policies'] });
      queryClient.invalidateQueries({ queryKey: ['legal-policy', variables.type] });
      queryClient.invalidateQueries({ queryKey: ['public-legal-policies'] });
      queryClient.invalidateQueries({ queryKey: ['public-legal-policy', variables.type] });
    },
  });
}

// Update policy
export function useUpdateLegalPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, payload }: { type: POLICY_TYPE; payload: Partial<UpsertPolicyPayload> }) => {
      const { data } = await apiClient.patch(`/legal-policies/${type}`, payload);
      return data.data as LegalPolicy;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['legal-policies'] });
      queryClient.invalidateQueries({ queryKey: ['legal-policy', variables.type] });
      queryClient.invalidateQueries({ queryKey: ['public-legal-policies'] });
      queryClient.invalidateQueries({ queryKey: ['public-legal-policy', variables.type] });
    },
  });
}

// Delete policy (soft delete)
export function useDeleteLegalPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: POLICY_TYPE) => {
      const { data } = await apiClient.delete(`/legal-policies/${type}`);
      return data.data as LegalPolicy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-policies'] });
      queryClient.invalidateQueries({ queryKey: ['public-legal-policies'] });
    },
  });
}

// Initialize default policies
export function useInitializeLegalPolicies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/legal-policies/initialize');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-policies'] });
    },
  });
}
