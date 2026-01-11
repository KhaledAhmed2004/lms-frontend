import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Enums
export enum TICKET_CATEGORY {
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  PAYMENT_BILLING = 'PAYMENT_BILLING',
  SESSION_PROBLEM = 'SESSION_PROBLEM',
  ACCOUNT_ISSUE = 'ACCOUNT_ISSUE',
  SCHEDULING = 'SCHEDULING',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  OTHER = 'OTHER',
}

export enum TICKET_STATUS {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TICKET_PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Display labels for categories
export const TICKET_CATEGORY_LABELS: Record<TICKET_CATEGORY, string> = {
  [TICKET_CATEGORY.TECHNICAL_ISSUE]: 'Technical Issue',
  [TICKET_CATEGORY.PAYMENT_BILLING]: 'Payment & Billing',
  [TICKET_CATEGORY.SESSION_PROBLEM]: 'Session Problem',
  [TICKET_CATEGORY.ACCOUNT_ISSUE]: 'Account Issue',
  [TICKET_CATEGORY.SCHEDULING]: 'Scheduling',
  [TICKET_CATEGORY.FEATURE_REQUEST]: 'Feature Request',
  [TICKET_CATEGORY.OTHER]: 'Other',
};

export const TICKET_STATUS_LABELS: Record<TICKET_STATUS, string> = {
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
};

export const TICKET_PRIORITY_LABELS: Record<TICKET_PRIORITY, string> = {
  [TICKET_PRIORITY.LOW]: 'Low',
  [TICKET_PRIORITY.MEDIUM]: 'Medium',
  [TICKET_PRIORITY.HIGH]: 'High',
  [TICKET_PRIORITY.URGENT]: 'Urgent',
};

export const TICKET_STATUS_COLORS: Record<TICKET_STATUS, string> = {
  [TICKET_STATUS.OPEN]: 'bg-blue-100 text-blue-800',
  [TICKET_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TICKET_STATUS.RESOLVED]: 'bg-green-100 text-green-800',
  [TICKET_STATUS.CLOSED]: 'bg-gray-100 text-gray-800',
};

export const TICKET_PRIORITY_COLORS: Record<TICKET_PRIORITY, string> = {
  [TICKET_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [TICKET_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TICKET_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [TICKET_PRIORITY.URGENT]: 'bg-red-100 text-red-800',
};

// Types
export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    phone?: string;
  };
  userRole: 'STUDENT' | 'TUTOR';
  category: TICKET_CATEGORY;
  subject: string;
  message: string;
  attachments?: string[];
  status: TICKET_STATUS;
  priority: TICKET_PRIORITY;
  adminNotes?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketCategory {
  value: TICKET_CATEGORY;
  label: string;
}

export interface CreateTicketData {
  category: TICKET_CATEGORY;
  subject: string;
  message: string;
  attachments?: string[];
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  status?: TICKET_STATUS;
  category?: TICKET_CATEGORY;
  priority?: TICKET_PRIORITY;
  searchTerm?: string;
}

export interface TicketsResponse {
  data: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  recentTickets: number;
  statusDistribution: { _id: TICKET_STATUS; count: number }[];
  categoryDistribution: { _id: TICKET_CATEGORY; count: number }[];
  priorityDistribution: { _id: TICKET_PRIORITY; count: number }[];
}

// ============ USER HOOKS (Student/Tutor) ============

// Get ticket categories for dropdown
export function useTicketCategories() {
  return useQuery({
    queryKey: ['ticketCategories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/support-tickets/categories');
      return data.data as TicketCategory[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours cache
  });
}

// Create a new support ticket
export function useCreateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketData) => {
      const { data } = await apiClient.post('/support-tickets', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
  });
}

// Get my tickets
export function useMyTickets(filters: TicketFilters = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['myTickets', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const { data } = await apiClient.get(`/support-tickets/my-tickets?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as TicketsResponse;
    },
    enabled: isAuthenticated,
  });
}

// Get single ticket (user's own)
export function useMyTicket(ticketId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['myTickets', ticketId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/support-tickets/my-tickets/${ticketId}`);
      return data.data as SupportTicket;
    },
    enabled: isAuthenticated && !!ticketId,
  });
}

// ============ ADMIN HOOKS ============

// Get all tickets (admin)
export function useAdminTickets(filters: TicketFilters = {}) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminTickets', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);

      const { data } = await apiClient.get(`/support-tickets/admin?${params}`);
      return {
        data: data.data,
        pagination: data.pagination,
      } as TicketsResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Get single ticket (admin)
export function useAdminTicket(ticketId: string) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['adminTickets', ticketId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/support-tickets/admin/${ticketId}`);
      return data.data as SupportTicket;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN' && !!ticketId,
  });
}

// Get ticket stats (admin dashboard)
export function useTicketStats() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['ticketStats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/support-tickets/admin/stats');
      return data.data as TicketStats;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Update ticket status (admin)
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
      adminNotes,
    }: {
      ticketId: string;
      status: TICKET_STATUS;
      adminNotes?: string;
    }) => {
      const { data } = await apiClient.patch(`/support-tickets/admin/${ticketId}/status`, {
        status,
        adminNotes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketStats'] });
    },
  });
}

// Update ticket priority (admin)
export function useUpdateTicketPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      priority,
    }: {
      ticketId: string;
      priority: TICKET_PRIORITY;
    }) => {
      const { data } = await apiClient.patch(`/support-tickets/admin/${ticketId}/priority`, {
        priority,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
}

// Assign ticket (admin)
export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      assignedTo,
    }: {
      ticketId: string;
      assignedTo: string;
    }) => {
      const { data } = await apiClient.patch(`/support-tickets/admin/${ticketId}/assign`, {
        assignedTo,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
}

// Add admin notes (admin)
export function useAddAdminNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      adminNotes,
    }: {
      ticketId: string;
      adminNotes: string;
    }) => {
      const { data } = await apiClient.patch(`/support-tickets/admin/${ticketId}/notes`, {
        adminNotes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
}
