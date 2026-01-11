import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ Types ============

export type AdminApplicationStatus =
  | 'SUBMITTED'
  | 'REVISION'
  | 'RESUBMITTED'
  | 'SELECTED_FOR_INTERVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface AdminApplication {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  cv: string;
  abiturCertificate: string;
  officialId: string;
  subjects: Array<{ name: string }>;
  status: AdminApplicationStatus;
  rejectionReason?: string;
  revisionNote?: string;
  adminNotes?: string;
  submittedAt: string;
  selectedForInterviewAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  revisionRequestedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminApplicationsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: AdminApplication[];
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: AdminApplicationStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============ Hooks ============

/**
 * Get all applications (Admin only)
 * With filtering, searching, pagination
 */
export function useAdminApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: ['adminApplications', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/applications', { params: filters });
      // Backend returns { success: true, data: [...], pagination: {...} }
      return {
        meta: data.pagination,
        data: data.data,
      } as AdminApplicationsResponse;
    },
    staleTime: 1 * 60 * 1000, // 1 min cache
  });
}

/**
 * Get single application by ID (Admin only)
 */
export function useAdminApplication(id: string) {
  return useQuery({
    queryKey: ['adminApplication', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/applications/${id}`);
      return data.data as AdminApplication;
    },
    enabled: !!id,
  });
}

/**
 * Select application for interview (Admin only)
 */
export function useSelectForInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes?: string }) => {
      const { data } = await apiClient.patch(`/applications/${id}/select-for-interview`, {
        adminNotes,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminApplication', variables.id] });
    },
  });
}

/**
 * Approve application (Admin only)
 * Changes user role to TUTOR
 */
export function useApproveApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes?: string }) => {
      const { data } = await apiClient.patch(`/applications/${id}/approve`, {
        adminNotes,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminApplication', variables.id] });
    },
  });
}

/**
 * Reject application (Admin only)
 */
export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      const { data } = await apiClient.patch(`/applications/${id}/reject`, {
        rejectionReason,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminApplication', variables.id] });
    },
  });
}

/**
 * Send application for revision (Admin only)
 */
export function useSendForRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, revisionNote }: { id: string; revisionNote: string }) => {
      const { data } = await apiClient.patch(`/applications/${id}/revision`, {
        revisionNote,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminApplication', variables.id] });
    },
  });
}

/**
 * Delete application (Admin only)
 */
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/applications/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
    },
  });
}