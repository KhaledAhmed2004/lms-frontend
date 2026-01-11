import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Types
export type GrowthType = 'increase' | 'decrease' | 'no_change';

export interface Statistic {
  total: number;
  thisPeriodCount: number;
  lastPeriodCount: number;
  growth: number;
  formattedGrowth: string;
  growthType: GrowthType;
}

export interface OverviewStats {
  revenue: Statistic;
  students: Statistic;
  tutors: Statistic;
}

export interface RevenueByMonth {
  month: number;
  year: number;
  totalRevenue: number;
  totalCommission: number;
  totalPayouts: number;
  netProfit: number;
  sessionCount: number;
  totalHours: number;
  averageSessionPrice: number;
}

export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface UserDistribution {
  total: number;
  byRole?: RoleDistribution[];
  byStatus?: StatusDistribution[];
}

export type ActionType =
  | 'USER_REGISTERED'
  | 'TUTOR_VERIFIED'
  | 'SESSION_COMPLETED'
  | 'SESSION_SCHEDULED'
  | 'SESSION_CANCELLED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'SUBSCRIPTION_CREATED'
  | 'TRIAL_REQUEST_CREATED'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED';

export type ActivityStatus = 'success' | 'pending' | 'warning' | 'error';

export interface ActivityLogItem {
  _id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  actionType: ActionType;
  title: string;
  description: string;
  entityType: 'USER' | 'SESSION' | 'PAYMENT' | 'APPLICATION' | 'SUBSCRIPTION' | 'TRIAL_REQUEST';
  entityId?: string;
  status: ActivityStatus;
  createdAt: string;
}

export interface ActivityLogResponse {
  data: ActivityLogItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Overview Stats Hook
export function useOverviewStats(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-overview-stats', period],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/overview-stats', {
        params: { period },
      });
      return data.data as OverviewStats;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Revenue by Month Hook
export function useRevenueByMonth(year?: number, months?: number[]) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-revenue-by-month', year, months],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (year) params.year = year;
      if (months?.length) params.months = months.join(',');

      const { data } = await apiClient.get('/admin/revenue-by-month', { params });
      return data.data as RevenueByMonth[];
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// User Distribution Hook
export function useUserDistribution(groupBy: 'role' | 'status' | 'both' = 'both') {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-user-distribution', groupBy],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/user-distribution', {
        params: { groupBy },
      });
      return data.data as UserDistribution;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Recent Activity Hook
export function useRecentActivity(options?: {
  page?: number;
  limit?: number;
  actionType?: ActionType;
  status?: ActivityStatus;
  startDate?: string;
  endDate?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-recent-activity', options],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/recent-activity', {
        params: options,
      });
      return data as ActivityLogResponse;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Dashboard Stats Hook (comprehensive)
export function useDashboardStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/dashboard');
      return data.data;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Monthly Revenue Hook (with advanced filters)
export function useMonthlyRevenue(filters?: {
  year?: number;
  months?: string;
  tutorId?: string;
  studentId?: string;
  subscriptionTier?: 'FLEXIBLE' | 'REGULAR' | 'LONG_TERM';
  subject?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-monthly-revenue', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/monthly-revenue', {
        params: filters,
      });
      return data.data as RevenueByMonth[];
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Popular Subjects Hook
export function usePopularSubjects(limit = 10) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-popular-subjects', limit],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/popular-subjects', {
        params: { limit },
      });
      return data.data as Array<{
        subject: string;
        sessionCount: number;
        totalRevenue: number;
        averageRating?: number;
      }>;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Top Tutors Hook
export function useTopTutors(limit = 10, sortBy: 'sessions' | 'earnings' = 'sessions') {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-top-tutors', limit, sortBy],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/top-tutors', {
        params: { limit, sortBy },
      });
      return data.data as Array<{
        tutorId: string;
        tutorName: string;
        tutorEmail: string;
        totalSessions: number;
        totalEarnings: number;
        averageRating?: number;
        subjects: string[];
      }>;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Top Students Hook
export function useTopStudents(limit = 10, sortBy: 'spending' | 'sessions' = 'spending') {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-top-students', limit, sortBy],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/top-students', {
        params: { limit, sortBy },
      });
      return data.data as Array<{
        studentId: string;
        studentName: string;
        studentEmail: string;
        totalSessions: number;
        totalSpent: number;
        subscriptionTier: string;
      }>;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// User Growth Hook
export function useUserGrowth(year?: number, months?: number[]) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-user-growth', year, months],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (year) params.year = year;
      if (months?.length) params.months = months.join(',');

      const { data } = await apiClient.get('/admin/user-growth', { params });
      return data.data;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Application Stat Item with growth
export interface ApplicationStatItem {
  count: number;
  growth: number;
  growthType: 'increase' | 'decrease' | 'no_change';
}

// Application Stats Interface
export interface ApplicationStats {
  total: ApplicationStatItem;
  pending: ApplicationStatItem;
  interview: ApplicationStatItem;
  approved: ApplicationStatItem;
  rejected: ApplicationStatItem;
  revision: ApplicationStatItem;
}

// Application Stats Hook
export function useApplicationStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-application-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/application-stats');
      return data.data as ApplicationStats;
    },
    enabled: isAuthenticated && isAdmin,
    staleTime: 60 * 1000, // 1 minute cache
  });
}

// ============ TRANSACTIONS ============

export interface Transaction {
  _id: string;
  transactionId: string;
  type: 'STUDENT_PAYMENT' | 'TUTOR_PAYOUT';
  amount: number;
  userName: string;
  userEmail: string;
  userType: 'student' | 'tutor';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PROCESSING';
  date: string;
  description: string;
  sessions?: number;
  hours?: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  studentPayments: {
    count: number;
    total: number;
  };
  tutorPayouts: {
    count: number;
    total: number;
  };
}

// Transactions Hook
export function useTransactions(options?: {
  page?: number;
  limit?: number;
  type?: 'STUDENT_PAYMENT' | 'TUTOR_PAYOUT' | 'all';
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-transactions', options],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/transactions', {
        params: options,
      });
      return {
        data: data.data as Transaction[],
        meta: data.meta,
      } as TransactionsResponse;
    },
    enabled: isAuthenticated && isAdmin,
  });
}

// Transaction Stats Hook
export function useTransactionStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'SUPER_ADMIN';

  return useQuery({
    queryKey: ['admin-transaction-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/transaction-stats');
      return data.data as TransactionStats;
    },
    enabled: isAuthenticated && isAdmin,
    staleTime: 60 * 1000, // 1 minute cache
  });
}
