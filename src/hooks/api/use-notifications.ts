import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface Notification {
  _id: string;
  title?: string;
  text: string;
  receiver: string;
  isRead: boolean;
  type?: 'ADMIN' | 'BID' | 'BOOKING' | 'TASK' | 'BID_ACCEPTED' | 'SYSTEM' | 'DELIVERY_SUBMITTED' | 'PAYMENT_PENDING';
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  unreadCount: number;
}

// ============ STUDENT / TUTOR HOOKS ============

// Get All Notifications (Protected - STUDENT or TUTOR only)
export function useNotifications() {
  const { isAuthenticated, user } = useAuthStore();
  const isStudentOrTutor = user?.role === 'STUDENT' || user?.role === 'TUTOR';

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications');
      return data.data as NotificationResponse;
    },
    enabled: isAuthenticated && isStudentOrTutor,
  });
}

// Get Unread Count (Protected)
export function useUnreadNotificationsCount() {
  const { data } = useNotifications();
  return data?.unreadCount ?? 0;
}

// Mark Notification as Read (Protected)
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await apiClient.patch(
        `/notifications/${notificationId}/read`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Mark All Notifications as Read (Protected)
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch('/notifications/read-all');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============ ADMIN HOOKS ============

// Get Admin Notifications
export function useAdminNotifications(query?: { page?: number; limit?: number }) {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['admin-notifications', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.set('page', String(query.page));
      if (query?.limit) params.set('limit', String(query.limit));
      const { data } = await apiClient.get(`/notifications/admin?${params.toString()}`);
      return data.data as NotificationResponse;
    },
    enabled: isAuthenticated && user?.role === 'SUPER_ADMIN',
  });
}

// Get Admin Unread Count
export function useAdminUnreadCount() {
  const { data } = useAdminNotifications();
  return data?.unreadCount ?? 0;
}

// Mark Admin Notification as Read
export function useAdminMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await apiClient.patch(`/notifications/admin/${notificationId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
}

// Mark All Admin Notifications as Read
export function useAdminMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch('/notifications/admin/read-all');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
}