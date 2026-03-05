import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ============ TYPES ============

export interface ExportUsersParams {
  role?: string;
}

export interface ExportApplicationsParams {
  status?: string;
}

export interface ExportSessionsParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExportBillingsParams {
  status?: string;
  year?: number;
  month?: number;
}

export interface ExportEarningsParams {
  status?: string;
  year?: number;
  month?: number;
}

export interface ExportSubscriptionsParams {
  status?: string;
}

export interface ExportTrialRequestsParams {
  status?: string;
}

// ============ DOWNLOAD HELPER ============

const downloadCSV = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const fetchCSV = async (
  endpoint: string,
  params: Record<string, any>,
  filename: string,
) => {
  const { data } = await apiClient.get(endpoint, {
    params,
    responseType: 'blob',
    headers: { Accept: 'text/csv' },
  });
  downloadCSV(data, filename);
};

// ============ HOOKS ============

export function useExportUsers() {
  return useMutation({
    mutationFn: (params: ExportUsersParams = {}) =>
      fetchCSV('/admin/export/users', params, 'users.csv'),
  });
}

export function useExportApplications() {
  return useMutation({
    mutationFn: (params: ExportApplicationsParams = {}) =>
      fetchCSV('/admin/export/applications', params, 'applications.csv'),
  });
}

export function useExportSessions() {
  return useMutation({
    mutationFn: (params: ExportSessionsParams = {}) =>
      fetchCSV('/admin/export/sessions', params, 'sessions.csv'),
  });
}

export function useExportBillings() {
  return useMutation({
    mutationFn: (params: ExportBillingsParams = {}) =>
      fetchCSV('/admin/export/billings', params, 'billings.csv'),
  });
}

export function useExportEarnings() {
  return useMutation({
    mutationFn: (params: ExportEarningsParams = {}) =>
      fetchCSV('/admin/export/earnings', params, 'earnings.csv'),
  });
}

export function useExportSubscriptions() {
  return useMutation({
    mutationFn: (params: ExportSubscriptionsParams = {}) =>
      fetchCSV('/admin/export/subscriptions', params, 'subscriptions.csv'),
  });
}

export function useExportTrialRequests() {
  return useMutation({
    mutationFn: (params: ExportTrialRequestsParams = {}) =>
      fetchCSV('/admin/export/trial-requests', params, 'trial-requests.csv'),
  });
}
